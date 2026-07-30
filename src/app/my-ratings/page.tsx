'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, X } from 'lucide-react';
import { useRatings } from '@/context/RatingsContext';
import { getImageUrl } from '@/services/tmdb';

export default function MyRatingsPage() {
  const { ratings, removeRating } = useRatings();

  const sorted = useMemo(() => [...ratings].sort((a, b) => b.rating - a.rating || (a.ratedAt < b.ratedAt ? 1 : -1)), [ratings]);
  const average = ratings.length > 0 ? ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">My Ratings</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          {ratings.length > 0
            ? `${ratings.length} titles rated, averaging ${average.toFixed(1)}/10 — kept separately from your TMDB account ratings.`
            : 'Rate any movie or TV show from its detail page and it will show up here.'}
        </p>
      </div>

      {sorted.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {sorted.map((item) => (
            <div key={`${item.type}-${item.id}`} className="space-y-2">
              <Link href={`/${item.type}/${item.id}`} className="group block">
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 group-hover:border-amber-500/50 transition">
                  <Image src={getImageUrl(item.poster_path, 'w342')} alt={item.title} fill className="object-cover" />
                  <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-extrabold text-white">{item.rating}</span>
                  </div>
                </div>
                <p className="text-xs font-bold text-white mt-2 line-clamp-1 group-hover:text-amber-400 transition">{item.title}</p>
              </Link>
              <button
                onClick={() => removeRating(item.id, item.type)}
                className="flex items-center space-x-1 text-[10px] text-gray-500 hover:text-red-400 transition"
              >
                <X className="w-3 h-3" />
                <span>Remove rating</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900/40 rounded-3xl border border-gray-800 space-y-3">
          <Star className="w-12 h-12 text-gray-600 mx-auto" />
          <h2 className="text-lg font-bold text-white">No ratings yet</h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Use the star picker on any movie or TV page to rate it — your personal ratings are stored privately in this browser.
          </p>
          <Link href="/movies" className="inline-block mt-2 text-xs font-semibold text-amber-400 hover:underline">
            Explore Movies Now
          </Link>
        </div>
      )}
    </div>
  );
}
