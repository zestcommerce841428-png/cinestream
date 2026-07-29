import type { Metadata } from 'next';
import Link from 'next/link';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

interface TopRatedPageProps {
  searchParams: Promise<{ type?: string; page?: string }>;
}

export const metadata: Metadata = buildMetadata({
  title: 'Top Rated Masterpieces',
  description: 'Explore the highest user-rated movies and television series of all time, ranked by TMDB community score.',
  path: '/top-rated',
});

export default async function TopRatedPage({ searchParams }: TopRatedPageProps) {
  const sp = await searchParams;
  const mediaType: 'movie' | 'tv' = sp.type === 'tv' ? 'tv' : 'movie';
  const page = Math.min(Math.max(parseInt(sp.page || '1', 10) || 1, 1), 500);

  const res = mediaType === 'movie' ? await tmdbClient.getMovieTopRated(page) : await tmdbClient.getTVTopRated(page);
  const items = res.results || [];
  const totalPages = Math.min(res.total_pages || 1, 500);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Star className="w-8 h-8 text-amber-400 fill-current" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Top Rated Masterpieces</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">Explore the highest user-rated movies and television series of all time.</p>
        </div>

        <div className="flex bg-gray-900/90 p-1.5 rounded-2xl border border-gray-800 self-start sm:self-auto">
          <Link
            href="/top-rated?type=movie"
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${mediaType === 'movie' ? 'bg-amber-500 text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            Top Movies
          </Link>
          <Link
            href="/top-rated?type=tv"
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${mediaType === 'tv' ? 'bg-amber-500 text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            Top TV Series
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {items.map((item: any) => (
          <MovieCard
            key={`${mediaType}-${item.id}`}
            id={item.id}
            title={item.title || item.name}
            posterPath={item.poster_path}
            voteAverage={item.vote_average}
            releaseDate={item.release_date || item.first_air_date}
            mediaType={mediaType}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-800 pt-6">
        <Link
          href={`/top-rated?type=${mediaType}&page=${Math.max(page - 1, 1)}`}
          aria-disabled={page <= 1}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm font-medium text-gray-300 hover:text-white transition ${
            page <= 1 ? 'pointer-events-none opacity-40' : ''
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Link>

        <span className="text-xs text-gray-400 font-medium">
          Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong>
        </span>

        <Link
          href={`/top-rated?type=${mediaType}&page=${page + 1}`}
          aria-disabled={page >= totalPages}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm font-medium text-gray-300 hover:text-white transition ${
            page >= totalPages ? 'pointer-events-none opacity-40' : ''
          }`}
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
