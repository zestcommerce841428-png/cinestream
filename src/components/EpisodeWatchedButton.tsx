'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useWatchHistory, WatchedEpisode } from '@/context/WatchHistoryContext';

interface EpisodeWatchedButtonProps {
  episode: Omit<WatchedEpisode, 'kind' | 'watchedAt'>;
  className?: string;
}

export default function EpisodeWatchedButton({ episode, className = '' }: EpisodeWatchedButtonProps) {
  const { markEpisodeWatched, unmarkEpisodeWatched, isEpisodeWatched } = useWatchHistory();
  const watched = isEpisodeWatched(episode.tvId, episode.seasonNumber, episode.episodeNumber);

  const toggle = () => {
    if (watched) unmarkEpisodeWatched(episode.tvId, episode.seasonNumber, episode.episodeNumber);
    else markEpisodeWatched(episode);
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={watched}
      className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition ${
        watched ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-800'
      } ${className}`}
    >
      <CheckCircle2 className={`w-4 h-4 ${watched ? 'fill-current' : ''}`} />
      <span>{watched ? 'Episode Watched' : 'Mark Episode Watched'}</span>
    </button>
  );
}
