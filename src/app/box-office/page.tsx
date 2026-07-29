'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { tmdbClient, Movie } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';

export default function BoxOfficePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBoxOffice() {
      setLoading(true);
      try {
        const res = await tmdbClient.getBoxOfficeMovies(page);
        setMovies(res.results || []);
        setTotalPages(Math.min(res.total_pages, 500));
      } catch (err) {
        console.error('Failed to fetch box office movies', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBoxOffice();
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-8 h-8 text-emerald-400" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Box Office Revenue Blockbusters</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">Explore the highest-grossing movies of all time worldwide.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-gray-900 animate-pulse rounded-2xl border border-gray-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              voteAverage={movie.vote_average}
              releaseDate={movie.release_date}
              mediaType="movie"
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-800 pt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm font-medium text-gray-300 disabled:opacity-40 hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="text-xs text-gray-400 font-medium">
          Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong>
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm font-medium text-gray-300 disabled:opacity-40 hover:text-white transition"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
