import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Scale } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';
import CompareSelector from '@/components/CompareSelector';

export const revalidate = 3600;

const DEFAULT_MOVIE_1 = 550; // Fight Club
const DEFAULT_MOVIE_2 = 603; // The Matrix

interface PageProps {
  searchParams: Promise<{ movie1?: string; movie2?: string }>;
}

function parseId(raw: string | undefined, fallback: number): number {
  const parsed = parseInt(raw || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const movie1Id = parseId(sp.movie1, DEFAULT_MOVIE_1);
  const movie2Id = parseId(sp.movie2, DEFAULT_MOVIE_2);
  const [m1, m2] = await Promise.all([
    tmdbClient.getMovieDetails(movie1Id).catch(() => null),
    tmdbClient.getMovieDetails(movie2Id).catch(() => null),
  ]);
  const title = m1 && m2 ? `${m1.title} vs ${m2.title}` : 'Side-by-Side Media Comparison Engine';
  return buildMetadata({
    title,
    description: 'Compare budget, revenue, vote scores, runtime, and statistics between two films.',
    path: '/compare',
  });
}

export default async function ComparePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const movie1Id = parseId(sp.movie1, DEFAULT_MOVIE_1);
  const movie2Id = parseId(sp.movie2, DEFAULT_MOVIE_2);

  const [movie1, movie2] = await Promise.all([
    tmdbClient.getMovieDetails(movie1Id).catch(() => null),
    tmdbClient.getMovieDetails(movie2Id).catch(() => null),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Scale className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Side-by-Side Media Comparison Engine</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Compare budget, revenue, vote scores, runtime, and statistics between two films.</p>
      </div>

      <CompareSelector movie1Id={movie1Id} movie2Id={movie2Id} />

      {movie1 && movie2 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[movie1, movie2].map((movie, idx) => (
            <div key={idx} className="bg-gray-900/80 p-6 rounded-3xl border border-gray-800 space-y-4 text-center md:text-left">
              <div className="relative aspect-[2/3] w-full max-w-[240px] mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-xl bg-gray-950 border border-gray-800">
                {movie.poster_path ? (
                  <Image src={getImageUrl(movie.poster_path, 'w500')} alt={movie.title} fill sizes="240px" className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                )}
              </div>
              <h2 className="text-2xl font-extrabold text-white">{movie.title}</h2>
              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  <strong>Rating:</strong> ⭐ {movie.vote_average?.toFixed(1)} ({movie.vote_count?.toLocaleString()} votes)
                </p>
                <p>
                  <strong>Release Date:</strong> {movie.release_date}
                </p>
                <p>
                  <strong>Runtime:</strong> {movie.runtime} mins
                </p>
                <p>
                  <strong>Budget:</strong> ${movie.budget?.toLocaleString()}
                </p>
                <p>
                  <strong>Revenue:</strong> ${movie.revenue?.toLocaleString()}
                </p>
                <p>
                  <strong>Popularity Score:</strong> {movie.popularity?.toFixed(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
          <p className="text-gray-400">One or both titles could not be found. Try picking different movies above.</p>
        </div>
      )}
    </div>
  );
}
