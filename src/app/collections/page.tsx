'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Layers, Search } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';

export default function CollectionsPage() {
  const [query, setQuery] = useState('Marvel');
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const popularPresets = ['Marvel', 'Star Wars', 'Harry Potter', 'Lord of the Rings', 'Fast & Furious', 'Batman', 'Spider-Man', 'Jurassic Park'];

  const searchCollections = async (searchQuery: string) => {
    setLoading(true);
    try {
      const res = await tmdbClient.getPopularCollections(searchQuery);
      setCollections(res.results || []);
    } catch (e) {
      console.error('Failed searching collections', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchCollections(query);
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Layers className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Movie Collections & Franchises</h1>
        </div>
        <p className="text-gray-400 text-sm">Explore multi-part movie sagas, universe franchises, and trilogies.</p>

        {/* Preset Chips */}
        <div className="flex flex-wrap gap-2 pt-2">
          {popularPresets.map((preset) => (
            <button
              key={preset}
              onClick={() => setQuery(preset)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                query === preset ? 'bg-brand-600 text-white border-brand-500' : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-gray-900 animate-pulse rounded-2xl border border-gray-800" />
          ))}
        </div>
      ) : collections.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/collection/${col.id}`}
              className="group relative aspect-[2/3] bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-brand-500 transition-all flex flex-col justify-end p-4"
            >
              {col.poster_path ? (
                <Image src={getImageUrl(col.poster_path, 'w500')} alt={col.name} fill className="object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <div className="absolute inset-0 bg-gray-950 flex items-center justify-center text-gray-600 text-xs">No Poster</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-600/30 px-2 py-0.5 rounded border border-brand-500/30">
                  Franchise
                </span>
                <h3 className="font-extrabold text-sm text-white line-clamp-2">{col.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
          <p className="text-gray-400">No collections found for "{query}".</p>
        </div>
      )}
    </div>
  );
}
