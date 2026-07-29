'use client';

import React, { useEffect, useState } from 'react';
import { Film, Flame, Star, Clapperboard, Calendar, ChevronDown } from 'lucide-react';
import { tmdbClient, Movie } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';

export default function MoviesPage() {
  const [category, setCategory] = useState<'popular' | 'top_rated' | 'now_playing' | 'upcoming'>('popular');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    async function fetchInitialMovies() {
      setLoading(true);
      setPage(1);
      try {
        let res;
        if (category === 'popular') res = await tmdbClient.getMoviePopular(1);
        else if (category === 'top_rated') res = await tmdbClient.getMovieTopRated(1);
        else if (category === 'now_playing') res = await tmdbClient.getMovieNowPlaying(1);
        else res = await tmdbClient.getMovieUpcoming(1);

        setMovies(res.results || []);
      } catch (err) {
        console.error('Failed to fetch movies', err);
      } finally {
        setLoading(false);
      }
    }
    fetchInitialMovies();
  }, [category]);

  const handleLoadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      let res;
      if (category === 'popular') res = await tmdbClient.getMoviePopular(nextPage);
      else if (category === 'top_rated') res = await tmdbClient.getMovieTopRated(nextPage);
      else if (category === 'now_playing') res = await tmdbClient.getMovieNowPlaying(nextPage);
      else res = await tmdbClient.getMovieUpcoming(nextPage);

      if (res.results) {
        setMovies((prev) => [...prev, ...res.results]);
        setPage(nextPage);
      }
    } catch (e) {
      console.error('Error loading more movies', e);
    } finally {
      setLoadingMore(false);
    }
  };

  const categories = [
    { key: 'popular', label: 'Popular Movies', icon: Flame },
    { key: 'top_rated', label: 'Top Rated', icon: Star },
    { key: 'now_playing', label: 'Now Playing', icon: Clapperboard },
    { key: 'upcoming', label: 'Upcoming Releases', icon: Calendar },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Film className="w-8 h-8 text-brand-500" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Explore Feature Films</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">Discover trending blockbusters, top-rated classics, and upcoming theatrical releases.</p>
        </div>

        <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-800 self-start sm:self-auto overflow-x-auto hide-scrollbar max-w-full">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = category === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-gray-900 animate-pulse rounded-2xl border border-gray-800" />
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie, idx) => (
              <MovieCard
                key={`${movie.id}-${idx}`}
                id={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                voteAverage={movie.vote_average}
                releaseDate={movie.release_date}
                mediaType="movie"
              />
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/20 disabled:opacity-50 transition-all hover:scale-105"
            >
              <span>{loadingMore ? 'Loading More Movies...' : 'Load More Movies'}</span>
              <ChevronDown className={`w-4 h-4 ${loadingMore ? 'animate-bounce' : ''}`} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
