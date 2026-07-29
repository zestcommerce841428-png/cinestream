'use client';

import React, { useEffect, useState } from 'react';
import { Database, RefreshCw, Film, Tv, User } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';

export default function ChangesLogPage() {
  const [mediaType, setMediaType] = useState<'movie' | 'tv' | 'person'>('movie');
  const [changes, setChanges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChanges() {
      setLoading(true);
      try {
        const res = await tmdbClient.getMediaChangesFeed(mediaType);
        setChanges(res.results || []);
      } catch (e) {
        console.error('Failed loading database changes', e);
      } finally {
        setLoading(false);
      }
    }
    loadChanges();
  }, [mediaType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-8 h-8 text-brand-500" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">TMDB Database Changes Log</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">Live updates, metadata edits, and recent database modification logs.</p>
        </div>

        <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-800 self-start sm:self-auto">
          <button
            onClick={() => setMediaType('movie')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${mediaType === 'movie' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Movies
          </button>
          <button
            onClick={() => setMediaType('tv')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${mediaType === 'tv' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            TV Series
          </button>
          <button
            onClick={() => setMediaType('person')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${mediaType === 'person' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            People
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-900 animate-pulse rounded-xl border border-gray-800" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {changes.slice(0, 25).map((item) => (
            <div key={item.id} className="bg-gray-900/60 px-4 py-3 rounded-xl border border-gray-800/80 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white font-bold">{mediaType.toUpperCase()} #{item.id}</span>
              </div>
              <span className="text-gray-400 text-[11px]">Adult Flag: {item.adult ? 'True' : 'False'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
