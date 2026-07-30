import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Route, Film } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';
import { franchiseGuides, getFranchiseGuide, FranchiseFilm } from '@/lib/franchiseGuides';

export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<{ franchise?: string; order?: string }>;
}

interface ResolvedFilm extends FranchiseFilm {
  id: number | null;
  poster_path: string | null;
  vote_average: number;
}

async function resolveFilm(film: FranchiseFilm): Promise<ResolvedFilm> {
  try {
    const res = await tmdbClient.searchMovies(film.title, 1);
    const match =
      res.results?.find((m) => m.release_date?.startsWith(String(film.year))) ?? res.results?.[0] ?? null;
    return {
      ...film,
      id: match?.id ?? null,
      poster_path: match?.poster_path ?? null,
      vote_average: match?.vote_average ?? 0,
    };
  } catch {
    return { ...film, id: null, poster_path: null, vote_average: 0 };
  }
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const guide = getFranchiseGuide(sp.franchise || franchiseGuides[0].slug) || franchiseGuides[0];
  return buildMetadata({
    title: `${guide.name} — Viewing Order Guide`,
    description: guide.description,
    path: sp.franchise ? `/franchise-guides?franchise=${guide.slug}` : '/franchise-guides',
  });
}

export default async function FranchiseGuidesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const guide = getFranchiseGuide(sp.franchise || franchiseGuides[0].slug) || franchiseGuides[0];
  const order = sp.order === 'chronological' ? 'chronological' : 'release';

  const resolved = await Promise.all(guide.films.map(resolveFilm));
  const sorted = [...resolved].sort((a, b) =>
    order === 'chronological' ? a.chronologicalOrder - b.chronologicalOrder : a.releaseOrder - b.releaseOrder
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Route className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Franchise Viewing Order Guides</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Franchises where release order and in-universe chronological order genuinely diverge.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {franchiseGuides.map((f) => (
          <Link
            key={f.slug}
            href={`/franchise-guides?franchise=${f.slug}${order === 'chronological' ? '&order=chronological' : ''}`}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              f.slug === guide.slug ? 'bg-brand-600 text-white' : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {f.name}
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Film className="w-5 h-5 text-brand-400" />
          <h2 className="text-xl font-bold text-white">{guide.name}</h2>
        </div>
        <p className="text-sm text-gray-400 max-w-3xl">{guide.description}</p>

        <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-800 w-fit">
          <Link
            href={`/franchise-guides?franchise=${guide.slug}`}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              order === 'release' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Release Order
          </Link>
          <Link
            href={`/franchise-guides?franchise=${guide.slug}&order=chronological`}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              order === 'chronological' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Chronological Order
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {sorted.map((film, idx) =>
          film.id ? (
            <div key={film.id} className="relative">
              <span className="absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-extrabold flex items-center justify-center shadow-lg">
                {idx + 1}
              </span>
              <MovieCard id={film.id} title={film.title} posterPath={film.poster_path} voteAverage={film.vote_average} releaseDate={String(film.year)} mediaType="movie" />
            </div>
          ) : (
            <div key={film.title} className="aspect-[2/3] rounded-2xl bg-gray-900/60 border border-gray-800 flex items-center justify-center p-4 text-center">
              <p className="text-xs text-gray-500">{film.title} ({film.year}) — not found on TMDB</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
