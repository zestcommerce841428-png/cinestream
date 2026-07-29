import type { Metadata } from 'next';
import Link from 'next/link';
import { DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Box Office Revenue Blockbusters',
  description: 'Explore the highest-grossing movies of all time worldwide, ranked by box office revenue.',
  path: '/box-office',
});

interface BoxOfficePageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BoxOfficePage({ searchParams }: BoxOfficePageProps) {
  const sp = await searchParams;
  const page = Math.min(Math.max(parseInt(sp.page || '1', 10) || 1, 1), 500);

  const res = await tmdbClient.getBoxOfficeMovies(page);
  const movies = res.results || [];
  const totalPages = Math.min(res.total_pages || 1, 500);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-8 h-8 text-emerald-400" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Box Office Revenue Blockbusters</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Explore the highest-grossing movies of all time worldwide. Looking for the highest-rated instead? See the{' '}
            <Link href="/leaderboard" className="text-brand-400 hover:underline">
              Ratings Leaderboard
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
            voteAverage={movie.vote_average}
            releaseDate={movie.release_date}
            mediaType="movie"
          />
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-gray-800 pt-6">
        <Link
          href={`/box-office?page=${Math.max(page - 1, 1)}`}
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
          href={`/box-office?page=${page + 1}`}
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
