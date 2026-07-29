'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { tmdbClient, Movie } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';

export default function UpcomingPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [region, setRegion] = useState('US');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUpcoming() {
      setLoading(true);
      try {
        const res = await tmdbClient.getMovieUpcomingRegion(region, page);
        setMovies(res.results || []);
        setTotalPages(Math.min(res.total_pages, 500));
      } catch (err) {
        console.error('Failed to fetch upcoming movies', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUpcoming();
  }, [region, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-8 h-8 text-rose-500" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Upcoming Releases</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">Get early previews of upcoming theatrical releases worldwide.</p>
        </div>

        <div className="flex items-center space-x-2 bg-gray-900/90 p-2 rounded-2xl border border-gray-800 self-start sm:self-auto">
          <span className="text-xs text-gray-400 font-semibold pl-2">Region:</span>
          <select
            value={region}
            onChange={(e) => { setRegion(e.target.value); setPage(1); }}
            className="bg-gray-950 text-xs font-semibold text-white p-2 rounded-xl border border-gray-800 focus:outline-none"
          >
            <option value="US">United States (US)</option>
            <option value="GB">United Kingdom (GB)</option>
            <option value="CA">Canada (CA)</option>
            <option value="IN">India (IN)</option>
          </select>
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
