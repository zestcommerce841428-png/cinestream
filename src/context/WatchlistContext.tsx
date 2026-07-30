'use client';

import React, { createContext, useContext, useCallback, useSyncExternalStore } from 'react';

export interface WatchlistItem {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  type: 'movie' | 'tv';
  tags?: string[];
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (id: number, type: 'movie' | 'tv') => void;
  isInWatchlist: (id: number, type: 'movie' | 'tv') => boolean;
  setTags: (id: number, type: 'movie' | 'tv', tags: string[]) => void;
}

const WatchlistContext = createContext<WatchlistContextType>({
  watchlist: [],
  addToWatchlist: () => {},
  removeFromWatchlist: () => {},
  isInWatchlist: () => false,
  setTags: () => {},
});

const STORAGE_KEY = 'app_watchlist';
const UPDATE_EVENT = 'watchlist-updated';
const EMPTY: WatchlistItem[] = [];

// Module-level cache so the useSyncExternalStore snapshot function returns a stable
// reference (required to avoid re-render loops) instead of re-parsing JSON every call.
let cachedRaw: string | null | undefined = undefined;
let cachedSnapshot: WatchlistItem[] = EMPTY;

function readStore(): WatchlistItem[] {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cachedRaw) return cachedSnapshot;
  cachedRaw = raw;
  try {
    cachedSnapshot = raw ? JSON.parse(raw) : EMPTY;
  } catch {
    cachedSnapshot = EMPTY;
  }
  return cachedSnapshot;
}

function writeStore(next: WatchlistItem[]) {
  cachedRaw = JSON.stringify(next);
  cachedSnapshot = next;
  try {
    localStorage.setItem(STORAGE_KEY, cachedRaw);
  } catch (e) {
    console.error('Failed to save watchlist', e);
  }
  // The native "storage" event only fires in *other* tabs, so a same-tab custom event
  // is needed for this tab's subscribers (e.g. the navbar badge) to pick up the change.
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(UPDATE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(UPDATE_EVENT, callback);
  };
}

function getServerSnapshot() {
  return EMPTY;
}

export const WatchlistProvider = ({ children }: { children: React.ReactNode }) => {
  const watchlist = useSyncExternalStore(subscribe, readStore, getServerSnapshot);

  const addToWatchlist = useCallback((item: WatchlistItem) => {
    const current = readStore();
    if (current.some((i) => i.id === item.id && i.type === item.type)) return;
    writeStore([...current, item]);
  }, []);

  const removeFromWatchlist = useCallback((id: number, type: 'movie' | 'tv') => {
    writeStore(readStore().filter((i) => !(i.id === id && i.type === type)));
  }, []);

  const isInWatchlist = useCallback(
    (id: number, type: 'movie' | 'tv') => watchlist.some((i) => i.id === id && i.type === type),
    [watchlist]
  );

  const setTags = useCallback((id: number, type: 'movie' | 'tv', tags: string[]) => {
    writeStore(readStore().map((i) => (i.id === id && i.type === type ? { ...i, tags } : i)));
  }, []);

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, setTags }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
