'use client';

import React, { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Share2, ArrowLeft, Star, Film } from 'lucide-react';
import { tmdbClient, getImageUrl, getBackdropUrl } from '@/services/tmdb';

export default function ShareCardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movieId = parseInt(resolvedParams.id, 10);

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShareCard() {
      if (!movieId) return;
      setLoading(true);
      try {
        const res = await tmdbClient.getMovieDetails(movieId);
        setMovie(res);
      } catch (e) {
        console.error('Failed loading share card movie', e);
      } finally {
        setLoading(false);
      }
    }
    loadShareCard();
  }, [movieId]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Generating social share card...</div>;
  if (!movie) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">Movie not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Share2 className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Social Share Card Generator</h1>
        </div>
        <p className="text-gray-400 text-sm">Preview shareable graphic card for social posts, Instagram, and Twitter.</p>
      </div>

      {/* Social Preview Card */}
      <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-gray-950 border border-gray-800 shadow-2xl p-8 flex flex-col justify-between">
        {movie.backdrop_path && (
          <Image src={getBackdropUrl(movie.backdrop_path, 'original')} alt={movie.title} fill className="object-cover opacity-20" />
        )}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-400">CineStream Featured</span>
          <span className="text-xs font-bold text-amber-400">⭐ {movie.vote_average?.toFixed(1)}/10</span>
        </div>

        <div className="relative z-10 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">{movie.title}</h2>
          <p className="text-xs text-gray-300 line-clamp-2 max-w-xl">{movie.overview}</p>
        </div>
      </div>
    </div>
  );
}
