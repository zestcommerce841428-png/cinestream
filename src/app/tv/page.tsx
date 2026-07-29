import type { Metadata } from 'next';
import Link from 'next/link';
import { Tv, ChevronLeft, ChevronRight } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

const CATEGORIES = [
  { id: 'popular', label: 'Popular' },
  { id: 'top_rated', label: 'Top Rated' },
  { id: 'on_the_air', label: 'On The Air' },
  { id: 'airing_today', label: 'Airing Today' },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]['id'];

function fetchTV(category: CategoryKey, page: number) {
  switch (category) {
    case 'top_rated':
      return tmdbClient.getTVTopRated(page);
    case 'on_the_air':
      return tmdbClient.getTVOnTheAir(page);
    case 'airing_today':
      return tmdbClient.getTVAiringToday(page);
    default:
      return tmdbClient.getTVPopular(page);
  }
}

function resolveCategory(raw?: string): CategoryKey {
  return (CATEGORIES.find((c) => c.id === raw)?.id || 'popular') as CategoryKey;
}

interface TVPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: TVPageProps): Promise<Metadata> {
  const { category: rawCategory } = await searchParams;
  const category = resolveCategory(rawCategory);
  const label = CATEGORIES.find((c) => c.id === category)!.label;
  return buildMetadata({
    title: `${label} TV Series`,
    description: `Explore ${label.toLowerCase()} television shows and series on CineStream.`,
    path: category === 'popular' ? '/tv' : `/tv?category=${category}`,
  });
}

export default async function TVPage({ searchParams }: TVPageProps) {
  const { category: rawCategory, page: rawPage } = await searchParams;
  const category = resolveCategory(rawCategory);
  const page = Math.min(Math.max(parseInt(rawPage || '1', 10) || 1, 1), 500);

  const res = await fetchTV(category, page);
  const shows = res.results || [];
  const totalPages = Math.min(res.total_pages || 1, 500);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Tv className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">TV Series</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">Explore top-rated television shows, anime, and trending series.</p>
        </div>

        <div className="flex bg-gray-900/90 p-1.5 rounded-2xl border border-gray-800 self-start sm:self-auto overflow-x-auto hide-scrollbar max-w-full">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/tv?category=${cat.id}`}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                category === cat.id ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {shows.length > 0 ? (
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
      ) : (
        <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
          <p className="text-gray-400">No shows found for this category.</p>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-800 pt-6">
        <Link
          href={`/tv?category=${category}&page=${Math.max(page - 1, 1)}`}
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
          href={`/tv?category=${category}&page=${page + 1}`}
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
  );
}
