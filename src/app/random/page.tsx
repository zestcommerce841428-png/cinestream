'use client';

import React, { useState } from 'react';
import { RefreshCw, Sparkles, Film } from 'lucide-react';
import { tmdbClient, Movie } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';

export default function RandomPickerPage() {
  const [randomMovie, setRandomMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);

  const spinRandom = async () => {
    setLoading(true);
    try {
      const randomPage = Math.floor(Math.random() * 20) + 1;
      const res = await tmdbClient.getRandomMovie(randomPage);
      if (res.results && res.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * res.results.length);
        setRandomMovie(res.results[randomIndex]);
      }
    } catch (e) {
      console.error('Error spinning random movie', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-center">
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="w-16 h-16 rounded-full bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center mx-auto shadow-xl">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Undecided Movie Night Spinner</h1>
        <p className="text-gray-400 text-sm">Can't decide what to watch? Click below to pick a highly rated random title!</p>
        <button
          onClick={spinRandom}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-xl shadow-brand-600/30 disabled:opacity-50 transition-all hover:scale-105"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Spinning Wheel...' : 'Spin Random Movie'}</span>
        </button>
      </div>

      {randomMovie && (
        <div className="max-w-sm mx-auto pt-6 animate-fadeIn">
          <MovieCard
            id={randomMovie.id}
            title={randomMovie.title}
            posterPath={randomMovie.poster_path}
            voteAverage={randomMovie.vote_average}
            releaseDate={randomMovie.release_date}
            mediaType="movie"
          />
        </div>
      )}
    </div>
  );
}
