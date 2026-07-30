import type { Metadata } from 'next';
import { Scale } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Underrated & Overrated Movies',
  description: 'A computed comparison of critical rating against popularity: movies punching above their audience, and movies punching below their score.',
  path: '/underrated-overrated',
});

export default async function UnderratedOverratedPage() {
  const poolRes = await tmdbClient.discoverMovies({
    sort_by: 'popularity.desc',
    'vote_count.gte': 1000,
  });
  const pool = poolRes.results || [];

  const avgPopularity = pool.length > 0 ? pool.reduce((a, m) => a + m.popularity, 0) / pool.length : 0;

  const underrated = pool
    .filter((m) => m.vote_average >= 7.5 && m.popularity < avgPopularity)
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 12);

  const overrated = pool
    .filter((m) => m.vote_average <= 6.5 && m.popularity >= avgPopularity)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 12);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Scale className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Underrated &amp; Overrated Movies</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          A computed analysis, not a curated list: we pull a pool of widely-seen movies (1,000+ votes) sorted by
          popularity and calculate their average popularity score. &quot;Underrated&quot; titles score 7.5+ but sit
          below that average — quality that hasn&apos;t translated into buzz. &quot;Overrated&quot; titles score 6.5
          or lower but sit at or above that average — buzz that has outrun the reviews.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Underrated</h2>
        {underrated.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {underrated.map((m) => (
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
            <p className="text-sm text-gray-400">No underrated titles found in the current pool.</p>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Overrated</h2>
        {overrated.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {overrated.map((m) => (
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
            <p className="text-sm text-gray-400">No overrated titles found in the current pool.</p>
          </div>
        )}
      </section>
    </div>
  );
}
