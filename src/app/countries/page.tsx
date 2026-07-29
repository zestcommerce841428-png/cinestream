'use client';

import React, { useEffect, useState } from 'react';
import { Globe, Film } from 'lucide-react';
import { tmdbClient, Movie } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';

export default function CountriesPage() {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const topCountries = [
    { code: 'US', name: 'United States 🇺🇸' },
    { code: 'GB', name: 'United Kingdom 🇬🇧' },
    { code: 'FR', name: 'France 🇫🇷' },
    { code: 'JP', name: 'Japan 🇯🇵' },
    { code: 'KR', name: 'South Korea 🇰🇷' },
    { code: 'IN', name: 'India 🇮🇳' },
    { code: 'DE', name: 'Germany 🇩🇪' },
    { code: 'IT', name: 'Italy 🇮🇹' },
    { code: 'CA', name: 'Canada 🇨🇦' },
    { code: 'ES', name: 'Spain 🇪🇸' },
  ];

  useEffect(() => {
    async function loadCountryMovies() {
      setLoading(true);
      try {
        const res = await tmdbClient.getMoviesByCountry(selectedCountry);
        setMovies(res.results || []);
      } catch (e) {
        console.error('Failed loading country movies', e);
      } finally {
        setLoading(false);
      }
    }
    loadCountryMovies();
  }, [selectedCountry]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Globe className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Global Cinema by Country</h1>
        </div>
        <p className="text-gray-400 text-sm">Explore cinema production outputs by country of origin.</p>

        <div className="flex flex-wrap gap-2 pt-2">
          {topCountries.map((c) => (
            <button
              key={c.code}
              onClick={() => setSelectedCountry(c.code)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCountry === c.code
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {c.name}
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
