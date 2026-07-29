import type { Metadata } from 'next';
import Link from 'next/link';
import { Tv, ChevronLeft, ChevronRight } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Currently On The Air TV Series',
  description: 'Discover currently airing television shows with active seasons.',
  path: '/on-the-air',
});

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function OnTheAirPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.min(Math.max(parseInt(sp.page || '1', 10) || 1, 1), 500);

  const res = await tmdbClient.getTVOnTheAir(page);
  const shows = res.results || [];
  const totalPages = Math.min(res.total_pages || 1, 500);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Tv className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Currently On The Air TV Series</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">Discover currently airing television shows with active seasons.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {shows.map((show) => (
          <MovieCard
            key={show.id}
            id={show.id}
            title={show.name}
            posterPath={show.poster_path}
            voteAverage={show.vote_average}
            releaseDate={show.first_air_date}
            mediaType="tv"
          />
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-gray-800 pt-6">
        <Link
          href={`/on-the-air?page=${Math.max(page - 1, 1)}`}
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
          href={`/on-the-air?page=${page + 1}`}
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
