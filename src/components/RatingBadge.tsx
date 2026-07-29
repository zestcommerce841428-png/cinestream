import React from 'react';

interface RatingBadgeProps {
  voteAverage: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function RatingBadge({ voteAverage, size = 'md' }: RatingBadgeProps) {
  const rating = Math.round(voteAverage * 10);
  let color = 'border-emerald-500 text-emerald-400';
  if (rating < 70 && rating >= 50) {
    color = 'border-amber-500 text-amber-400';
  } else if (rating < 50) {
    color = 'border-rose-500 text-rose-400';
  }

  const sizes = {
    sm: 'w-8 h-8 text-xs border-2',
    md: 'w-10 h-10 text-xs font-bold border-2',
    lg: 'w-12 h-12 text-sm font-bold border-4',
  };

  return (
    <div className={`rounded-full bg-gray-900/90 flex items-center justify-center font-semibold shadow-lg ${sizes[size]} ${color}`}>
      {rating}%
    </div>
  );
}
