'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Languages, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';

export default function MovieTranslationsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movieId = parseInt(resolvedParams.id, 10);

  const [movie, setMovie] = useState<any>(null);
  const [translations, setTranslations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTranslations() {
      if (!movieId) return;
      setLoading(true);
      try {
        const [mRes, tRes] = await Promise.all([
          tmdbClient.getMovieDetails(movieId),
          tmdbClient.getMovieTranslations(movieId)
        ]);
        setMovie(mRes);
        setTranslations(tRes.translations || []);
      } catch (e) {
        console.error('Failed loading translations', e);
      } finally {
        setLoading(false);
      }
    }
    loadTranslations();
  }, [movieId]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading translations...</div>;
  if (!movie) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">Movie not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Languages className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">International Translations & Taglines — {movie.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {translations.map((t, idx) => (
          <div key={idx} className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 space-y-2">
            <span className="font-bold text-xs text-brand-400 uppercase">{t.name} ({t.iso_639_1})</span>
            <h3 className="font-extrabold text-base text-white">{t.data?.title || movie.title}</h3>
            {t.data?.tagline && <p className="text-xs italic text-amber-400">"{t.data.tagline}"</p>}
            <p className="text-xs text-gray-400 line-clamp-3 pt-1">{t.data?.overview}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
