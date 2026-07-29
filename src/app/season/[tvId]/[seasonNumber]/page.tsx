'use client';

import React, { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Layers, Calendar, Star, Clock } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';

export default function SeasonPage({ params }: { params: Promise<{ tvId: string; seasonNumber: string }> }) {
  const resolvedParams = use(params);
  const tvId = parseInt(resolvedParams.tvId, 10);
  const seasonNum = parseInt(resolvedParams.seasonNumber, 10);

  const [season, setSeason] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSeason() {
      if (!tvId || !seasonNum) return;
      setLoading(true);
      try {
        const res = await tmdbClient.getTVSeasonDetails(tvId, seasonNum);
        setSeason(res);
      } catch (e) {
        console.error('Error fetching season details', e);
      } finally {
        setLoading(false);
      }
    }
    loadSeason();
  }, [tvId, seasonNum]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading season details...</div>;

  if (!season) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">Season not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="bg-gray-900/80 p-8 rounded-3xl border border-gray-800 flex flex-col md:flex-row items-center gap-8">
        <div className="relative aspect-[2/3] w-48 rounded-2xl overflow-hidden shadow-2xl bg-gray-950 flex-shrink-0">
          {season.poster_path ? (
            <Image src={getImageUrl(season.poster_path, 'w500')} alt={season.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Poster</div>
          )}
        </div>

        <div className="space-y-3 text-center md:text-left">
          <Link href={`/tv/${tvId}`} className="text-xs font-semibold text-purple-400 hover:underline">
            ← Back to TV Series
          </Link>
          <h1 className="text-3xl font-extrabold text-white">{season.name}</h1>
          <p className="text-sm text-gray-300 max-w-3xl leading-relaxed">{season.overview || 'No season overview available.'}</p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-gray-400 pt-2">
            <span className="bg-gray-800 px-3 py-1 rounded-full text-white font-semibold">
              {season.episodes?.length || 0} Episodes
            </span>
            {season.air_date && (
              <span className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>Premiered: {season.air_date}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Episodes List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Episodes ({season.episodes?.length || 0})</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {season.episodes?.map((ep: any) => (
            <div key={ep.id} className="bg-gray-900/60 p-5 rounded-2xl border border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400">Episode {ep.episode_number}</span>
                {ep.vote_average > 0 && (
                  <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{ep.vote_average.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <h3 className="font-bold text-base text-white">{ep.name}</h3>
              <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">{ep.overview || 'No overview provided.'}</p>
              {ep.air_date && <p className="text-[11px] text-gray-500">Air Date: {ep.air_date}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
