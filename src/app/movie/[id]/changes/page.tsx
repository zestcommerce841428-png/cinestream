'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { History, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';

export default function MovieChangesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movieId = parseInt(resolvedParams.id, 10);

  const [movie, setMovie] = useState<any>(null);
  const [changes, setChanges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChanges() {
      if (!movieId) return;
      setLoading(true);
      try {
        const [mRes, cRes] = await Promise.all([
          tmdbClient.getMovieDetails(movieId),
          tmdbClient.getMovieChanges(movieId)
        ]);
        setMovie(mRes);
        setChanges(cRes.changes || []);
      } catch (e) {
        console.error('Failed loading changes', e);
      } finally {
        setLoading(false);
      }
    }
    loadChanges();
  }, [movieId]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading database modification history...</div>;
  if (!movie) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">Movie not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <History className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Database Revision Log — {movie.title}</h1>
        </div>
      </div>

      <div className="space-y-4">
        {changes.map((c, idx) => (
          <div key={idx} className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
            <span className="font-bold text-xs text-brand-400 uppercase">{c.key}</span>
            <span className="text-xs text-gray-400">{c.items?.length || 0} Modifications</span>
          </div>
        ))}
      </div>
    </div>
  );
}
