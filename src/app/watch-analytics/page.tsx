'use client';

import React from 'react';
import { Bookmark, Clock, Film, PieChart } from 'lucide-react';
import { useWatchlist } from '@/context/WatchlistContext';

export default function WatchAnalyticsPage() {
  const { watchlist } = useWatchlist();

  const moviesCount = watchlist.filter((i) => i.type === 'movie').length;
  const tvCount = watchlist.filter((i) => i.type === 'tv').length;
  const totalHoursEst = moviesCount * 2 + tvCount * 15;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <PieChart className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Watchlist Statistics & Time Calculator</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Detailed breakdown and watch-time stats for your saved watchlist.</p>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Total Saved Items</span>
            <Bookmark className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-3xl font-extrabold text-white">{watchlist.length}</p>
        </div>

        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Movies vs TV Series</span>
            <Film className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{moviesCount} <span className="text-sm font-normal text-gray-400">Movies</span> / {tvCount} <span className="text-sm font-normal text-gray-400">TV</span></p>
        </div>

        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Est. Watch Time</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{totalHoursEst} <span className="text-sm font-normal text-gray-400">Hours</span></p>
        </div>
      </div>
    </div>
  );
}
