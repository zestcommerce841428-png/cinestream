'use client';

import React, { useEffect, useState } from 'react';
import { Globe, Film } from 'lucide-react';
import { tmdbClient, Movie } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';

export default function LanguagesPage() {
  const [selectedLang, setSelectedLang] = useState('ja');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const topLanguages = [
    { code: 'ja', name: 'Japanese (Anime & Cinema)' },
    { code: 'es', name: 'Spanish Cinema' },
    { code: 'fr', name: 'French Cinema' },
    { code: 'ko', name: 'Korean (K-Drama & Film)' },
    { code: 'hi', name: 'Hindi (Bollywood)' },
    { code: 'de', name: 'German Cinema' },
    { code: 'it', name: 'Italian Classics' },
    { code: 'zh', name: 'Chinese & Martial Arts' },
  ];

  useEffect(() => {
    async function loadLangs() {
      try {
        const res = await tmdbClient.getLanguages();
        setLanguages(res || []);
      } catch (e) {
        console.error('Failed loading languages', e);
      }
    }
    loadLangs();
  }, []);

  useEffect(() => {
    async function fetchMoviesByLang() {
      setLoading(true);
      try {
        const res = await tmdbClient.getMoviesByLanguage(selectedLang);
        setMovies(res.results || []);
      } catch (e) {
        console.error('Failed loading movies by language', e);
      } finally {
        setLoading(false);
      }
    }
    fetchMoviesByLang();
  }, [selectedLang]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Globe className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Global International Cinema</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Discover world cinema categorized by original language.</p>

        {/* Preset Chips */}
        <div className="flex flex-wrap gap-2 pt-4">
          {topLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                selectedLang === lang.code ? 'bg-brand-600 text-white border-brand-500 shadow-md' : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {lang.name}
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
