'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Globe, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';

export default function TranslationsPage({ params }: { params: Promise<{ id: string }> }) {
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
        const [detailsRes, transRes] = await Promise.all([
          tmdbClient.getMovieDetails(movieId),
          tmdbClient.getMovieTranslations(movieId)
        ]);
        setMovie(detailsRes);
        setTranslations(transRes.translations || []);
      } catch (e) {
        console.error('Failed loading translations', e);
      } finally {
        setLoading(false);
      }
    }
    loadTranslations();
  }, [movieId]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading international translations...</div>;
  if (!movie) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">Movie not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {movie.title}</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Globe className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">International Localized Titles ({translations.length} Languages)</h1>
        </div>
        <p className="text-gray-400 text-sm">Official title, tagline, and overview translations across world territories for {movie.title}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {translations.map((t, idx) => (
          <div key={idx} className="bg-gray-900/60 p-5 rounded-2xl border border-gray-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-brand-400">{t.english_name} ({t.iso_639_1}-{t.iso_3166_1})</span>
              <span className="text-[11px] font-semibold text-gray-400 uppercase bg-gray-950 px-2 py-0.5 rounded border border-gray-800">{t.name}</span>
            </div>
            <h3 className="font-semibold text-white text-sm">{t.data?.title || movie.title}</h3>
            {t.data?.tagline && <p className="text-xs italic text-rose-400">"{t.data.tagline}"</p>}
            <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed pt-1">{t.data?.overview || 'No translation provided.'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
