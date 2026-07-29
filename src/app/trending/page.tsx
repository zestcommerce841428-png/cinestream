import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Flame } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

const MEDIA_TYPES = ['all', 'movie', 'tv', 'person'] as const;
const TIME_WINDOWS = ['day', 'week'] as const;
type MediaType = (typeof MEDIA_TYPES)[number];
type TimeWindow = (typeof TIME_WINDOWS)[number];

function fetchTrending(mediaType: MediaType, timeWindow: TimeWindow) {
  if (mediaType === 'movie') return timeWindow === 'day' ? tmdbClient.getTrendingMoviesDay() : tmdbClient.getTrendingMoviesWeek();
  if (mediaType === 'tv') return timeWindow === 'day' ? tmdbClient.getTrendingTVDay() : tmdbClient.getTrendingTVWeek();
  if (mediaType === 'person') return timeWindow === 'day' ? tmdbClient.getTrendingPeopleDay() : tmdbClient.getTrendingPeopleWeek();
  return timeWindow === 'day' ? tmdbClient.getTrendingAllDay() : tmdbClient.getTrendingAllWeek();
}

interface TrendingPageProps {
  searchParams: Promise<{ type?: string; window?: string }>;
}

export async function generateMetadata({ searchParams }: TrendingPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const timeWindow: TimeWindow = sp.window === 'week' ? 'week' : 'day';
  return buildMetadata({
    title: `Trending ${timeWindow === 'day' ? 'Today' : 'This Week'}`,
    description: "Discover what's trending right now across movies, TV series, and actors on CineStream.",
    path: '/trending',
  });
}

export default async function TrendingPage({ searchParams }: TrendingPageProps) {
  const sp = await searchParams;
  const mediaType: MediaType = MEDIA_TYPES.includes(sp.type as MediaType) ? (sp.type as MediaType) : 'all';
  const timeWindow: TimeWindow = sp.window === 'week' ? 'week' : 'day';

  const res = await fetchTrending(mediaType, timeWindow);
  const items = res.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Flame className="w-8 h-8 text-brand-500 fill-current" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Trending Showcase</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">Discover what&rsquo;s trending right now across movies, TV series, and actors.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 bg-gray-900/90 p-2 rounded-2xl border border-gray-800 self-start sm:self-auto">
          {/* Time Window */}
          <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-800">
            {TIME_WINDOWS.map((w) => (
              <Link
                key={w}
                href={`/trending?type=${mediaType}&window=${w}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${timeWindow === w ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {w === 'day' ? 'Today' : 'This Week'}
              </Link>
            ))}
          </div>

          {/* Media Type */}
          <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-800">
            {MEDIA_TYPES.map((t) => (
              <Link
                key={t}
                href={`/trending?type=${t}&window=${timeWindow}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${mediaType === t ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {t === 'tv' ? 'TV' : t === 'person' ? 'People' : t}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {items.map((item: any) => {
            const type = item.media_type || (mediaType === 'person' ? 'person' : mediaType === 'tv' ? 'tv' : 'movie');

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
          <p className="text-gray-400">Nothing trending right now for this filter.</p>
        </div>
      )}
    </div>
  );
}
