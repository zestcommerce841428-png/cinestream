'use client';

import React, { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, Calendar, Bookmark, Play, Share2, DollarSign, Globe, Film, Sparkles, MessageSquare, Tv, Languages, ExternalLink, History } from 'lucide-react';
import { tmdbClient, getImageUrl, getBackdropUrl, Movie } from '@/services/tmdb';
import { useWatchlist } from '@/context/WatchlistContext';

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movieId = parseInt(resolvedParams.id, 10);

  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovieData() {
      if (!movieId) return;
      setLoading(true);
      try {
        const details = await tmdbClient.getMovieDetailsDeep(movieId);
        setMovie(details);
      } catch (err) {
        console.error('Error fetching movie details', err);
      } finally {
        setLoading(false);
      }
    }
    loadMovieData();
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white space-y-4">
        <h1 className="text-2xl font-bold">Movie Not Found</h1>
        <Link href="/" className="text-brand-400 underline text-sm">Return Home</Link>
      </div>
    );
  }

  const isSaved = isInWatchlist(movie.id, 'movie');
  const cast = movie.credits?.cast?.slice(0, 10) || [];
  const trailer = movie.videos?.results?.find((v: any) => v.type === 'Trailer' || v.type === 'Teaser');

  const subRouteTabs = [
    { label: 'Full Cast', href: `/movie/${movieId}/cast`, icon: Film },
    { label: 'Full Crew', href: `/movie/${movieId}/crew`, icon: Film },
    { label: 'Trailers Theater', href: `/movie/${movieId}/trailers`, icon: Play },
    { label: 'Posters Gallery', href: `/movie/${movieId}/posters`, icon: Sparkles },
    { label: '4K Backdrops', href: `/movie/${movieId}/backdrops`, icon: Sparkles },
    { label: 'Release Dates', href: `/movie/${movieId}/release-dates`, icon: Calendar },
    { label: 'Plot Keywords', href: `/movie/${movieId}/keywords`, icon: Sparkles },
    { label: 'Similar Movies', href: `/movie/${movieId}/similar`, icon: Film },
    { label: 'AI Recommendations', href: `/movie/${movieId}/recommendations`, icon: Sparkles },
    { label: 'Reviews Stream', href: `/movie/${movieId}/reviews`, icon: MessageSquare },
    { label: 'Watch Providers', href: `/movie/${movieId}/watch-providers`, icon: Tv },
    { label: 'Translations', href: `/movie/${movieId}/translations`, icon: Languages },
    { label: 'Alt Titles', href: `/movie/${movieId}/alternative-titles`, icon: Globe },
    { label: 'External IDs', href: `/movie/${movieId}/external-ids`, icon: ExternalLink },
    { label: 'Revision History', href: `/movie/${movieId}/changes`, icon: History },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 pb-20">
      {/* Dynamic SEO JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Movie',
            name: movie.title,
            description: movie.overview,
            image: getImageUrl(movie.poster_path, 'original'),
            datePublished: movie.release_date,
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: movie.vote_average,
              reviewCount: movie.vote_count,
            },
          }),
        }}
      />

      {/* Hero Banner */}
      <div className="relative h-[65vh] w-full">
        {movie.backdrop_path && (
          <Image
            src={getBackdropUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            fill
            priority
            className="object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        
        <div className="absolute bottom-0 inset-x-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-end md:items-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="relative w-44 sm:w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex-shrink-0 hidden sm:block">
            <Image src={getImageUrl(movie.poster_path, 'w500')} alt={movie.title} fill className="object-cover" />
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-brand-600/30 text-brand-400 border border-brand-500/40 px-2.5 py-1 rounded-md font-bold uppercase tracking-wide">Movie</span>
              {movie.genres?.map((g: any) => (
                <span key={g.id} className="bg-gray-900 border border-gray-800 text-gray-300 px-2.5 py-1 rounded-md font-medium">
                  {g.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">{movie.title}</h1>
            {movie.tagline && <p className="text-brand-300 italic text-sm font-medium">"{movie.tagline}"</p>}

            <div className="flex flex-wrap items-center gap-6 text-xs text-gray-300 font-semibold">
              <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{movie.vote_average?.toFixed(1)} / 10</span>
                <span className="text-gray-500 font-normal">({movie.vote_count?.toLocaleString()} votes)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-brand-400" />
                <span>{movie.runtime} min</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-brand-400" />
                <span>{movie.release_date}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() =>
                  isSaved
                    ? removeFromWatchlist(movie.id, 'movie')
                    : addToWatchlist({
                        id: movie.id,
                        title: movie.title,
                        poster_path: movie.poster_path,
                        vote_average: movie.vote_average,
                        release_date: movie.release_date,
                        type: 'movie',
                      })
                }
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition ${
                  isSaved
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-brand-600 hover:bg-brand-700 text-white'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{isSaved ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>

              <Link
                href={`/share/${movie.id}`}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-800 text-xs font-bold transition"
              >
                <Share2 className="w-4 h-4 text-brand-400" />
                <span>Social Card</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Route Navigation Hub */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-gray-900/80 p-2 rounded-2xl border border-gray-800 flex flex-wrap gap-2">
          {subRouteTabs.map((tab, idx) => {
            const Icon = tab.icon;
            return (
              <Link
                key={idx}
                href={tab.href}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800/80 hover:border-brand-500/50 text-[11px] font-bold text-gray-300 hover:text-white transition"
              >
                <Icon className="w-3.5 h-3.5 text-brand-400" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-white">Overview</h2>
          <p className="text-sm text-gray-300 leading-relaxed max-w-4xl">{movie.overview}</p>
        </div>
      </div>
    </div>
  );
}
