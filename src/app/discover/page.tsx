'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Compass, Filter, RefreshCw } from 'lucide-react';
import { tmdbClient, Movie } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';

function DiscoverContent() {
  const searchParams = useSearchParams();
  const initialGenre = searchParams.get('genre') || '';

  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
  const [selectedGenre, setSelectedGenre] = useState<string>(initialGenre);
  const [year, setYear] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popularity.desc');
  const [minRating, setMinRating] = useState<string>('0');

  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadGenres() {
      try {
        const res = mediaType === 'movie' ? await tmdbClient.getMovieGenres() : await tmdbClient.getTVGenres();
        setGenres(res.genres);
      } catch (err) {
        console.error('Error fetching genres', err);
      }
    }
    loadGenres();
  }, [mediaType]);

  const handleDiscover = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        sort_by: sortBy,
        'vote_average.gte': minRating,
      };

      if (selectedGenre) params.with_genres = selectedGenre;
      if (year) {
        if (mediaType === 'movie') params.primary_release_year = year;
        else params.first_air_date_year = year;
      }

      const res = mediaType === 'movie' ? await tmdbClient.discoverMovies(params) : await tmdbClient.discoverTV(params);
      setResults(res.results);
    } catch (e) {
      console.error('Discover error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleDiscover();
  }, [mediaType, selectedGenre, year, sortBy, minRating]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Compass className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Advanced Discover</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Filter and customize movie & TV titles by genre, year, rating, and sort order.</p>
      </div>

      {/* Filter Controls Panel */}
      <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {/* Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">Type</label>
          <select
            value={mediaType}
            onChange={(e) => {
              setMediaType(e.target.value as any);
              setSelectedGenre('');
            }}
            className="w-full bg-gray-950 text-sm text-gray-200 p-2.5 rounded-xl border border-gray-800 focus:outline-none"
          >
            <option value="movie">Movies</option>
            <option value="tv">TV Shows</option>
          </select>
        </div>

        {/* Genre */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">Genre</label>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full bg-gray-950 text-sm text-gray-200 p-2.5 rounded-xl border border-gray-800 focus:outline-none"
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
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">Release Year</label>
          <input
            type="number"
            placeholder="e.g. 2024"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full bg-gray-950 text-sm text-gray-200 p-2.5 rounded-xl border border-gray-800 focus:outline-none"
          />
        </div>

        {/* Min Rating */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">Min Rating</label>
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="w-full bg-gray-950 text-sm text-gray-200 p-2.5 rounded-xl border border-gray-800 focus:outline-none"
          >
            <option value="0">Any Rating</option>
            <option value="5">5+ ⭐</option>
            <option value="7">7+ ⭐</option>
            <option value="8">8+ ⭐</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-gray-950 text-sm text-gray-200 p-2.5 rounded-xl border border-gray-800 focus:outline-none"
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
            <option value="release_date.desc">Newest Releases</option>
          </select>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-gray-900 animate-pulse rounded-2xl border border-gray-800" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {results.map((item) => (
            <MovieCard
              key={`${mediaType}-${item.id}`}
              id={item.id}
              title={item.title || (item as any).name}
              posterPath={item.poster_path}
              voteAverage={item.vote_average}
              releaseDate={item.release_date || (item as any).first_air_date}
              mediaType={mediaType}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
          <p className="text-gray-400">No titles match your filter criteria.</p>
        </div>
      )}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="p-10 text-gray-400">Loading Discover Engine...</div>}>
      <DiscoverContent />
    </Suspense>
  );
}
