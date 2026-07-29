import type { Metadata } from 'next';
import { Calendar } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Global Theatrical Release Calendar',
  description: 'Upcoming movie releases sorted chronologically by release date, soonest first.',
  path: '/release-calendar',
});

export default async function ReleaseCalendarPage() {
  const today = new Date().toISOString().slice(0, 10);
  // Distinct from /upcoming (TMDB's popularity-ranked "upcoming" list): this sorts strictly
  // chronologically by release date, which is what a "calendar" implies.
  const res = await tmdbClient.discoverMovies({
    'primary_release_date.gte': today,
    sort_by: 'primary_release_date.asc',
    'vote_count.gte': 1,
  });
  const movies = res.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Global Theatrical Release Calendar</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Upcoming releases sorted chronologically by release date, soonest first.</p>
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
        <p className="text-sm text-gray-400">No upcoming releases found.</p>
      )}
    </div>
  );
}
