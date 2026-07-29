import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Tag, Film } from 'lucide-react';
import { tmdbClient, Movie } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getKeyword(id: number) {
  try {
    const [keyword, moviesRes] = await Promise.all([
      tmdbClient.getKeywordDetails(id),
      tmdbClient.getKeywordMovies(id).catch(() => ({ results: [] })),
    ]);
    return { keyword, movies: (moviesRes.results || []) as Movie[] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getKeyword(parseInt(id, 10));
  if (!data) {
    return { title: 'Keyword Not Found', robots: { index: false, follow: false } };
  }
  return buildMetadata({
    title: `"${data.keyword.name}" Keyword`,
    description: `Browse movies tagged with the keyword "${data.keyword.name}" on CineStream.`,
    path: `/keyword/${data.keyword.id}`,
  });
}

export default async function KeywordPage({ params }: PageProps) {
  const { id } = await params;
  const keywordId = parseInt(id, 10);
  const data = await getKeyword(keywordId);

  if (!data) {
    notFound();
  }

  const { keyword, movies } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 flex items-center space-x-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
          <Tag className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Keyword Tag</span>
          <h1 className="text-3xl font-extrabold text-white capitalize">{keyword.name}</h1>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Film className="w-5 h-5 text-brand-500" />
          <span>Tagged Movies ({movies.length})</span>
        </h2>

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
          <p className="text-sm text-gray-400">No movies found tagged with this keyword.</p>
        )}
      </div>
    </div>
  );
}
