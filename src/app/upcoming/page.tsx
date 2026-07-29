import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

const REGIONS = [
  { code: 'US', label: 'United States (US)' },
  { code: 'GB', label: 'United Kingdom (GB)' },
  { code: 'CA', label: 'Canada (CA)' },
  { code: 'IN', label: 'India (IN)' },
];

export const metadata: Metadata = buildMetadata({
  title: 'Upcoming Releases',
  description: 'Get early previews of upcoming theatrical movie releases worldwide.',
  path: '/upcoming',
});

interface UpcomingPageProps {
  searchParams: Promise<{ region?: string; page?: string }>;
}

export default async function UpcomingPage({ searchParams }: UpcomingPageProps) {
  const sp = await searchParams;
  const region = REGIONS.some((r) => r.code === sp.region) ? sp.region! : 'US';
  const page = Math.min(Math.max(parseInt(sp.page || '1', 10) || 1, 1), 500);

  const res = await tmdbClient.getMovieUpcomingRegion(region, page);
  const movies = res.results || [];
  const totalPages = Math.min(res.total_pages || 1, 500);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-8 h-8 text-rose-500" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Upcoming Releases</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">Get early previews of upcoming theatrical releases worldwide.</p>
        </div>

        <div className="flex items-center space-x-2 bg-gray-900/90 p-2 rounded-2xl border border-gray-800 self-start sm:self-auto">
          <span className="text-xs text-gray-400 font-semibold pl-2">Region:</span>
          <div className="flex flex-wrap gap-1">
            {REGIONS.map((r) => (
              <Link
                key={r.code}
                href={`/upcoming?region=${r.code}`}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  region === r.code ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {r.code}
              </Link>
            ))}
          </div>
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
          href={`/upcoming?region=${region}&page=${Math.max(page - 1, 1)}`}
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
          href={`/upcoming?region=${region}&page=${page + 1}`}
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
