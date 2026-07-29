'use client';

import React, { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Star, Calendar, Clock, User } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';

export default function EpisodePage({ params }: { params: Promise<{ tvId: string; seasonNumber: string; episodeNumber: string }> }) {
  const resolvedParams = use(params);
  const tvId = parseInt(resolvedParams.tvId, 10);
  const seasonNum = parseInt(resolvedParams.seasonNumber, 10);
  const epNum = parseInt(resolvedParams.episodeNumber, 10);

  const [episode, setEpisode] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEpisode() {
      if (!tvId || !seasonNum || !epNum) return;
      setLoading(true);
      try {
        const res = await tmdbClient.getTVEpisodeDetailsDeep(tvId, seasonNum, epNum);
        setEpisode(res);
      } catch (e) {
        console.error('Error fetching episode', e);
      } finally {
        setLoading(false);
      }
    }
    loadEpisode();
  }, [tvId, seasonNum, epNum]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading episode details...</div>;
  if (!episode) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">Episode not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="space-y-4">
        <Link href={`/tv/${tvId}`} className="text-xs font-semibold text-purple-400 hover:underline">
          ← Back to Series
        </Link>
        <div className="relative aspect-video w-full max-h-[450px] rounded-3xl overflow-hidden bg-gray-950 border border-gray-800 shadow-2xl">
          {episode.still_path ? (
            <Image src={getImageUrl(episode.still_path, 'w780')} alt={episode.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">No Episode Still</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
              Season {seasonNum} • Episode {epNum}
            </span>
            <h1 className="text-3xl font-extrabold text-white">{episode.name}</h1>
          </div>
        </div>
      </div>

      <div className="space-y-4 bg-gray-900/80 p-6 rounded-2xl border border-gray-800">
        <h2 className="text-lg font-bold text-white">Overview</h2>
        <p className="text-sm text-gray-300 leading-relaxed">{episode.overview || 'No overview available.'}</p>
        <div className="flex flex-wrap gap-4 text-xs text-gray-400 pt-2 border-t border-gray-800">
          {episode.air_date && <span>Air Date: {episode.air_date}</span>}
          {episode.runtime > 0 && <span>Runtime: {episode.runtime} mins</span>}
          {episode.vote_average > 0 && <span>Rating: ⭐ {episode.vote_average.toFixed(1)}</span>}
        </div>
      </div>
    </div>
  );
}
