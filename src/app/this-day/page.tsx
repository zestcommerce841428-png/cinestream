import type { Metadata } from 'next';
import { CalendarDays } from 'lucide-react';
import { tmdbClient, Movie } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

const YEARS_BACK = 20;

function todayParts() {
  const now = new Date();
  return {
    month: String(now.getMonth() + 1).padStart(2, '0'),
    day: String(now.getDate()).padStart(2, '0'),
    year: now.getFullYear(),
    label: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
  };
}

async function getThisDayMovies(month: string, day: string, currentYear: number): Promise<Movie[]> {
  const years = Array.from({ length: YEARS_BACK }, (_, i) => currentYear - 1 - i);
  const perYear = await Promise.all(
    years.map((year) =>
      tmdbClient
        .discoverMovies({
          'primary_release_date.gte': `${year}-${month}-${day}`,
          'primary_release_date.lte': `${year}-${month}-${day}`,
          sort_by: 'popularity.desc',
        })
        .then((r) => r.results || [])
        .catch(() => [] as Movie[])
    )
  );
  return perYear
    .flat()
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 24);
}

export async function generateMetadata(): Promise<Metadata> {
  const { label } = todayParts();
  return buildMetadata({
    title: `This Day in Film History — ${label}`,
    description: `Movies released on ${label} across the last ${YEARS_BACK} years, ranked by popularity.`,
    path: '/this-day',
  });
}

export default async function ThisDayPage() {
  const { month, day, year, label } = todayParts();
  const movies = await getThisDayMovies(month, day, year);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <CalendarDays className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">This Day in Film History</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Movies released on {label} across the last {YEARS_BACK} years, most popular first. Changes every day.
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
          <p className="text-sm text-gray-400">No notable releases found for {label} in this window.</p>
        </div>
      )}
    </div>
  );
}
