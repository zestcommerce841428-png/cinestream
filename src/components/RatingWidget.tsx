'use client';

import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { useRatings, PersonalRating } from '@/context/RatingsContext';

interface RatingWidgetProps {
  item: Omit<PersonalRating, 'rating' | 'ratedAt'>;
  className?: string;
}

export default function RatingWidget({ item, className = '' }: RatingWidgetProps) {
  const { setRating, removeRating, getRating } = useRatings();
  const [hover, setHover] = useState<number | null>(null);
  const current = getRating(item.id, item.type);
  const display = hover ?? current ?? 0;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center" onMouseLeave={() => setHover(null)}>
        {Array.from({ length: 10 }).map((_, i) => {
          const value = i + 1;
          return (
            <button
              key={value}
              onClick={() => setRating({ ...item, rating: value })}
              onMouseEnter={() => setHover(value)}
              aria-label={`Rate ${value} out of 10`}
              className="p-0.5 text-amber-400 hover:scale-110 transition-transform"
            >
              <Star className={`w-4 h-4 ${value <= display ? 'fill-amber-400' : 'fill-transparent'}`} />
            </button>
          );
        })}
      </div>
      {current != null && (
        <button
          onClick={() => removeRating(item.id, item.type)}
          aria-label="Clear my rating"
          className="text-gray-500 hover:text-gray-300 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
