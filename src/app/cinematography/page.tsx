'use client';

import React, { useEffect, useState } from 'react';
import { Camera, Film } from 'lucide-react';
import { tmdbClient, Movie } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';

export default function CinematographyPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSpectacles() {
      setLoading(true);
      try {
        const res = await tmdbClient.getCinematographyMovies();
        setMovies(res.results || []);
      } catch (e) {
        console.error('Failed loading cinematography movies', e);
      } finally {
        setLoading(false);
      }
    }
    loadSpectacles();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Camera className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Cinematography & Visual Director Spectacles</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Visually breathtaking films from legendary directors of photography.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-gray-900 animate-pulse rounded-2xl border border-gray-800" />
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
}
