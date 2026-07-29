'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Tag, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';

export default function MovieKeywordsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movieId = parseInt(resolvedParams.id, 10);

  const [movie, setMovie] = useState<any>(null);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadKeywords() {
      if (!movieId) return;
      setLoading(true);
      try {
        const [mRes, kRes] = await Promise.all([
          tmdbClient.getMovieDetails(movieId),
          tmdbClient.getMovieKeywords(movieId)
        ]);
        setMovie(mRes);
        setKeywords(kRes.keywords || []);
      } catch (e) {
        console.error('Failed loading keywords', e);
      } finally {
        setLoading(false);
      }
    }
    loadKeywords();
  }, [movieId]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading plot keywords...</div>;
  if (!movie) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">Movie not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Tag className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Plot Keywords & Storytelling Motifs — {movie.title}</h1>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {keywords.map((k) => (
          <Link
            key={k.id}
            href={`/keyword/${k.id}`}
            className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-brand-500/50 text-xs font-bold text-gray-300 hover:text-white transition"
          >
            #{k.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
