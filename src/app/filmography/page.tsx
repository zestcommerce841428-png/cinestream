import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

const FEATURED_PEOPLE = [
  { id: 525, name: 'Christopher Nolan' },
  { id: 488, name: 'Steven Spielberg' },
  { id: 1032, name: 'Martin Scorsese' },
  { id: 138, name: 'Quentin Tarantino' },
  { id: 137427, name: 'Denis Villeneuve' },
  { id: 5655, name: 'Greta Gerwig' },
];

interface PageProps {
  searchParams: Promise<{ person?: string }>;
}

function resolvePersonId(raw?: string): number {
  const parsed = parseInt(raw || '', 10);
  return FEATURED_PEOPLE.some((p) => p.id === parsed) || parsed > 0 ? parsed || FEATURED_PEOPLE[0].id : FEATURED_PEOPLE[0].id;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const personId = resolvePersonId(sp.person);
  const person = await tmdbClient.getPersonDetails(personId).catch(() => null);
  return buildMetadata({
    title: person ? `${person.name} — Filmography Timeline` : 'Filmography Timeline Visualizer',
    description: person
      ? `Chronological filmography timeline for ${person.name}, ordered by release date.`
      : 'Chronological filmography timeline visualizer for legendary actors and directors.',
    path: '/filmography',
  });
}

export default async function FilmographyPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const personId = resolvePersonId(sp.person);

  const [person, creditsRes] = await Promise.all([
    tmdbClient.getPersonDetails(personId),
    tmdbClient.getPersonMovieCredits(personId),
  ]);

  const credits = (creditsRes.crew || creditsRes.cast || [])
    .slice()
    .sort((a: any, b: any) => new Date(b.release_date || 0).getTime() - new Date(a.release_date || 0).getTime());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Filmography Timeline Visualizer</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Chronological timeline visualizer for legendary actors and directors.</p>

        <div className="flex flex-wrap gap-2 pt-4">
          {FEATURED_PEOPLE.map((p) => (
            <Link
              key={p.id}
              href={`/filmography?person=${p.id}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                p.id === personId
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-900 border border-gray-800 text-gray-300 hover:text-white hover:border-brand-500/50'
              }`}
            >
              {p.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-4 bg-gray-900/80 p-6 rounded-2xl border border-gray-800">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-950 flex-shrink-0">
            {person.profile_path ? (
              <Image src={getImageUrl(person.profile_path, 'w185')} alt={person.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Pic</div>
            )}
          </div>
          <div>
            <Link href={`/person/${person.id}`} className="text-2xl font-extrabold text-white hover:text-brand-400 transition">
              {person.name}
            </Link>
            <p className="text-xs text-gray-400">
              {person.known_for_department} • {credits.length} Titles Released
            </p>
          </div>
        </div>

        {credits.length > 0 ? (
          <div className="space-y-3 pl-4 border-l-2 border-brand-500/40">
            {credits.slice(0, 20).map((item: any, idx: number) => (
              <Link
                key={`${item.id}-${idx}`}
                href={`/movie/${item.id}`}
                className="bg-gray-900/40 p-4 rounded-xl border border-gray-800/80 hover:border-brand-500/40 transition flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-sm text-white hover:text-brand-400">{item.title}</h3>
                  <p className="text-xs text-gray-400">{item.job || item.character || 'Contributor'}</p>
                </div>
                <span className="text-xs font-bold text-brand-400">{item.release_date ? item.release_date.split('-')[0] : 'N/A'}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No filmography credits found.</p>
        )}
      </div>
    </div>
  );
}
