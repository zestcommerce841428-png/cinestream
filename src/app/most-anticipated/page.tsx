import type { Metadata } from 'next';
import { TrendingUp } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Most Anticipated Movies',
  description: 'Upcoming movies ranked by popularity, surfacing what audiences are most excited about right now.',
  path: '/most-anticipated',
});

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default async function MostAnticipatedPage() {
  const today = todayISO();
  const res = await tmdbClient.discoverMovies({
    'primary_release_date.gte': today,
    sort_by: 'popularity.desc',
  });
  const movies = res.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Most Anticipated Movies</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Every unreleased movie in TMDB&apos;s catalog, ranked purely by popularity — not by release date or region
          like Upcoming Releases. This surfaces what people are buzzing about most, whenever it eventually arrives.
        </p>
      </div>

      {movies.length > 0 ? (
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
      ) : (
        <div className="text-center py-20 bg-gray-900/40 rounded-3xl border border-gray-800">
          <p className="text-sm text-gray-400">No upcoming movies found right now. Check back soon.</p>
        </div>
      )}
    </div>
  );
}
