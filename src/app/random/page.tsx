import type { Metadata } from 'next';
import Link from 'next/link';
import { RefreshCw, Sparkles } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({
  title: 'Undecided Movie Night Spinner',
  description: "Can't decide what to watch? Get a highly rated random movie pick.",
  path: '/random',
  noIndex: true,
});

export default async function RandomPickerPage() {
  const randomPage = Math.floor(Math.random() * 20) + 1;
  const res = await tmdbClient.getRandomMovie(randomPage).catch(() => ({ results: [] }));
  const results = res.results || [];
  const randomMovie = results.length > 0 ? results[Math.floor(Math.random() * results.length)] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-center">
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="w-16 h-16 rounded-full bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center mx-auto shadow-xl">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Undecided Movie Night Spinner</h1>
        <p className="text-gray-400 text-sm">Can&apos;t decide what to watch? Spin below to pick a highly rated random title!</p>
        <Link
          href="/random"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-xl shadow-brand-600/30 transition-all hover:scale-105"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Spin Random Movie</span>
        </Link>
      </div>

      {randomMovie && (
        <div className="max-w-sm mx-auto pt-6">
          <MovieCard
            id={randomMovie.id}
            title={randomMovie.title}
            posterPath={randomMovie.poster_path}
            voteAverage={randomMovie.vote_average}
            releaseDate={randomMovie.release_date}
            mediaType="movie"
          />
        </div>
      )}
    </div>
  );
}
