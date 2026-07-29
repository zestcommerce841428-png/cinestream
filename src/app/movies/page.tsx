import type { Metadata } from 'next';
import Link from 'next/link';
import { Film, Flame, Star, Clapperboard, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

const CATEGORIES = [
  { key: 'popular', label: 'Popular Movies', icon: Flame },
  { key: 'top_rated', label: 'Top Rated', icon: Star },
  { key: 'now_playing', label: 'Now Playing', icon: Clapperboard },
  { key: 'upcoming', label: 'Upcoming Releases', icon: Calendar },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]['key'];

function fetchMovies(category: CategoryKey, page: number) {
  switch (category) {
    case 'top_rated':
      return tmdbClient.getMovieTopRated(page);
    case 'now_playing':
      return tmdbClient.getMovieNowPlaying(page);
    case 'upcoming':
      return tmdbClient.getMovieUpcoming(page);
    default:
      return tmdbClient.getMoviePopular(page);
  }
}

interface MoviesPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

function resolveCategory(raw?: string): CategoryKey {
  return (CATEGORIES.find((c) => c.key === raw)?.key || 'popular') as CategoryKey;
}

export async function generateMetadata({ searchParams }: MoviesPageProps): Promise<Metadata> {
  const { category: rawCategory } = await searchParams;
  const category = resolveCategory(rawCategory);
  const label = CATEGORIES.find((c) => c.key === category)!.label;
  return buildMetadata({
    title: `${label} — Explore Feature Films`,
    description: `Browse ${label.toLowerCase()} on CineStream — trending blockbusters, top-rated classics, and upcoming theatrical releases.`,
    path: category === 'popular' ? '/movies' : `/movies?category=${category}`,
  });
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const { category: rawCategory, page: rawPage } = await searchParams;
  const category = resolveCategory(rawCategory);
  const page = Math.min(Math.max(parseInt(rawPage || '1', 10) || 1, 1), 500);

  const res = await fetchMovies(category, page);
  const movies = res.results || [];
  const totalPages = Math.min(res.total_pages || 1, 500);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Film className="w-8 h-8 text-brand-500" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Explore Feature Films</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">Discover trending blockbusters, top-rated classics, and upcoming theatrical releases.</p>
        </div>

        <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-800 self-start sm:self-auto overflow-x-auto hide-scrollbar max-w-full">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = category === cat.key;
            return (
              <Link
                key={cat.key}
                href={`/movies?category=${cat.key}`}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive ? 'bg-brand-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {movies.length > 0 ? (
        <div className="space-y-10">
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
              href={`/movies?category=${category}&page=${Math.max(page - 1, 1)}`}
              aria-disabled={page <= 1}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm font-medium text-gray-300 hover:text-white hover:border-gray-700 transition ${
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
              href={`/movies?category=${category}&page=${page + 1}`}
              aria-disabled={page >= totalPages}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm font-medium text-gray-300 hover:text-white hover:border-gray-700 transition ${
                page >= totalPages ? 'pointer-events-none opacity-40' : ''
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
          <p className="text-gray-400">No movies found for this category.</p>
        </div>
      )}
    </div>
  );
}
