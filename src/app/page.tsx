import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Info, Flame, Film, Tv, Sparkles, Clapperboard, Star } from 'lucide-react';
import { tmdbClient, getBackdropUrl, Movie, Video } from '@/services/tmdb';
import MediaCarousel from '@/components/MediaCarousel';
import HeroTrailerButton from '@/components/HeroTrailerButton';
import ForYouRow from '@/components/ForYouRow';
import { SITE_NAME, truncateDescription } from '@/lib/metadata';
import { jsonLdScriptProps, websiteJsonLd } from '@/lib/jsonld';
import { getPreferredLanguage } from '@/lib/i18n-server';

// No `revalidate` export here: reading the language cookie (a Next.js "dynamic API")
// already opts this route into per-request rendering, so a static ISR interval would
// be misleading — see src/lib/i18n-server.ts.

const HOME_TITLE = `${SITE_NAME} — Discover Movies & TV Shows`;

export async function generateMetadata(): Promise<Metadata> {
  const language = await getPreferredLanguage();
  const trending = await tmdbClient.getTrendingAllDay(language).catch(() => null);
  const hero = trending?.results?.[0] as (Movie & { name?: string; media_type?: string }) | undefined;
  const heroTitle = hero?.title || hero?.name;
  const description = heroTitle
    ? `Trending now: ${heroTitle}. ${truncateDescription(hero?.overview, 100)}`
    : undefined;
  const image = hero?.backdrop_path ? getBackdropUrl(hero.backdrop_path, 'w1280') : undefined;

  return {
    title: { absolute: HOME_TITLE },
    description,
    alternates: { canonical: '/' },
    openGraph: {
      title: HOME_TITLE,
      description,
      url: '/',
      images: image ? [{ url: image, width: 1280, height: 720, alt: heroTitle }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: HOME_TITLE,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function HomePage() {
  const language = await getPreferredLanguage();
  const [trendingRes, nowPlayingRes, topRatedTvRes, popularRes, genresRes] = await Promise.all([
    tmdbClient.getTrendingAllDay(language),
    tmdbClient.getMovieNowPlaying(1, language),
    tmdbClient.getTVTopRated(1, language),
    tmdbClient.getMoviePopular(1, language),
    tmdbClient.getMovieGenres(language),
  ]);

  const heroMovie = trendingRes.results[0] as (Movie & { name?: string; media_type?: string }) | undefined;
  const trendingDay = trendingRes.results;
  const nowPlaying = nowPlayingRes.results;
  const topRatedTV = topRatedTvRes.results;
  const popularMovies = popularRes.results;
  const genres = genresRes.genres;

  let heroVideoKey: string | null = null;
  if (heroMovie?.id) {
    const videos = await tmdbClient.getMovieVideos(heroMovie.id).catch(() => null);
    const trailer = videos?.results?.find((v: Video) => v.type === 'Trailer' && v.site === 'YouTube');
    heroVideoKey = trailer?.key || null;
  }

  return (
    <div className="space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(websiteJsonLd())} />

      {/* Hero Section */}
      {heroMovie && (
        <section className="relative w-full h-[70vh] min-h-[500px] max-h-[750px] overflow-hidden flex items-end">
          {/* Backdrop Image */}
          <div className="absolute inset-0 bg-gray-950">
            {heroMovie.backdrop_path && (
              <Image
                src={getBackdropUrl(heroMovie.backdrop_path, 'original')}
                alt={heroMovie.title || heroMovie.name || 'Hero'}
                fill
                priority
                className="object-cover opacity-60 scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/60 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full z-10 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-brand-600/30 border border-brand-500/40 text-brand-400 text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>#1 Trending Today</span>
              </span>
              <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold bg-dark-900/80 px-2.5 py-1 rounded-full border border-white/10">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{heroMovie.vote_average ? heroMovie.vote_average.toFixed(1) : 'N/A'}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none max-w-3xl drop-shadow-md">
              {heroMovie.title || heroMovie.name}
            </h1>

            <p className="text-sm sm:text-base text-gray-300 max-w-2xl line-clamp-3 leading-relaxed drop-shadow">
              {heroMovie.overview}
            </p>

            <div className="flex items-center space-x-4 pt-2">
              <HeroTrailerButton videoKey={heroVideoKey} />

              <Link
                href={`/${heroMovie.media_type === 'tv' ? 'tv' : 'movie'}/${heroMovie.id}`}
                className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gray-800/80 hover:bg-gray-700 border border-gray-700 text-white font-semibold text-sm backdrop-blur-md transition-all hover:scale-105"
              >
                <Info className="w-4 h-4" />
                <span>More Details</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Main Container for Carousels */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Personalized feed — client island, only renders once a watchlist exists */}
        <ForYouRow />

        {/* Genre Quick Filters */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2 text-gray-300 font-semibold text-sm">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span>Popular Genres</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <Link
                key={g.id}
                href={`/discover?genre=${g.id}`}
                className="px-4 py-2 rounded-xl bg-gray-900/80 hover:bg-brand-600/20 border border-gray-800 hover:border-brand-500/50 text-xs font-medium text-gray-300 hover:text-white transition-all"
              >
                {g.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Trending All Carousel */}
        <MediaCarousel title="Trending Today" items={trendingDay} icon={<Flame className="w-6 h-6 text-brand-500" />} />

        {/* Now Playing Movies */}
        <MediaCarousel
          title="Now Playing in Theaters"
          items={nowPlaying}
          mediaType="movie"
          icon={<Film className="w-6 h-6 text-rose-400" />}
        />

        {/* Top Rated TV Shows */}
        <MediaCarousel
          title="Top Rated TV Series"
          items={topRatedTV}
          mediaType="tv"
          icon={<Tv className="w-6 h-6 text-purple-400" />}
        />

        {/* Popular Movies */}
        <MediaCarousel
          title="Popular Movies"
          items={popularMovies}
          mediaType="movie"
          icon={<Clapperboard className="w-6 h-6 text-amber-400" />}
        />
      </div>
    </div>
  );
}
