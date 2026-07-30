'use client';

import React, { createContext, useContext, useCallback, useSyncExternalStore } from 'react';

export interface PersonalRating {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  rating: number;
  ratedAt: string;
}

interface RatingsContextType {
  ratings: PersonalRating[];
  setRating: (item: Omit<PersonalRating, 'ratedAt'>) => void;
  removeRating: (id: number, type: 'movie' | 'tv') => void;
  getRating: (id: number, type: 'movie' | 'tv') => number | null;
}

const RatingsContext = createContext<RatingsContextType>({
  ratings: [],
  setRating: () => {},
  removeRating: () => {},
  getRating: () => null,
});

const STORAGE_KEY = 'app_personal_ratings';
const UPDATE_EVENT = 'ratings-updated';
const EMPTY: PersonalRating[] = [];

let cachedRaw: string | null | undefined = undefined;
let cachedSnapshot: PersonalRating[] = EMPTY;

function readStore(): PersonalRating[] {
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

function writeStore(next: PersonalRating[]) {
  cachedRaw = JSON.stringify(next);
  cachedSnapshot = next;
  try {
    localStorage.setItem(STORAGE_KEY, cachedRaw);
  } catch (e) {
    console.error('Failed to save ratings', e);
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

export const RatingsProvider = ({ children }: { children: React.ReactNode }) => {
  const ratings = useSyncExternalStore(subscribe, readStore, getServerSnapshot);

  const setRatingFn = useCallback((item: Omit<PersonalRating, 'ratedAt'>) => {
    const current = readStore().filter((r) => !(r.id === item.id && r.type === item.type));
    writeStore([{ ...item, ratedAt: new Date().toISOString() }, ...current]);
  }, []);

  const removeRating = useCallback((id: number, type: 'movie' | 'tv') => {
    writeStore(readStore().filter((r) => !(r.id === id && r.type === type)));
  }, []);

  const getRating = useCallback(
    (id: number, type: 'movie' | 'tv') => ratings.find((r) => r.id === id && r.type === type)?.rating ?? null,
    [ratings]
  );

  return (
    <RatingsContext.Provider value={{ ratings, setRating: setRatingFn, removeRating, getRating }}>
      {children}
    </RatingsContext.Provider>
  );
};

export const useRatings = () => useContext(RatingsContext);
