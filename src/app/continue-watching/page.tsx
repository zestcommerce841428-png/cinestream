'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tv, PlayCircle } from 'lucide-react';
import { useWatchHistory, WatchedEpisode } from '@/context/WatchHistoryContext';
import { getImageUrl } from '@/services/tmdb';

export default function ContinueWatchingPage() {
  const { history } = useWatchHistory();

  const shows = useMemo(() => {
    const latestByShow = new Map<number, WatchedEpisode>();
    history.forEach((entry) => {
      if (entry.kind !== 'episode') return;
      const existing = latestByShow.get(entry.tvId);
      if (!existing || entry.watchedAt > existing.watchedAt) latestByShow.set(entry.tvId, entry);
    });
    return Array.from(latestByShow.values()).sort((a, b) => (a.watchedAt < b.watchedAt ? 1 : -1));
  }, [history]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <PlayCircle className="w-8 h-8 text-purple-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Continue Watching</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          TV series with episodes you&apos;ve marked watched, picked up where you left off.
        </p>
      </div>

      {shows.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {shows.map((entry) => (
            <Link
              key={entry.tvId}
              href={`/episode/${entry.tvId}/${entry.seasonNumber}/${entry.episodeNumber + 1}`}
              className="group block"
            >
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 group-hover:border-purple-500/50 transition">
                <Image src={getImageUrl(entry.poster_path, 'w342')} alt={entry.showTitle} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 space-y-1">
                  <p className="text-xs font-bold text-white line-clamp-2">{entry.showTitle}</p>
                  <p className="text-[10px] font-semibold text-purple-300">
                    Continue S{entry.seasonNumber}E{entry.episodeNumber + 1}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900/40 rounded-3xl border border-gray-800 space-y-3">
          <Tv className="w-12 h-12 text-gray-600 mx-auto" />
          <h2 className="text-lg font-bold text-white">Nothing in progress</h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Mark an episode as watched from any episode page and it&apos;ll show up here so you can pick up where you left off.
          </p>
          <Link href="/tv" className="inline-block mt-2 text-xs font-semibold text-purple-400 hover:underline">
            Browse TV Series
          </Link>
        </div>
      )}
    </div>
  );
}
