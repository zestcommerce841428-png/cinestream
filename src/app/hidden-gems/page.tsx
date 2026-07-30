import type { Metadata } from 'next';
import { Gem } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Hidden Gems — Underseen High-Rated Movies',
  description: 'Highly-rated movies that never built a big audience: strong scores, low vote counts, worth discovering.',
  path: '/hidden-gems',
});

export default async function HiddenGemsPage() {
  const res = await tmdbClient.discoverMovies({
    'vote_average.gte': 7.5,
    'vote_count.gte': 50,
    'vote_count.lte': 600,
    sort_by: 'vote_average.desc',
  });
  const movies = res.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Gem className="w-8 h-8 text-cyan-400" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Hidden Gems</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Movies rated 7.5+ by the people who found them, but with under 600 votes — strong scores that never reached a big audience.
        </p>
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
