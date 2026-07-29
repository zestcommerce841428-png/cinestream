'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface Genre {
  id: number;
  name: string;
}

interface DiscoverFiltersProps {
  genres: Genre[];
  type: 'movie' | 'tv';
  genre: string;
  year: string;
  sort: string;
  rating: string;
}

export default function DiscoverFilters({ genres, type, genre, year, sort, rating }: DiscoverFiltersProps) {
  const router = useRouter();

  const navigate = (patch: Partial<Record<'type' | 'genre' | 'year' | 'sort' | 'rating', string>>) => {
    const next = { type, genre, year, sort, rating, ...patch };
    const params = new URLSearchParams();
    if (next.type !== 'movie') params.set('type', next.type);
    if (next.genre) params.set('genre', next.genre);
    if (next.year) params.set('year', next.year);
    if (next.sort !== 'popularity.desc') params.set('sort', next.sort);
    if (next.rating !== '0') params.set('rating', next.rating);
    router.push(`/discover${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
      {/* Type */}
      <div>
        <label htmlFor="discover-type" className="block text-xs font-semibold text-gray-400 mb-1.5">
          Type
        </label>
        <select
          id="discover-type"
          value={type}
          onChange={(e) => navigate({ type: e.target.value, genre: '' })}
          className="w-full bg-gray-950 text-sm text-gray-200 p-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-brand-500"
        >
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
        </select>
      </div>

      {/* Genre */}
      <div>
        <label htmlFor="discover-genre" className="block text-xs font-semibold text-gray-400 mb-1.5">
          Genre
        </label>
        <select
          id="discover-genre"
          value={genre}
          onChange={(e) => navigate({ genre: e.target.value })}
          className="w-full bg-gray-950 text-sm text-gray-200 p-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-brand-500"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {/* Year */}
      <div>
        <label htmlFor="discover-year" className="block text-xs font-semibold text-gray-400 mb-1.5">
          Release Year
        </label>
        <input
          id="discover-year"
          type="number"
          placeholder="e.g. 2024"
          defaultValue={year}
          onBlur={(e) => navigate({ year: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') navigate({ year: (e.target as HTMLInputElement).value });
          }}
          className="w-full bg-gray-950 text-sm text-gray-200 p-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-brand-500"
        />
      </div>

      {/* Min Rating */}
      <div>
        <label htmlFor="discover-rating" className="block text-xs font-semibold text-gray-400 mb-1.5">
          Min Rating
        </label>
        <select
          id="discover-rating"
          value={rating}
          onChange={(e) => navigate({ rating: e.target.value })}
          className="w-full bg-gray-950 text-sm text-gray-200 p-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-brand-500"
        >
          <option value="0">Any Rating</option>
          <option value="5">5+ ⭐</option>
          <option value="7">7+ ⭐</option>
          <option value="8">8+ ⭐</option>
        </select>
      </div>

      {/* Sort By */}
      <div>
        <label htmlFor="discover-sort" className="block text-xs font-semibold text-gray-400 mb-1.5">
          Sort By
        </label>
        <select
          id="discover-sort"
          value={sort}
          onChange={(e) => navigate({ sort: e.target.value })}
          className="w-full bg-gray-950 text-sm text-gray-200 p-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-brand-500"
        >
          <option value="popularity.desc">Most Popular</option>
          <option value="vote_average.desc">Highest Rated</option>
          <option value="release_date.desc">Newest Releases</option>
        </select>
      </div>
    </div>
  );
}
