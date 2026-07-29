'use client';

import React, { useEffect, useState } from 'react';
import { Clock, Film } from 'lucide-react';
import { tmdbClient, Movie } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';

export default function DecadePage() {
  const [selectedDecade, setSelectedDecade] = useState(1990);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const decades = [
    { start: 1950, end: 1959, label: '1950s (Golden Era)' },
    { start: 1960, end: 1969, label: '1960s (Classics)' },
    { start: 1970, end: 1979, label: '1970s (New Hollywood)' },
    { start: 1980, end: 1989, label: '1980s (Blockbusters)' },
    { start: 1990, end: 1999, label: '1990s (Indie & Action)' },
    { start: 2000, end: 2009, label: '2000s (Digital Age)' },
    { start: 2010, end: 2019, label: '2010s (Franchise Era)' },
    { start: 2020, end: 2029, label: '2020s (Modern Era)' },
  ];

  const currentDecadeObj = decades.find((d) => d.start === selectedDecade) || decades[4];

  useEffect(() => {
    async function loadDecade() {
      setLoading(true);
      try {
        const res = await tmdbClient.getMoviesByDecade(currentDecadeObj.start, currentDecadeObj.end);
        setMovies(res.results || []);
      } catch (e) {
        console.error('Error loading decade movies', e);
      } finally {
        setLoading(false);
      }
    }
    loadDecade();
  }, [selectedDecade]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Decade Cinema Time Machine</h1>
        </div>
        <p className="text-gray-400 text-sm">Travel through cinema history and explore defining films by decade era.</p>

        <div className="flex flex-wrap gap-2 pt-2">
          {decades.map((d) => (
            <button
              key={d.start}
              onClick={() => setSelectedDecade(d.start)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedDecade === d.start
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {d.label}
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
