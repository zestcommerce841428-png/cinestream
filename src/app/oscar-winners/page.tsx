import type { Metadata } from 'next';
import { Award } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Oscar & Academy Award Winners',
  description: 'Explore Best Picture winners and Academy Award-winning cinematic masterpieces.',
  path: '/oscar-winners',
});

export default async function OscarWinnersPage() {
  const res = await tmdbClient.getOscarWinnerMovies();
  const movies = res.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Award className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Oscar & Academy Award Winners</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Explore Best Picture winners and Academy Award-winning cinematic masterpieces.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((m) => (
          <MovieCard
            key={m.id}
            id={m.id}
            title={m.title}
            posterPath={m.poster_path}
            voteAverage={m.vote_average}
            releaseDate={m.release_date}
            mediaType="movie"
          />
        ))}
      </div>
    </div>
  );
}
