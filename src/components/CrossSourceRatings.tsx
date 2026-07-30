import React from 'react';
import type { CrossSourceRatings as CrossSourceRatingsData } from '@/services/omdb';

// Server-safe presentational component (no 'use client' needed — no interactivity).
export default function CrossSourceRatings({ ratings }: { ratings: CrossSourceRatingsData | null }) {
  if (!ratings) return null;

  const rt = ratings.rottenTomatoes ? parseInt(ratings.rottenTomatoes, 10) : null;
  const meta = ratings.metascore ? parseInt(ratings.metascore, 10) : null;

  if (!ratings.imdbRating && rt === null && meta === null) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {ratings.imdbRating && (
        <div className="flex items-center space-x-1.5 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg">
          <span className="text-[10px] font-extrabold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">IMDb</span>
          <span className="text-xs font-bold text-white">{ratings.imdbRating}/10</span>
        </div>
      )}
      {rt !== null && !Number.isNaN(rt) && (
        <div className="flex items-center space-x-1.5 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg">
          <span
            className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
              rt >= 60 ? 'text-red-400 bg-red-400/10' : 'text-green-400 bg-green-400/10'
            }`}
          >
            RT
          </span>
          <span className="text-xs font-bold text-white">{rt}%</span>
        </div>
      )}
      {meta !== null && !Number.isNaN(meta) && (
        <div className="flex items-center space-x-1.5 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg">
          <span
            className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
              meta >= 61 ? 'text-green-400 bg-green-400/10' : meta >= 40 ? 'text-yellow-400 bg-yellow-400/10' : 'text-red-400 bg-red-400/10'
            }`}
          >
            Metacritic
          </span>
          <span className="text-xs font-bold text-white">{meta}/100</span>
        </div>
      )}
    </div>
  );
}
