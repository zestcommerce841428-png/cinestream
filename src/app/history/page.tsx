'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { History, Film, Tv, Trash2 } from 'lucide-react';
import { useWatchHistory } from '@/context/WatchHistoryContext';
import { getImageUrl } from '@/services/tmdb';

function formatWhen(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function HistoryPage() {
  const { history, unmarkMovieWatched, unmarkEpisodeWatched, clearHistory } = useWatchHistory();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-8 h-8 text-brand-500" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Viewing History & Watch Log</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            {history.length > 0
              ? `${history.length} movies and episodes marked as watched.`
              : 'Movies and episodes you mark as watched will appear here.'}
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Clear your entire watch history? This cannot be undone.')) clearHistory();
            }}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs font-bold text-gray-300 hover:text-red-400 hover:border-red-500/40 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <div className="space-y-3">
          {history.map((entry) => {
            if (entry.kind === 'movie') {
              return (
                <div
                  key={`movie-${entry.id}`}
                  className="flex items-center gap-4 bg-gray-900/60 border border-gray-800 rounded-2xl p-3 hover:border-brand-500/40 transition"
                >
                  <Link href={`/movie/${entry.id}`} className="relative w-14 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-950">
                    <Image src={getImageUrl(entry.poster_path, 'w185')} alt={entry.title} fill className="object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5 text-[10px] font-bold text-brand-400 uppercase tracking-wide">
                      <Film className="w-3 h-3" />
                      <span>Movie</span>
                    </div>
                    <Link href={`/movie/${entry.id}`} className="text-sm font-bold text-white hover:text-brand-400 line-clamp-1">
                      {entry.title}
                    </Link>
                    <p className="text-[11px] text-gray-500 mt-0.5">Watched {formatWhen(entry.watchedAt)}</p>
                  </div>
                  <button
                    onClick={() => unmarkMovieWatched(entry.id)}
                    aria-label={`Remove ${entry.title} from history`}
                    className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-gray-800 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            }
            return (
              <div
                key={`ep-${entry.tvId}-${entry.seasonNumber}-${entry.episodeNumber}`}
                className="flex items-center gap-4 bg-gray-900/60 border border-gray-800 rounded-2xl p-3 hover:border-purple-500/40 transition"
              >
                <Link href={`/tv/${entry.tvId}`} className="relative w-14 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-950">
                  <Image src={getImageUrl(entry.poster_path, 'w185')} alt={entry.showTitle} fill className="object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5 text-[10px] font-bold text-purple-400 uppercase tracking-wide">
                    <Tv className="w-3 h-3" />
                    <span>
                      S{entry.seasonNumber}E{entry.episodeNumber}
                    </span>
                  </div>
                  <Link href={`/tv/${entry.tvId}`} className="text-sm font-bold text-white hover:text-purple-400 line-clamp-1">
                    {entry.showTitle}
                    {entry.episodeName ? ` — ${entry.episodeName}` : ''}
                  </Link>
                  <p className="text-[11px] text-gray-500 mt-0.5">Watched {formatWhen(entry.watchedAt)}</p>
                </div>
                <button
                  onClick={() => unmarkEpisodeWatched(entry.tvId, entry.seasonNumber, entry.episodeNumber)}
                  aria-label="Remove episode from history"
                  className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-gray-800 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900/40 rounded-3xl border border-gray-800 space-y-3">
          <History className="w-12 h-12 text-gray-600 mx-auto" />
          <h2 className="text-lg font-bold text-white">Your Viewing History is Clean</h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Use the &ldquo;Mark as Watched&rdquo; button on any movie or episode page to start building your log.
          </p>
          <Link href="/movies" className="inline-block mt-2 text-xs font-semibold text-brand-400 hover:underline">
            Explore Movies Now
          </Link>
        </div>
      )}
    </div>
  );
}
