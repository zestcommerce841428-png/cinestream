'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, Star } from 'lucide-react';
import { getImageUrl } from '@/services/tmdb';
import { useWatchlist } from '@/context/WatchlistContext';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  voteAverage: number;
  releaseDate?: string;
  mediaType?: 'movie' | 'tv';
}

export default function MovieCard({
  id,
  title,
  posterPath,
  voteAverage,
  releaseDate,
  mediaType = 'movie',
}: MovieCardProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const isSaved = isInWatchlist(id, mediaType);

  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const href = mediaType === 'movie' ? `/movie/${id}` : `/tv/${id}`;

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      removeFromWatchlist(id, mediaType);
    } else {
      addToWatchlist({
        id,
        title,
        poster_path: posterPath,
        vote_average: voteAverage,
        release_date: releaseDate,
        type: mediaType,
      });
    }
  };

  return (
    <div className="group relative flex flex-col bg-gray-900/60 rounded-2xl overflow-hidden border border-gray-800/80 hover:border-brand-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-600/10 hover:-translate-y-1">
      {/* Poster Image Container */}
      <Link href={href} className="relative aspect-[2/3] w-full overflow-hidden bg-gray-950 block">
        {posterPath ? (
          <Image
            src={getImageUrl(posterPath, 'w500')}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-600 text-xs p-4 text-center">
            No Image
          </div>
        )}

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="bg-dark-900/80 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider text-rose-400 border border-white/10">
            {mediaType}
          </span>
          <button
            onClick={toggleWatchlist}
            className={`pointer-events-auto p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
              isSaved
                ? 'bg-brand-600 text-white'
                : 'bg-dark-900/80 text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
            title={isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Rating overlay bottom */}
        <div className="absolute bottom-3 left-3 bg-dark-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center space-x-1 border border-white/10">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-white">
            {voteAverage ? voteAverage.toFixed(1) : 'N/A'}
          </span>
        </div>
      </Link>

      {/* Info Container */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <Link href={href} className="group-hover:text-brand-500 transition-colors">
          <h3 className="font-semibold text-sm line-clamp-1 text-gray-100">{title}</h3>
        </Link>
        {year && <p className="text-xs text-gray-400 mt-1">{year}</p>}
      </div>
    </div>
  );
}
