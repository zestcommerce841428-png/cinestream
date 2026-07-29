'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Globe, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';

export default function MovieAlternativeTitlesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movieId = parseInt(resolvedParams.id, 10);

  const [movie, setMovie] = useState<any>(null);
  const [titles, setTitles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTitles() {
      if (!movieId) return;
      setLoading(true);
      try {
        const [mRes, aRes] = await Promise.all([
          tmdbClient.getMovieDetails(movieId),
          tmdbClient.getMovieAlternativeTitles(movieId)
        ]);
        setMovie(mRes);
        setTitles(aRes.titles || []);
      } catch (e) {
        console.error('Failed loading alternative titles', e);
      } finally {
        setLoading(false);
      }
    }
    loadTitles();
  }, [movieId]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading alternative titles...</div>;
  if (!movie) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">Movie not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Globe className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">International Alternative Titles — {movie.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {titles.map((t, idx) => (
          <div key={idx} className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
            <span className="font-bold text-xs text-white truncate max-w-[180px]">{t.title}</span>
            <span className="text-[10px] font-mono uppercase bg-gray-950 px-2 py-0.5 rounded text-brand-400 border border-gray-800">{t.iso_3166_1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
