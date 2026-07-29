'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

interface MediaCarouselProps {
  title: string;
  items: any[];
  mediaType?: 'movie' | 'tv';
  icon?: React.ReactNode;
}

export default function MediaCarousel({ title, items, mediaType = 'movie', icon }: MediaCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="my-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {icon}
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-xl bg-gray-900/80 border border-gray-800 text-gray-300 hover:text-white hover:border-gray-700 transition"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-xl bg-gray-900/80 border border-gray-800 text-gray-300 hover:text-white hover:border-gray-700 transition"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex space-x-4 overflow-x-auto hide-scrollbar pb-4 pt-2 -mx-2 px-2 scroll-smooth"
      >
        {items.map((item) => (
          <div key={`${mediaType}-${item.id}`} className="min-w-[160px] sm:min-w-[200px] flex-shrink-0">
            <MovieCard
              id={item.id}
              title={item.title || item.name}
              posterPath={item.poster_path}
              voteAverage={item.vote_average}
              releaseDate={item.release_date || item.first_air_date}
              mediaType={item.media_type || mediaType}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
