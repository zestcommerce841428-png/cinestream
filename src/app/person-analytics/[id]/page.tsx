import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Award, ArrowLeft } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';
import { buildMetadata, truncateDescription } from '@/lib/metadata';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getData(id: number) {
  try {
    const [person, creditsRes] = await Promise.all([
      tmdbClient.getPersonDetails(id),
      tmdbClient.getPersonCombinedCredits(id),
    ]);
    const credits: any[] = creditsRes.cast || creditsRes.crew || [];
    return { person, credits };
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

  const { person, credits } = data;
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
    </div>
  );
}
