'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';

export default function MovieExternalIDsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movieId = parseInt(resolvedParams.id, 10);

  const [movie, setMovie] = useState<any>(null);
  const [ids, setIds] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExternalIDs() {
      if (!movieId) return;
      setLoading(true);
      try {
        const [mRes, iRes] = await Promise.all([
          tmdbClient.getMovieDetails(movieId),
          tmdbClient.getMovieExternalIDs(movieId)
        ]);
        setMovie(mRes);
        setIds(iRes);
      } catch (e) {
        console.error('Failed loading external IDs', e);
      } finally {
        setLoading(false);
      }
    }
    loadExternalIDs();
  }, [movieId]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading external database IDs...</div>;
  if (!movie) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">Movie not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <ExternalLink className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">External Database Registries — {movie.title}</h1>
        </div>
      </div>

      <div className="bg-gray-900/80 p-8 rounded-3xl border border-gray-800 space-y-4 font-mono text-xs">
        {ids.imdb_id && (
          <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
            <span className="text-gray-400">IMDb Registry ID</span>
            <a href={`https://www.imdb.com/title/${ids.imdb_id}`} target="_blank" rel="noreferrer" className="text-amber-400 font-bold hover:underline">
              {ids.imdb_id} ↗
            </a>
          </div>
        )}
        {ids.wikidata_id && (
          <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
            <span className="text-gray-400">Wikidata Registry ID</span>
            <span className="text-brand-400 font-bold">{ids.wikidata_id}</span>
          </div>
        )}
        {ids.facebook_id && (
          <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
            <span className="text-gray-400">Facebook Handle</span>
            <span className="text-blue-400 font-bold">{ids.facebook_id}</span>
          </div>
        )}
        {ids.instagram_id && (
          <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
            <span className="text-gray-400">Instagram Handle</span>
            <span className="text-rose-400 font-bold">{ids.instagram_id}</span>
          </div>
        )}
        {ids.twitter_id && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Twitter / X Handle</span>
            <span className="text-sky-400 font-bold">{ids.twitter_id}</span>
          </div>
        )}
      </div>
    </div>
  );
}
