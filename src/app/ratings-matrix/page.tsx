'use client';

import React, { useEffect, useState } from 'react';
import { Star, BarChart3, TrendingUp } from 'lucide-react';
import { tmdbClient, Movie } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';

export default function RatingsMatrixPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatrix() {
      setLoading(true);
      try {
        const res = await tmdbClient.getMovieTopRated();
        setMovies(res.results || []);
      } catch (e) {
        console.error('Failed loading ratings matrix', e);
      } finally {
        setLoading(false);
      }
    }
    loadMatrix();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Ratings & Audience Score Matrix</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Explore score distributions, voter consensus ratings, and high-rating masterpieces.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((m) => (
          <MovieCard
            key={m.id}
            id={m.id}
            title={m.title}
            posterPath={m.poster_path}
            voteAverage={m.vote_average}
            releaseDate={m.release_date}
            mediaType="movie"
          />
        ))}
      </div>
    </div>
  );
}
