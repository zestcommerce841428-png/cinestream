import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Award, ArrowLeft, Users } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';
import { buildMetadata, truncateDescription } from '@/lib/metadata';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

interface Collaborator {
  id: number;
  name: string;
  profile_path: string | null;
  count: number;
}

async function getCollaborators(personId: number, credits: any[]): Promise<Collaborator[]> {
  const topCredits = [...credits].sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 12);

  const castLists = await Promise.all(
    topCredits.map(async (c) => {
      try {
        const creditsRes =
          c.media_type === 'tv' ? await tmdbClient.getTVAggregateCredits(c.id) : await tmdbClient.getMovieCredits(c.id);
        return (creditsRes.cast || []).slice(0, 15);
      } catch {
        return [] as any[];
      }
    })
  );

  const tally = new Map<number, Collaborator>();
  castLists.flat().forEach((p: any) => {
    if (p.id === personId) return;
    const existing = tally.get(p.id);
    if (existing) existing.count += 1;
    else tally.set(p.id, { id: p.id, name: p.name, profile_path: p.profile_path, count: 1 });
  });

  return [...tally.values()]
    .filter((c) => c.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

async function getData(id: number) {
  try {
    const [person, creditsRes] = await Promise.all([
      tmdbClient.getPersonDetails(id),
      tmdbClient.getPersonCombinedCredits(id),
    ]);
    const credits: any[] = creditsRes.cast || creditsRes.crew || [];
    const collaborators = await getCollaborators(id, credits);
    return { person, credits, collaborators };
  } catch {
    return null;
  }
}

function computeAvgRating(credits: any[]): number {
  return credits.reduce((acc, c) => acc + (c.vote_average || 0), 0) / (credits.length || 1);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) {
    return { title: 'Person Not Found', robots: { index: false, follow: false } };
  }

  const { person, credits } = data;
  const avgRating = computeAvgRating(credits);

  return buildMetadata({
    title: `Career Analytics — ${person.name}`,
    description: truncateDescription(
      `Career analytics for ${person.name}: ${credits.length} total credits, ${avgRating.toFixed(1)} average film rating, and a popularity index of ${person.popularity?.toFixed(0) || 0} computed from TMDB combined credits.`
    ),
    path: `/person-analytics/${person.id}`,
    image: person.profile_path ? getImageUrl(person.profile_path, 'w780') : null,
    type: 'profile',
  });
}

export default async function PersonAnalyticsPage({ params }: PageProps) {
  const { id } = await params;
  const personId = parseInt(id, 10);
  const data = await getData(personId);

  if (!data) {
    notFound();
  }

  const { person, credits, collaborators } = data;
  const avgRating = computeAvgRating(credits);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/person/${personId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Award className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Career Analytics - {person.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 space-y-2">
          <span className="text-xs text-gray-400 font-semibold">Total Credits</span>
          <p className="text-3xl font-extrabold text-white">{credits.length}</p>
        </div>

        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 space-y-2">
          <span className="text-xs text-gray-400 font-semibold">Average Film Rating</span>
          <p className="text-3xl font-extrabold text-amber-400">⭐ {avgRating.toFixed(1)}</p>
        </div>

        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 space-y-2">
          <span className="text-xs text-gray-400 font-semibold">Popularity Index</span>
          <p className="text-3xl font-extrabold text-brand-400">{person.popularity?.toFixed(0)}</p>
        </div>
      </div>

      {collaborators.length > 0 && (
        <div className="space-y-4 border-t border-gray-800 pt-8">
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-brand-500" />
            <h2 className="text-xl font-bold text-white">Frequent Collaborators</h2>
          </div>
          <p className="text-xs text-gray-500">
            People who appeared alongside {person.name} in 2 or more of their most popular titles.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {collaborators.map((c) => (
              <Link key={c.id} href={`/person/${c.id}`} className="group text-center space-y-1.5">
                <div className="relative aspect-square w-full rounded-full overflow-hidden bg-gray-900 border border-gray-800 group-hover:border-brand-500/50 transition">
                  <Image src={getImageUrl(c.profile_path, 'w185')} alt={c.name} fill className="object-cover" />
                </div>
                <p className="text-[11px] font-semibold text-gray-300 group-hover:text-white line-clamp-1">{c.name}</p>
                <p className="text-[10px] text-brand-400">{c.count} titles together</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
