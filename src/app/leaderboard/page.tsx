'use client';

import React, { useEffect, useState } from 'react';
import { Award, DollarSign, TrendingUp } from 'lucide-react';
import { tmdbClient, Movie } from '@/services/tmdb';

export default function LeaderboardPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      setLoading(true);
      try {
        const res = await tmdbClient.getBoxOfficeMovies();
        setMovies(res.results || []);
      } catch (e) {
        console.error('Failed loading leaderboard', e);
      } finally {
        setLoading(false);
      }
    }
    loadLeaderboard();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Award className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">All-Time Box Office Revenue Leaderboard</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Official theatrical revenue leaderboard for the highest-grossing films worldwide.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-900 animate-pulse rounded-2xl border border-gray-800" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {movies.map((m, idx) => (
            <div key={m.id} className="bg-gray-900/80 p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="w-8 h-8 rounded-full bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center font-extrabold text-xs">
                  #{idx + 1}
                </span>
                <div>
                  <h3 className="font-extrabold text-sm text-white">{m.title}</h3>
                  <p className="text-xs text-gray-400">{m.release_date}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-400">Rating: ⭐ {m.vote_average?.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
