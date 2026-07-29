'use client';

import React, { useEffect, useState } from 'react';
import { Flame, Film, Tv, User, Calendar } from 'lucide-react';
import { tmdbClient, Movie, TVShow, Person } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/services/tmdb';

export default function TrendingPage() {
  const [mediaType, setMediaType] = useState<'all' | 'movie' | 'tv' | 'person'>('all');
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('day');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      setLoading(true);
      try {
        let res;
        if (mediaType === 'movie') {
          res = timeWindow === 'day' ? await tmdbClient.getTrendingMoviesDay() : await tmdbClient.getTrendingMoviesWeek();
        } else if (mediaType === 'tv') {
          res = timeWindow === 'day' ? await tmdbClient.getTrendingTVDay() : await tmdbClient.getTrendingTVWeek();
        } else if (mediaType === 'person') {
          res = timeWindow === 'day' ? await tmdbClient.getTrendingPeopleDay() : await tmdbClient.getTrendingPeopleWeek();
        } else {
          res = timeWindow === 'day' ? await tmdbClient.getTrendingAllDay() : await tmdbClient.getTrendingAllWeek();
        }
        setItems(res.results || []);
      } catch (err) {
        console.error('Failed to fetch trending', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTrending();
  }, [mediaType, timeWindow]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Flame className="w-8 h-8 text-brand-500 fill-current" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Trending Showcase</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">Discover what's trending right now across movies, TV series, and actors.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 bg-gray-900/90 p-2 rounded-2xl border border-gray-800 self-start sm:self-auto">
          {/* Time Window */}
          <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-800">
            <button
              onClick={() => setTimeWindow('day')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${timeWindow === 'day' ? 'bg-brand-600 text-white' : 'text-gray-400'}`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeWindow('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${timeWindow === 'week' ? 'bg-brand-600 text-white' : 'text-gray-400'}`}
            >
              This Week
            </button>
          </div>

          {/* Media Type */}
          <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-800">
            <button
              onClick={() => setMediaType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${mediaType === 'all' ? 'bg-brand-600 text-white' : 'text-gray-400'}`}
            >
              All
            </button>
            <button
              onClick={() => setMediaType('movie')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${mediaType === 'movie' ? 'bg-brand-600 text-white' : 'text-gray-400'}`}
            >
              Movies
            </button>
            <button
              onClick={() => setMediaType('tv')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${mediaType === 'tv' ? 'bg-brand-600 text-white' : 'text-gray-400'}`}
            >
              TV
            </button>
            <button
              onClick={() => setMediaType('person')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${mediaType === 'person' ? 'bg-brand-600 text-white' : 'text-gray-400'}`}
            >
              People
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-gray-900 animate-pulse rounded-2xl border border-gray-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {items.map((item) => {
            const type = item.media_type || (mediaType === 'person' ? 'person' : mediaType === 'tv' ? 'tv' : 'movie');

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
      )}
    </div>
  );
}
