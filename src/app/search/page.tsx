'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Film, Tv, User } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/services/tmdb';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [inputQuery, setInputQuery] = useState(query);
  const [activeTab, setActiveTab] = useState<'all' | 'movie' | 'tv' | 'person'>('all');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInputQuery(query);
  }, [query]);

  useEffect(() => {
    async function performSearch() {
      if (!query.trim()) return;
      setLoading(true);
      try {
        let res;
        if (activeTab === 'movie') res = await tmdbClient.searchMovies(query);
        else if (activeTab === 'tv') res = await tmdbClient.searchTV(query);
        else if (activeTab === 'person') res = await tmdbClient.searchPeople(query);
        else res = await tmdbClient.searchMulti(query);

        setResults(res.results || []);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    }
    performSearch();
  }, [query, activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header */}
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <Search className="w-7 h-7 text-brand-500" />
          <span>Search Results for "{query}"</span>
        </h1>

        {/* Filter Tabs */}
        <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-800 self-start sm:w-fit">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${
              activeTab === 'all' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setActiveTab('movie')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${
              activeTab === 'movie' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => setActiveTab('tv')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${
              activeTab === 'tv' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            TV Shows
          </button>
          <button
            onClick={() => setActiveTab('person')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${
              activeTab === 'person' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            People
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-gray-900 animate-pulse rounded-2xl border border-gray-800" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {results.map((item) => {
            const type = item.media_type || (activeTab === 'person' ? 'person' : activeTab === 'tv' ? 'tv' : 'movie');

            if (type === 'person') {
              return (
                <Link
                  key={`person-${item.id}`}
                  href={`/person/${item.id}`}
                  className="group bg-gray-900/60 p-3 rounded-2xl border border-gray-800 hover:border-brand-500/50 transition-all text-center"
                >
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-950 mb-2">
                    {item.profile_path ? (
                      <Image src={getImageUrl(item.profile_path, 'w185')} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Image</div>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm text-white group-hover:text-brand-500 line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-gray-400">{item.known_for_department}</p>
                </Link>
              );
            }

            return (
              <MovieCard
                key={`${type}-${item.id}`}
                id={item.id}
                title={item.title || item.name}
                posterPath={item.poster_path}
                voteAverage={item.vote_average}
                releaseDate={item.release_date || item.first_air_date}
                mediaType={type === 'tv' ? 'tv' : 'movie'}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
          <p className="text-gray-400">No results found for "{query}". Try searching another keyword.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-10 text-gray-400">Loading Search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
