'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WatchlistItem {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  type: 'movie' | 'tv';
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (id: number, type: 'movie' | 'tv') => void;
  isInWatchlist: (id: number, type: 'movie' | 'tv') => boolean;
}

const WatchlistContext = createContext<WatchlistContextType>({
  watchlist: [],
  addToWatchlist: () => {},
  removeFromWatchlist: () => {},
  isInWatchlist: () => false,
});

export const WatchlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('app_watchlist');
      if (saved) {
        setWatchlist(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load watchlist', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('app_watchlist', JSON.stringify(watchlist));
    } catch (e) {
      console.error('Failed to save watchlist', e);
    }
  }, [watchlist]);

  const addToWatchlist = (item: WatchlistItem) => {
    setWatchlist((prev) => {
      if (prev.some((i) => i.id === item.id && i.type === item.type)) return prev;
      return [...prev, item];
    });
  };

  const removeFromWatchlist = (id: number, type: 'movie' | 'tv') => {
    setWatchlist((prev) => prev.filter((i) => !(i.id === id && i.type === type)));
  };

  const isInWatchlist = (id: number, type: 'movie' | 'tv') => {
    return watchlist.some((i) => i.id === id && i.type === type);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
