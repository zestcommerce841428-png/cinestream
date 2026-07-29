'use client';

import React, { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { tmdbClient, getBackdropUrl } from '@/services/tmdb';

export default function MovieBackdropsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movieId = parseInt(resolvedParams.id, 10);

  const [movie, setMovie] = useState<any>(null);
  const [backdrops, setBackdrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBackdrops() {
      if (!movieId) return;
      setLoading(true);
      try {
        const [mRes, imgRes] = await Promise.all([
          tmdbClient.getMovieDetails(movieId),
          tmdbClient.getMovieImages(movieId)
        ]);
        setMovie(mRes);
        setBackdrops(imgRes.backdrops || []);
      } catch (e) {
        console.error('Failed loading backdrops', e);
      } finally {
        setLoading(false);
      }
    }
    loadBackdrops();
  }, [movieId]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading 4K backdrops...</div>;
  if (!movie) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">Movie not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <ImageIcon className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">4K Backdrops & Stills Gallery — {movie.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {backdrops.map((b, idx) => (
          <div key={idx} className="aspect-video relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-950">
            <Image src={getBackdropUrl(b.file_path, 'w780')} alt={`${movie.title} Backdrop`} fill className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
