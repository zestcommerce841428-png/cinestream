import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'New This Week',
  description: 'Movies with a primary release date in the last 7 days, ranked by popularity.',
  path: '/new-this-week',
});

function isoDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export default async function NewThisWeekPage() {
  const today = isoDaysAgo(0);
  const weekAgo = isoDaysAgo(7);

  const res = await tmdbClient.discoverMovies({
    'primary_release_date.gte': weekAgo,
    'primary_release_date.lte': today,
    sort_by: 'popularity.desc',
  });
  const movies = res.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">New This Week</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Movies with a primary release date in the last 7 days ({weekAgo} to {today}), most popular first. This is a
          strict rolling release-date window — unlike Now Playing in Theaters, which pulls from TMDB&apos;s broader
          currently-in-cinemas list regardless of how long a title has already been out.
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
          <p className="text-sm text-gray-400">No new releases found in the last 7 days.</p>
        </div>
      )}
    </div>
  );
}
