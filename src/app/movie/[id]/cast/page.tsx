'use client';

import React, { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, ArrowLeft } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';

export default function MovieCastPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movieId = parseInt(resolvedParams.id, 10);

  const [movie, setMovie] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCast() {
      if (!movieId) return;
      setLoading(true);
      try {
        const [mRes, cRes] = await Promise.all([
          tmdbClient.getMovieDetails(movieId),
          tmdbClient.getMovieCredits(movieId)
        ]);
        setMovie(mRes);
        setCast(cRes.cast || []);
      } catch (e) {
        console.error('Failed loading movie cast', e);
      } finally {
        setLoading(false);
      }
    }
    loadCast();
  }, [movieId]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading cast roster...</div>;
  if (!movie) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">Movie not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <User className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Full Cast Roster — {movie.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {cast.map((actor) => (
          <Link
            key={actor.id}
            href={`/person/${actor.id}`}
            className="group bg-gray-900/80 rounded-2xl overflow-hidden border border-gray-800 hover:border-brand-500/50 transition-all space-y-3 p-3"
          >
            <div className="aspect-[3/4] relative rounded-xl overflow-hidden bg-gray-950">
              {actor.profile_path ? (
                <Image src={getImageUrl(actor.profile_path, 'w185')} alt={actor.name} fill className="object-cover group-hover:scale-105 transition" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-xs text-white group-hover:text-brand-300 line-clamp-1">{actor.name}</h3>
              <p className="text-[11px] text-gray-400 line-clamp-1">{actor.character}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
