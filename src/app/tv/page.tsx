'use client';

import React, { useEffect, useState } from 'react';
import { Tv, ChevronLeft, ChevronRight } from 'lucide-react';
import { tmdbClient, TVShow } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';

export default function TVPage() {
  const [category, setCategory] = useState<'popular' | 'top_rated' | 'on_the_air' | 'airing_today'>('popular');
  const [shows, setShows] = useState<TVShow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTV() {
      setLoading(true);
      try {
        let res;
        if (category === 'popular') res = await tmdbClient.getTVPopular(page);
        else if (category === 'top_rated') res = await tmdbClient.getTVTopRated(page);
        else if (category === 'on_the_air') res = await tmdbClient.getTVOnTheAir(page);
        else res = await tmdbClient.getTVAiringToday(page);

        setShows(res.results);
        setTotalPages(Math.min(res.total_pages, 500));
      } catch (err) {
        console.error('Failed to fetch TV shows', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTV();
  }, [category, page]);

  const categories = [
    { id: 'popular', label: 'Popular' },
    { id: 'top_rated', label: 'Top Rated' },
    { id: 'on_the_air', label: 'On The Air' },
    { id: 'airing_today', label: 'Airing Today' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Tv className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">TV Series</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">Explore top-rated television shows, anime, and trending series.</p>
        </div>

        <div className="flex bg-gray-900/90 p-1.5 rounded-2xl border border-gray-800 self-start sm:self-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id as any);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                category === cat.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
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
          {shows.map((show) => (
            <MovieCard
              key={show.id}
              id={show.id}
              title={show.name}
              posterPath={show.poster_path}
              voteAverage={show.vote_average}
              releaseDate={show.first_air_date}
              mediaType="tv"
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-800 pt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm font-medium text-gray-300 disabled:opacity-40 hover:text-white hover:border-gray-700 transition"
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
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm font-medium text-gray-300 disabled:opacity-40 hover:text-white hover:border-gray-700 transition"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
