'use client';

import React, { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { Tv, Globe, MapPin } from 'lucide-react';
import { tmdbClient, getImageUrl, TVShow } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';

export default function NetworkPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const networkId = parseInt(resolvedParams.id, 10);

  const [network, setNetwork] = useState<any>(null);
  const [shows, setShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNetwork() {
      if (!networkId) return;
      setLoading(true);
      try {
        const [detailsRes, showsRes] = await Promise.all([
          tmdbClient.getNetworkDetails(networkId),
          tmdbClient.getNetworkTVShows(networkId).catch(() => ({ results: [] }))
        ]);
        setNetwork(detailsRes);
        setShows(showsRes.results || []);
      } catch (e) {
        console.error('Error loading network', e);
      } finally {
        setLoading(false);
      }
    }
    loadNetwork();
  }, [networkId]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading network details...</div>;

  if (!network) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">Network not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="bg-gray-900/80 p-8 rounded-3xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-24 h-24 bg-white p-4 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
            {network.logo_path ? (
              <Image src={getImageUrl(network.logo_path, 'w300')} alt={network.name} width={80} height={80} className="object-contain max-h-16" />
            ) : (
              <Tv className="w-10 h-10 text-gray-800" />
            )}
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-3xl font-extrabold text-white">{network.name}</h1>
            {network.origin_country && (
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold uppercase">
                {network.origin_country} Network
              </span>
            )}
          </div>
        </div>

        {network.homepage && (
          <a
            href={network.homepage}
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-semibold text-white transition shadow-lg"
          >
            <Globe className="w-4 h-4" />
            <span>Official Network Site</span>
          </a>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Tv className="w-6 h-6 text-purple-400" />
          <span>Broadcast Series ({shows.length})</span>
        </h2>

        {shows.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {shows.map((s) => (
              <MovieCard
                key={s.id}
                id={s.id}
                title={s.name}
                posterPath={s.poster_path}
                voteAverage={s.vote_average}
                releaseDate={s.first_air_date}
                mediaType="tv"
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No series found for this network.</p>
        )}
      </div>
    </div>
  );
}
