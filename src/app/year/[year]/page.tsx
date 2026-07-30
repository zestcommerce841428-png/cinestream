import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarRange, TrendingUp, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';
import { tmdbClient, Movie, Genre } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

const MIN_YEAR = 1900;

interface PageProps {
  params: Promise<{ year: string }>;
}

function currentYear() {
  return new Date().getFullYear();
}

async function getYearData(year: number) {
  const [topRatedRes, boxOfficeRes, genresRes] = await Promise.all([
    tmdbClient.discoverMovies({ primary_release_year: year, sort_by: 'vote_average.desc', 'vote_count.gte': 150 }),
    tmdbClient.discoverMovies({ primary_release_year: year, sort_by: 'revenue.desc' }),
    tmdbClient.getMovieGenres(),
  ]);

  const genreMap = new Map<number, string>((genresRes.genres || []).map((g: Genre) => [g.id, g.name]));
  const tally = new Map<string, number>();
  (topRatedRes.results || []).forEach((m: Movie) => {
    m.genre_ids?.forEach((id) => {
      const name = genreMap.get(id);
      if (name) tally.set(name, (tally.get(name) || 0) + 1);
    });
  });
  const topGenres = [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  return {
    topRated: (topRatedRes.results || []).slice(0, 12),
    boxOffice: (boxOfficeRes.results || []).slice(0, 12),
    topGenres,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr, 10);
  return buildMetadata({
    title: `${year} in Film — Year in Review`,
    description: `The best-reviewed movies, box office leaders, and genre trends of ${year}.`,
    path: `/year/${year}`,
  });
}

export default async function YearInReviewPage({ params }: PageProps) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr, 10);

  if (!Number.isInteger(year) || year < MIN_YEAR || year > currentYear() + 2) {
    notFound();
  }

  const { topRated, boxOffice, topGenres } = await getYearData(year);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-gray-800 pb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <CalendarRange className="w-8 h-8 text-brand-500" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{year} in Film</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">Top-reviewed titles, box office leaders, and genre trends for {year}.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={`/year/${year - 1}`}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs font-bold text-gray-300 hover:text-white transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>{year - 1}</span>
          </Link>
          {year < currentYear() + 2 && (
            <Link
              href={`/year/${year + 1}`}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs font-bold text-gray-300 hover:text-white transition"
            >
              <span>{year + 1}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {topGenres.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">Genre Mix</h2>
          <div className="flex flex-wrap gap-2">
            {topGenres.map(([name, count]) => (
              <span
                key={name}
                className="px-3 py-1.5 rounded-full bg-gray-900/80 border border-gray-800 text-xs font-semibold text-gray-300"
              >
                {name} <span className="text-brand-400">×{count}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-bold text-white">Top Rated of {year}</h2>
        </div>
        {topRated.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {topRated.map((m) => (
              <MovieCard key={m.id} id={m.id} title={m.title} posterPath={m.poster_path} voteAverage={m.vote_average} releaseDate={m.release_date} mediaType="movie" />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No well-reviewed titles found for {year}.</p>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Box Office Leaders of {year}</h2>
        </div>
        {boxOffice.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {boxOffice.map((m) => (
              <MovieCard key={m.id} id={m.id} title={m.title} posterPath={m.poster_path} voteAverage={m.vote_average} releaseDate={m.release_date} mediaType="movie" />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No box office data found for {year}.</p>
        )}
      </section>
    </div>
  );
}
