'use client';

import React, { useEffect, useState } from 'react';
import { Globe, Tv, Play } from 'lucide-react';
import { tmdbClient, WatchProvider } from '@/services/tmdb';

export default function StreamingMatrixPage() {
  const [providers, setProviders] = useState<WatchProvider[]>([]);
  const [region, setRegion] = useState('US');
  const [loading, setLoading] = useState(true);

  const topRegions = ['US', 'GB', 'CA', 'DE', 'FR', 'IN', 'JP', 'AU'];

  useEffect(() => {
    async function loadProviders() {
      setLoading(true);
      try {
        const res = await tmdbClient.getMovieWatchProvidersList(region);
        setProviders(res.results || []);
      } catch (e) {
        console.error('Failed loading streaming providers', e);
      } finally {
        setLoading(false);
      }
    }
    loadProviders();
  }, [region]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Globe className="w-8 h-8 text-brand-500" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Global Streaming Providers Matrix</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">Official streaming, buy, and rent providers matrix by territory.</p>
        </div>

        <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-800 self-start sm:self-auto">
          {topRegions.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                region === r ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading streaming matrix...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {providers.map((p) => (
            <div key={p.provider_id} className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 space-y-2 text-center">
              <span className="font-extrabold text-xs text-white line-clamp-1">{p.provider_name}</span>
              <p className="text-[10px] text-gray-400">Priority #{p.display_priority}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
