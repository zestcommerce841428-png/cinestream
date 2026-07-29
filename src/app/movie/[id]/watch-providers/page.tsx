'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Tv, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';

export default function MovieWatchProvidersPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movieId = parseInt(resolvedParams.id, 10);

  const [movie, setMovie] = useState<any>(null);
  const [providers, setProviders] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWatchProviders() {
      if (!movieId) return;
      setLoading(true);
      try {
        const [mRes, pRes] = await Promise.all([
          tmdbClient.getMovieDetails(movieId),
          tmdbClient.getMovieWatchProvidersDetails(movieId)
        ]);
        setMovie(mRes);
        setProviders(pRes.results || {});
      } catch (e) {
        console.error('Failed loading watch providers', e);
      } finally {
        setLoading(false);
      }
    }
    loadWatchProviders();
  }, [movieId]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading streaming options...</div>;
  if (!movie) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">Movie not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Tv className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Streaming & Digital Purchase Availability — {movie.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(providers).slice(0, 15).map(([countryCode, data]: [string, any]) => (
          <div key={countryCode} className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 space-y-3">
            <h3 className="font-bold text-base text-brand-400">{countryCode} Territory</h3>
            {data.flatrate && (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400">Stream:</span>
                <p className="text-xs text-white font-bold">{data.flatrate.map((p: any) => p.provider_name).join(', ')}</p>
              </div>
            )}
            {data.buy && (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400">Buy/Rent:</span>
                <p className="text-xs text-gray-300">{data.buy.map((p: any) => p.provider_name).join(', ')}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
