'use client';

import React, { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Calendar, Bookmark, Share2, Tv, Film, Sparkles, MessageSquare, Languages, ExternalLink, ShieldAlert, Layers } from 'lucide-react';
import { tmdbClient, getImageUrl, getBackdropUrl } from '@/services/tmdb';
import { useWatchlist } from '@/context/WatchlistContext';

export default function TVDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const tvId = parseInt(resolvedParams.id, 10);

  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const [tv, setTv] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTVData() {
      if (!tvId) return;
      setLoading(true);
      try {
        const details = await tmdbClient.getTVDetailsDeep(tvId);
        setTv(details);
      } catch (err) {
        console.error('Error fetching TV details', err);
      } finally {
        setLoading(false);
      }
    }
    loadTVData();
  }, [tvId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!tv) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white space-y-4">
        <h1 className="text-2xl font-bold">TV Show Not Found</h1>
        <Link href="/tv" className="text-brand-400 underline text-sm">Return to TV Hub</Link>
      </div>
    );
  }

  const isSaved = isInWatchlist(tv.id, 'tv');

  const subRouteTabs = [
    { label: 'Aggregate Cast', href: `/tv/${tvId}/aggregate-credits`, icon: Film },
    { label: 'Content Ratings', href: `/tv/${tvId}/content-ratings`, icon: ShieldAlert },
    { label: 'Videos & Teasers', href: `/tv/${tvId}/videos`, icon: Sparkles },
    { label: 'Reviews Stream', href: `/tv/${tvId}/reviews`, icon: MessageSquare },
    { label: 'Watch Providers', href: `/tv/${tvId}/watch-providers`, icon: Tv },
    { label: 'Translations', href: `/tv/${tvId}/translations`, icon: Languages },
    { label: 'Alt Titles', href: `/tv/${tvId}/alternative-titles`, icon: Languages },
    { label: 'External IDs', href: `/tv/${tvId}/external-ids`, icon: ExternalLink },
    { label: 'Episode Groups', href: `/tv/${tvId}/episode-groups`, icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 pb-20">
      {/* Hero Banner */}
      <div className="relative h-[65vh] w-full">
        {tv.backdrop_path && (
          <Image
            src={getBackdropUrl(tv.backdrop_path, 'original')}
            alt={tv.name}
            fill
            priority
            className="object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        
        <div className="absolute bottom-0 inset-x-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-end md:items-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="relative w-44 sm:w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex-shrink-0 hidden sm:block">
            <Image src={getImageUrl(tv.poster_path, 'w500')} alt={tv.name} fill className="object-cover" />
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-brand-600/30 text-brand-400 border border-brand-500/40 px-2.5 py-1 rounded-md font-bold uppercase tracking-wide">TV Series</span>
              {tv.genres?.map((g: any) => (
                <span key={g.id} className="bg-gray-900 border border-gray-800 text-gray-300 px-2.5 py-1 rounded-md font-medium">
                  {g.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">{tv.name}</h1>
            {tv.tagline && <p className="text-brand-300 italic text-sm font-medium">"{tv.tagline}"</p>}

            <div className="flex flex-wrap items-center gap-6 text-xs text-gray-300 font-semibold">
              <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{tv.vote_average?.toFixed(1)} / 10</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Tv className="w-4 h-4 text-brand-400" />
                <span>{tv.number_of_seasons} Seasons ({tv.number_of_episodes} Episodes)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-brand-400" />
                <span>First Aired: {tv.first_air_date}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() =>
                  isSaved
                    ? removeFromWatchlist(tv.id, 'tv')
                    : addToWatchlist({
                        id: tv.id,
                        title: tv.name,
                        poster_path: tv.poster_path,
                        vote_average: tv.vote_average,
                        release_date: tv.first_air_date,
                        type: 'tv',
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
                href={`/share/${tv.id}`}
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

      {/* Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-white">Overview</h2>
          <p className="text-sm text-gray-300 leading-relaxed max-w-4xl">{tv.overview}</p>
        </div>
      </div>
    </div>
  );
}
