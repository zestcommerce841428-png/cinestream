import type { Metadata } from 'next';
import { RefreshCw } from 'lucide-react';
import { tmdbClient, Movie } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';
import { resolveKeywordId } from '@/lib/keywords';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Remakes & Reboots',
  description: 'Movies tagged as remakes or reboots of earlier films, merged and ranked by popularity.',
  path: '/remakes-reboots',
});

async function getRemakesAndReboots(): Promise<Movie[]> {
  const [remakeId, rebootId] = await Promise.all([resolveKeywordId('remake'), resolveKeywordId('reboot')]);

  const ids = [remakeId, rebootId].filter((id): id is number => id !== null);
  if (ids.length === 0) return [];

  const results = await Promise.all(
    ids.map((id) =>
      tmdbClient
        .getKeywordMovies(id)
        .then((r) => r.results || [])
        .catch(() => [] as Movie[])
    )
  );

  const merged = new Map<number, Movie>();
  results.flat().forEach((m) => merged.set(m.id, m));

  return [...merged.values()].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
}

export default async function RemakesRebootsPage() {
  const movies = await getRemakesAndReboots();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Remakes &amp; Reboots</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Movies tagged with the &quot;remake&quot; or &quot;reboot&quot; keywords on TMDB, merged into one
          de-duplicated list and ranked by popularity.
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
          <p className="text-sm text-gray-400">No remakes or reboots could be found right now.</p>
        </div>
      )}
    </div>
  );
}
