'use client';

import React from 'react';
import { Bookmark } from 'lucide-react';
import { useWatchlist, WatchlistItem } from '@/context/WatchlistContext';

interface WatchlistButtonProps {
  item: WatchlistItem;
  /** "icon" = compact badge (poster overlays), "button" = labeled CTA (detail pages). */
  variant?: 'icon' | 'button';
  className?: string;
}

export default function WatchlistButton({ item, variant = 'icon', className = '' }: WatchlistButtonProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const isSaved = isInWatchlist(item.id, item.type);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      removeFromWatchlist(item.id, item.type);
    } else {
      addToWatchlist(item);
    }
  };

  if (variant === 'button') {
    return (
      <button
        onClick={toggle}
        aria-pressed={isSaved}
        className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition ${
          isSaved ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-brand-600 hover:bg-brand-700 text-white'
        } ${className}`}
      >
        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        <span>{isSaved ? 'In Watchlist' : 'Add to Watchlist'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      title={isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
      aria-pressed={isSaved}
      aria-label={isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
      className={`pointer-events-auto p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
        isSaved ? 'bg-brand-600 text-white' : 'bg-dark-900/80 text-gray-300 hover:text-white hover:bg-gray-800'
      } ${className}`}
    >
      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
    </button>
  );
}
