import type { Metadata } from 'next';
import { Compass } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import DiscoverFilters from '@/components/DiscoverFilters';
import { buildMetadata } from '@/lib/metadata';
import { getPreferredLanguage } from '@/lib/i18n-server';

// No `revalidate` export: reading the language cookie makes this route inherently
// per-request (see src/lib/i18n-server.ts) — a static ISR interval would be misleading.

interface DiscoverPageProps {
  searchParams: Promise<{ type?: string; genre?: string; year?: string; sort?: string; rating?: string; provider?: string; region?: string }>;
}

export async function generateMetadata({ searchParams }: DiscoverPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const isFiltered = Boolean(sp.type || sp.genre || sp.year || sp.sort || sp.rating);
  return buildMetadata({
    title: 'Advanced Discover',
    description: 'Filter and customize movie & TV titles by genre, year, rating, and sort order.',
    path: '/discover',
    // Index only the base, unfiltered page — the near-infinite filter permutations aren't
    // worth indexing individually and would otherwise dilute crawl budget.
    noIndex: isFiltered,
  });
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const sp = await searchParams;
  const type: 'movie' | 'tv' = sp.type === 'tv' ? 'tv' : 'movie';
  const genre = sp.genre || '';
  const year = sp.year || '';
  const sort = sp.sort || 'popularity.desc';
  const rating = sp.rating || '0';
  const provider = sp.provider || '';
  const region = sp.region || 'US';

  const language = await getPreferredLanguage();
  const genresRes = await (type === 'movie' ? tmdbClient.getMovieGenres(language) : tmdbClient.getTVGenres(language));

  const params: Record<string, string | number> = {
    sort_by: sort,
    'vote_average.gte': rating,
    language,
  };
  if (genre) params.with_genres = genre;
  if (year) {
    if (type === 'movie') params.primary_release_year = year;
    else params.first_air_date_year = year;
  }
  if (provider) {
    params.with_watch_providers = provider;
    params.watch_region = region;
  }

  const results = await (type === 'movie' ? tmdbClient.discoverMovies(params) : tmdbClient.discoverTV(params));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Compass className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Advanced Discover</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Filter and customize movie & TV titles by genre, year, rating, and sort order.</p>
      </div>

      <DiscoverFilters genres={genresRes.genres || []} type={type} genre={genre} year={year} sort={sort} rating={rating} />

      {results.results && results.results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {results.results.map((item: any) => (
            <MovieCard
              key={`${type}-${item.id}`}
              id={item.id}
              title={item.title || item.name}
              posterPath={item.poster_path}
              voteAverage={item.vote_average}
              releaseDate={item.release_date || item.first_air_date}
              mediaType={type}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
          <p className="text-gray-400">No titles match your filter criteria.</p>
        </div>
      )}
    </div>
  );
}
