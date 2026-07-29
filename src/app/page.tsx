'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Info, Flame, Film, Tv, Star, Sparkles, Clapperboard } from 'lucide-react';
import { tmdbClient, getBackdropUrl, Movie, TVShow, Video } from '@/services/tmdb';
import MediaCarousel from '@/components/MediaCarousel';
import VideoModal from '@/components/VideoModal';

export default function HomePage() {
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [heroVideoKey, setHeroVideoKey] = useState<string | null>(null);
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  const [trendingDay, setTrendingDay] = useState<any[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [topRatedTV, setTopRatedTV] = useState<TVShow[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          trendingRes,
          nowPlayingRes,
          topRatedTvRes,
          popularRes,
          genresRes
        ] = await Promise.all([
          tmdbClient.getTrendingAllDay(),
          tmdbClient.getMovieNowPlaying(),
          tmdbClient.getTVTopRated(),
          tmdbClient.getMoviePopular(),
          tmdbClient.getMovieGenres()
        ]);

        const heroItem = trendingRes.results[0];
        setHeroMovie(heroItem);
        setTrendingDay(trendingRes.results);
        setNowPlaying(nowPlayingRes.results);
        setTopRatedTV(topRatedTvRes.results);
        setPopularMovies(popularRes.results);
        setGenres(genresRes.genres);

        if (heroItem?.id) {
          const videos = await tmdbClient.getMovieVideos(heroItem.id).catch(() => null);
          const trailer = videos?.results?.find((v: Video) => v.type === 'Trailer' && v.site === 'YouTube');
          if (trailer) setHeroVideoKey(trailer.key);
        }
      } catch (err) {
        console.error('Error fetching home page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      {heroMovie && (
        <section className="relative w-full h-[70vh] min-h-[500px] max-h-[750px] overflow-hidden flex items-end">
          {/* Backdrop Image */}
          <div className="absolute inset-0 bg-gray-950">
            {heroMovie.backdrop_path && (
              <Image
                src={getBackdropUrl(heroMovie.backdrop_path, 'original')}
                alt={heroMovie.title || (heroMovie as any).name || 'Hero'}
                fill
                priority
                className="object-cover opacity-60 scale-105 transition-all duration-1000"
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
              {heroMovie.title || (heroMovie as any).name}
            </h1>

            <p className="text-sm sm:text-base text-gray-300 max-w-2xl line-clamp-3 leading-relaxed drop-shadow">
              {heroMovie.overview}
            </p>

            <div className="flex items-center space-x-4 pt-2">
              {heroVideoKey && (
                <button
                  onClick={() => setActiveVideoModal(heroVideoKey)}
                  className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-xl shadow-brand-600/30 transition-all hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Watch Trailer</span>
                </button>
              )}

              <Link
                href={`/${(heroMovie as any).media_type === 'tv' ? 'tv' : 'movie'}/${heroMovie.id}`}
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
        <MediaCarousel
          title="Trending Today"
          items={trendingDay}
          icon={<Flame className="w-6 h-6 text-brand-500" />}
        />

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

      {/* Video Trailer Modal */}
      <VideoModal videoKey={activeVideoModal} onClose={() => setActiveVideoModal(null)} />
    </div>
  );
}
