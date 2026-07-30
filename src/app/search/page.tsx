import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';
import { getPreferredLanguage } from '@/lib/i18n-server';

// No `revalidate` export: reading the language cookie makes this route inherently
// per-request (see src/lib/i18n-server.ts) — a static ISR interval would be misleading.

const TABS = [
  { key: 'all', label: 'All Results' },
  { key: 'movie', label: 'Movies' },
  { key: 'tv', label: 'TV Shows' },
  { key: 'person', label: 'People' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

function resolveTab(raw?: string): TabKey {
  return (TABS.find((t) => t.key === raw)?.key || 'all') as TabKey;
}

function fetchResults(query: string, tab: TabKey, language: string) {
  switch (tab) {
    case 'movie':
      return tmdbClient.searchMovies(query, 1, language);
    case 'tv':
      return tmdbClient.searchTV(query, 1, language);
    case 'person':
      return tmdbClient.searchPeople(query);
    default:
      return tmdbClient.searchMulti(query, 1, language);
  }
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string; type?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim() || '';
  return buildMetadata({
    title: query ? `Search results for "${query}"` : 'Search',
    description: query
      ? `Movies, TV shows and people matching "${query}" on CineStream.`
      : 'Search thousands of movies, TV shows, and people on CineStream.',
    path: query ? `/search?q=${encodeURIComponent(query)}` : '/search',
    noIndex: true,
  });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, type } = await searchParams;
  const query = q?.trim() || '';
  const activeTab = resolveTab(type);
  const language = await getPreferredLanguage();

  const res = query ? await fetchResults(query, activeTab, language).catch(() => ({ results: [] })) : { results: [] };
  const results = res.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header */}
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <Search className="w-7 h-7 text-brand-500" />
          <span>{query ? `Search Results for "${query}"` : 'Search'}</span>
        </h1>

        {/* Filter Tabs */}
        <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-800 self-start sm:w-fit">
          {TABS.map((tab) => (
            <Link
              key={tab.key}
              href={`/search?q=${encodeURIComponent(query)}${tab.key === 'all' ? '' : `&type=${tab.key}`}`}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === tab.key ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {!query ? (
        <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
          <p className="text-gray-400">Use the search icon (or press Ctrl/Cmd + K) to look up movies, TV shows, and people.</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {results.map((item: any) => {
            const type = item.media_type || (activeTab === 'person' ? 'person' : activeTab === 'tv' ? 'tv' : 'movie');

            if (type === 'person') {
              return (
                <Link
                  key={`person-${item.id}`}
                  href={`/person/${item.id}`}
                  className="group bg-gray-900/60 p-3 rounded-2xl border border-gray-800 hover:border-brand-500/50 transition-all text-center"
                >
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-950 mb-2">
                    {item.profile_path ? (
                      <Image
                        src={getImageUrl(item.profile_path, 'w185')}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Image</div>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm text-white group-hover:text-brand-500 line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-gray-400">{item.known_for_department}</p>
                </Link>
              );
            }

            return (
              <MovieCard
                key={`${type}-${item.id}`}
                id={item.id}
                title={item.title || item.name}
                posterPath={item.poster_path}
                voteAverage={item.vote_average}
                releaseDate={item.release_date || item.first_air_date}
                mediaType={type === 'tv' ? 'tv' : 'movie'}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
          <p className="text-gray-400">No results found for &ldquo;{query}&rdquo;. Try searching another keyword.</p>
        </div>
      )}
    </div>
  );
}
