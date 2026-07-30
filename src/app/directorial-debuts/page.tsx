import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clapperboard } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Directorial Debuts',
  description: 'The first feature film from acclaimed directors, before they became household names.',
  path: '/directorial-debuts',
});

// Names, not IDs — resolved via search at request time (see /franchise-guides for the
// same reasoning). A wrong hardcoded person ID would silently show a different person's
// filmography with no visible symptom.
const NOTABLE_DIRECTORS = [
  'Christopher Nolan',
  'Quentin Tarantino',
  'Greta Gerwig',
  'Jordan Peele',
  'Denis Villeneuve',
  'Bong Joon Ho',
  'Sofia Coppola',
  'Taika Waititi',
  'Chloé Zhao',
  'Ryan Coogler',
  'Ari Aster',
  'Barry Jenkins',
];

interface Debut {
  directorId: number;
  directorName: string;
  profile_path: string | null;
  movieId: number;
  movieTitle: string;
  poster_path: string | null;
  releaseDate: string;
}

async function getDebut(name: string): Promise<Debut | null> {
  try {
    const searchRes = await tmdbClient.searchPeople(name);
    const person = searchRes.results?.[0];
    if (!person) return null;

    const credits = await tmdbClient.getPersonCombinedCredits(person.id).catch(() => ({ crew: [] as any[] }));
    const directed = (credits.crew || []).filter((c: any) => c.job === 'Director' && c.release_date);
    if (directed.length === 0) return null;

    const debut = [...directed].sort((a, b) => (a.release_date < b.release_date ? -1 : 1))[0];
    return {
      directorId: person.id,
      directorName: person.name,
      profile_path: person.profile_path,
      movieId: debut.id,
      movieTitle: debut.title || debut.name,
      poster_path: debut.poster_path,
      releaseDate: debut.release_date,
    };
  } catch {
    return null;
  }
}

export default async function DirectorialDebutsPage() {
  const debuts = (await Promise.all(NOTABLE_DIRECTORS.map(getDebut))).filter((d): d is Debut => d !== null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Clapperboard className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Directorial Debuts</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          The first feature film credited to each director, resolved from their full TMDB filmography — before they became household names.
        </p>
      </div>

      {debuts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {debuts.map((d) => (
            <div key={d.directorId} className="space-y-2">
              <Link href={`/movie/${d.movieId}`} className="group block">
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 group-hover:border-brand-500/50 transition">
                  <Image src={getImageUrl(d.poster_path, 'w342')} alt={d.movieTitle} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 space-y-1">
                    <p className="text-xs font-bold text-white line-clamp-2">{d.movieTitle}</p>
                    <p className="text-[10px] text-gray-400">{d.releaseDate?.slice(0, 4)}</p>
                  </div>
                </div>
              </Link>
              <Link href={`/person/${d.directorId}`} className="flex items-center space-x-2 group">
                <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                  <Image src={getImageUrl(d.profile_path, 'w92')} alt={d.directorName} fill className="object-cover" />
                </div>
                <span className="text-[11px] font-semibold text-gray-400 group-hover:text-white transition line-clamp-1">
                  {d.directorName}
                </span>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900/40 rounded-3xl border border-gray-800">
          <p className="text-sm text-gray-400">Could not resolve any directors right now.</p>
        </div>
      )}
    </div>
  );
}
