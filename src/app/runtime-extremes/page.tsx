import type { Metadata } from 'next';
import { Clock } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Runtime Extremes — Longest & Shortest Movies',
  description: 'Sprawling three-hour epics and lean, tightly-paced features under 80 minutes, sorted separately by weight and popularity.',
  path: '/runtime-extremes',
});

export default async function RuntimeExtremesPage() {
  const [epicsRes, tightRes] = await Promise.all([
    tmdbClient.discoverMovies({
      'with_runtime.gte': 180,
      sort_by: 'vote_count.desc',
    }),
    tmdbClient.discoverMovies({
      'with_runtime.gte': 40,
      'with_runtime.lte': 80,
      sort_by: 'popularity.desc',
    }),
  ]);

  const epics = epicsRes.results || [];
  const tight = tightRes.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Clock className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Runtime Extremes</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Two ends of the runtime spectrum: sprawling 3-hour-plus epics with the deepest audiences, and tightly-paced
          features between 40 and 80 minutes (the lower bound filters out shorts and specials).
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Longest Epics</h2>
        {epics.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {epics.map((m) => (
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
            <p className="text-sm text-gray-400">No long-runtime epics found.</p>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Tightest Runtimes</h2>
        {tight.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {tight.map((m) => (
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
            <p className="text-sm text-gray-400">No short-runtime features found.</p>
          </div>
        )}
      </section>
    </div>
  );
}
