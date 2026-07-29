'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Globe, Tv, Film } from 'lucide-react';
import { tmdbClient, getImageUrl, WatchProvider } from '@/services/tmdb';

export default function WatchProvidersPage() {
  const [region, setRegion] = useState('US');
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
  const [providers, setProviders] = useState<WatchProvider[]>([]);
  const [regionsList, setRegionsList] = useState<{ iso_3166_1: string; english_name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRegions() {
      try {
        const res = await tmdbClient.getAvailableProviderRegions();
        setRegionsList(res.results || []);
      } catch (e) {
        console.error('Failed to load regions', e);
      }
    }
    loadRegions();
  }, []);

  useEffect(() => {
    async function loadProviders() {
      setLoading(true);
      try {
        const res = mediaType === 'movie'
          ? await tmdbClient.getMovieWatchProvidersList(region)
          : await tmdbClient.getTVWatchProvidersList(region);
        setProviders(res.results || []);
      } catch (e) {
        console.error('Failed to load providers', e);
      } finally {
        setLoading(false);
      }
    }
    loadProviders();
  }, [region, mediaType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Globe className="w-8 h-8 text-brand-500" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Global Streaming Watch Providers</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Browse all official streaming platforms, TV networks, and SVOD services worldwide.
          </p>
        </div>

        {/* Region & Type Controls */}
        <div className="flex items-center space-x-3 bg-gray-900/90 p-2 rounded-2xl border border-gray-800 self-start sm:self-auto">
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value as any)}
            className="bg-gray-950 text-xs font-semibold text-white p-2 rounded-xl border border-gray-800 focus:outline-none"
          >
            <option value="movie">Movies</option>
            <option value="tv">TV Shows</option>
          </select>

          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-gray-950 text-xs font-semibold text-white p-2 rounded-xl border border-gray-800 focus:outline-none"
          >
            {regionsList.map((r) => (
              <option key={r.iso_3166_1} value={r.iso_3166_1}>
                {r.english_name} ({r.iso_3166_1})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-900 animate-pulse rounded-2xl border border-gray-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {providers.map((p) => (
            <Link
              key={p.provider_id}
              href={`/discover`}
              className="group bg-gray-900/60 p-4 rounded-2xl border border-gray-800 hover:border-brand-500/50 transition-all flex flex-col items-center text-center space-y-3"
            >
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-lg bg-gray-950 border border-white/10 group-hover:scale-105 transition-transform">
                {p.logo_path ? (
                  <Image src={getImageUrl(p.logo_path, 'w185')} alt={p.provider_name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Logo</div>
                )}
              </div>
              <span className="text-xs font-semibold text-gray-200 group-hover:text-brand-400 line-clamp-1">{p.provider_name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
