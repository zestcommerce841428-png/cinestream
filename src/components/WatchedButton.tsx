'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useWatchHistory, WatchedMovie } from '@/context/WatchHistoryContext';

interface WatchedButtonProps {
  movie: Omit<WatchedMovie, 'kind' | 'watchedAt'>;
  className?: string;
}

export default function WatchedButton({ movie, className = '' }: WatchedButtonProps) {
  const { markMovieWatched, unmarkMovieWatched, isMovieWatched } = useWatchHistory();
  const watched = isMovieWatched(movie.id);

  const toggle = () => {
    if (watched) unmarkMovieWatched(movie.id);
    else markMovieWatched(movie);
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
      <span>{watched ? 'Watched' : 'Mark as Watched'}</span>
    </button>
  );
}
