'use client';

import React, { useMemo, useState } from 'react';
import { Bookmark, Clock, Film, PieChart, CheckCircle2, Star, Tv } from 'lucide-react';
import { useWatchlist } from '@/context/WatchlistContext';
import { useWatchHistory } from '@/context/WatchHistoryContext';
import { useRatings } from '@/context/RatingsContext';

const AVG_MOVIE_RUNTIME_MIN = 115;
const AVG_EPISODE_RUNTIME_MIN = 42;

export default function WatchAnalyticsPage() {
  const { watchlist } = useWatchlist();
  const { history } = useWatchHistory();
  const { ratings } = useRatings();
  // Date.now() can't be called directly during render (the React Compiler's purity
  // rule flags it as non-deterministic); a lazy useState initializer is the sanctioned
  // "compute once, on mount" escape hatch, and "last 30 days" doesn't need
  // millisecond-fresh precision on every re-render anyway.
  const [now] = useState(() => Date.now());

  const moviesCount = watchlist.filter((i) => i.type === 'movie').length;
  const tvCount = watchlist.filter((i) => i.type === 'tv').length;

  const stats = useMemo(() => {
    const watchedMovies = history.filter((e) => e.kind === 'movie');
    const watchedEpisodes = history.filter((e) => e.kind === 'episode');
    const uniqueShows = new Set(watchedEpisodes.map((e) => (e.kind === 'episode' ? e.tvId : null))).size;

    const movieMinutes = watchedMovies.reduce((acc, m) => acc + (m.kind === 'movie' ? m.runtime ?? AVG_MOVIE_RUNTIME_MIN : 0), 0);
    const episodeMinutes = watchedEpisodes.reduce(
      (acc, e) => acc + (e.kind === 'episode' ? e.episodeRuntime ?? AVG_EPISODE_RUNTIME_MIN : 0),
      0
    );
    const totalHours = (movieMinutes + episodeMinutes) / 60;

    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const watchedLast30Days = history.filter((e) => new Date(e.watchedAt).getTime() >= thirtyDaysAgo).length;

    const avgRating = ratings.length > 0 ? ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length : 0;

    return {
      watchedMoviesCount: watchedMovies.length,
      watchedEpisodesCount: watchedEpisodes.length,
      uniqueShows,
      totalHours,
      watchedLast30Days,
      avgRating,
    };
  }, [history, ratings, now]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <PieChart className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Watch Statistics & Time Calculator</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Real stats computed from your watched history and personal ratings, stored privately in this browser.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Movies Watched</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-white">{stats.watchedMoviesCount}</p>
        </div>

        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Episodes Watched</span>
            <Tv className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">
            {stats.watchedEpisodesCount} <span className="text-sm font-normal text-gray-400">across {stats.uniqueShows} shows</span>
          </p>
        </div>

        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Total Watch Time</span>
            <Clock className="w-4 h-4 text-brand-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">
            {stats.totalHours.toFixed(0)} <span className="text-sm font-normal text-gray-400">Hours</span>
          </p>
        </div>

        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Last 30 Days</span>
            <Film className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{stats.watchedLast30Days}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Watchlist Size</span>
            <Bookmark className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-3xl font-extrabold text-white">{watchlist.length}</p>
        </div>

        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Movies vs TV in Watchlist</span>
            <Film className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">
            {moviesCount} <span className="text-sm font-normal text-gray-400">Movies</span> / {tvCount}{' '}
            <span className="text-sm font-normal text-gray-400">TV</span>
          </p>
        </div>

        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Average Personal Rating</span>
            <Star className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">
            {ratings.length > 0 ? stats.avgRating.toFixed(1) : '—'} <span className="text-sm font-normal text-gray-400">/ 10 ({ratings.length})</span>
          </p>
        </div>
      </div>
    </div>
  );
}
