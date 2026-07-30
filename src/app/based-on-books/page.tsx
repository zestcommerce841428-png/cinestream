import type { Metadata } from 'next';
import { Book } from 'lucide-react';
import { tmdbClient, Movie } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';
import { resolveKeywordId } from '@/lib/keywords';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Based on a Book',
  description: 'Movies tagged as based on a novel or book on TMDB, ranked by popularity.',
  path: '/based-on-books',
});

async function getBookAdaptations(): Promise<Movie[]> {
  const keywordId = await resolveKeywordId('based on novel or book');
  if (keywordId === null) return [];

  const res = await tmdbClient.getKeywordMovies(keywordId).catch(() => ({ results: [] as Movie[] }));
  return [...(res.results || [])].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
}

export default async function BasedOnBooksPage() {
  const movies = await getBookAdaptations();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Book className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Based on a Book</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Movies tagged with the &quot;based on novel or book&quot; keyword on TMDB, ranked by popularity.
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
          <p className="text-sm text-gray-400">No book adaptations could be found right now.</p>
        </div>
      )}
    </div>
  );
}
