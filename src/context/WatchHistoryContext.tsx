'use client';

import React, { createContext, useContext, useCallback, useSyncExternalStore } from 'react';

export interface WatchedMovie {
  kind: 'movie';
  id: number;
  title: string;
  poster_path: string | null;
  runtime?: number;
  watchedAt: string;
}

export interface WatchedEpisode {
  kind: 'episode';
  tvId: number;
  showTitle: string;
  poster_path: string | null;
  seasonNumber: number;
  episodeNumber: number;
  episodeName?: string;
  episodeRuntime?: number;
  watchedAt: string;
}

export type WatchedEntry = WatchedMovie | WatchedEpisode;

interface WatchHistoryContextType {
  history: WatchedEntry[];
  markMovieWatched: (movie: Omit<WatchedMovie, 'kind' | 'watchedAt'>) => void;
  unmarkMovieWatched: (id: number) => void;
  isMovieWatched: (id: number) => boolean;
  markEpisodeWatched: (episode: Omit<WatchedEpisode, 'kind' | 'watchedAt'>) => void;
  unmarkEpisodeWatched: (tvId: number, seasonNumber: number, episodeNumber: number) => void;
  isEpisodeWatched: (tvId: number, seasonNumber: number, episodeNumber: number) => boolean;
  getShowProgress: (tvId: number) => WatchedEpisode | null;
  clearHistory: () => void;
}

const WatchHistoryContext = createContext<WatchHistoryContextType>({
  history: [],
  markMovieWatched: () => {},
  unmarkMovieWatched: () => {},
  isMovieWatched: () => false,
  markEpisodeWatched: () => {},
  unmarkEpisodeWatched: () => {},
  isEpisodeWatched: () => false,
  getShowProgress: () => null,
  clearHistory: () => {},
});

const STORAGE_KEY = 'app_watch_history';
const UPDATE_EVENT = 'watch-history-updated';
const EMPTY: WatchedEntry[] = [];

let cachedRaw: string | null | undefined = undefined;
let cachedSnapshot: WatchedEntry[] = EMPTY;

function readStore(): WatchedEntry[] {
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

function writeStore(next: WatchedEntry[]) {
  cachedRaw = JSON.stringify(next);
  cachedSnapshot = next;
  try {
    localStorage.setItem(STORAGE_KEY, cachedRaw);
  } catch (e) {
    console.error('Failed to save watch history', e);
  }
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

export const WatchHistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const history = useSyncExternalStore(subscribe, readStore, getServerSnapshot);

  const markMovieWatched = useCallback((movie: Omit<WatchedMovie, 'kind' | 'watchedAt'>) => {
    const current = readStore().filter((e) => !(e.kind === 'movie' && e.id === movie.id));
    writeStore([{ kind: 'movie', ...movie, watchedAt: new Date().toISOString() }, ...current]);
  }, []);

  const unmarkMovieWatched = useCallback((id: number) => {
    writeStore(readStore().filter((e) => !(e.kind === 'movie' && e.id === id)));
  }, []);

  const isMovieWatched = useCallback(
    (id: number) => history.some((e) => e.kind === 'movie' && e.id === id),
    [history]
  );

  const markEpisodeWatched = useCallback((episode: Omit<WatchedEpisode, 'kind' | 'watchedAt'>) => {
    const current = readStore().filter(
      (e) => !(e.kind === 'episode' && e.tvId === episode.tvId && e.seasonNumber === episode.seasonNumber && e.episodeNumber === episode.episodeNumber)
    );
    writeStore([{ kind: 'episode', ...episode, watchedAt: new Date().toISOString() }, ...current]);
  }, []);

  const unmarkEpisodeWatched = useCallback((tvId: number, seasonNumber: number, episodeNumber: number) => {
    writeStore(
      readStore().filter((e) => !(e.kind === 'episode' && e.tvId === tvId && e.seasonNumber === seasonNumber && e.episodeNumber === episodeNumber))
    );
  }, []);

  const isEpisodeWatched = useCallback(
    (tvId: number, seasonNumber: number, episodeNumber: number) =>
      history.some((e) => e.kind === 'episode' && e.tvId === tvId && e.seasonNumber === seasonNumber && e.episodeNumber === episodeNumber),
    [history]
  );

  const getShowProgress = useCallback(
    (tvId: number): WatchedEpisode | null => {
      const episodes = history.filter((e): e is WatchedEpisode => e.kind === 'episode' && e.tvId === tvId);
      if (episodes.length === 0) return null;
      return episodes.reduce((latest, e) => (e.watchedAt > latest.watchedAt ? e : latest), episodes[0]);
    },
    [history]
  );

  const clearHistory = useCallback(() => writeStore([]), []);

  return (
    <WatchHistoryContext.Provider
      value={{
        history,
        markMovieWatched,
        unmarkMovieWatched,
        isMovieWatched,
        markEpisodeWatched,
        unmarkEpisodeWatched,
        isEpisodeWatched,
        getShowProgress,
        clearHistory,
      }}
    >
      {children}
    </WatchHistoryContext.Provider>
  );
};

export const useWatchHistory = () => useContext(WatchHistoryContext);
