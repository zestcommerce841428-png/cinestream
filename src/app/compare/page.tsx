'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Scale, Star, DollarSign, Clock, Calendar } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';

export default function ComparePage() {
  const [movie1Id, setMovie1Id] = useState(550); // Fight Club
  const [movie2Id, setMovie2Id] = useState(603); // The Matrix

  const [movie1, setMovie1] = useState<any>(null);
  const [movie2, setMovie2] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadComparison() {
      setLoading(true);
      try {
        const [m1, m2] = await Promise.all([
          tmdbClient.getMovieDetails(movie1Id),
          tmdbClient.getMovieDetails(movie2Id),
        ]);
        setMovie1(m1);
        setMovie2(m2);
      } catch (e) {
        console.error('Comparison error', e);
      } finally {
        setLoading(false);
      }
    }
    loadComparison();
  }, [movie1Id, movie2Id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Scale className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Side-by-Side Media Comparison Engine</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Compare budget, revenue, vote scores, runtime, and statistics between two films.</p>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading comparison metrics...</div>
      ) : movie1 && movie2 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Movie 1 Card */}
          <div className="bg-gray-900/80 p-6 rounded-3xl border border-gray-800 space-y-4 text-center md:text-left">
            <div className="relative aspect-[2/3] w-full max-w-[240px] mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-xl bg-gray-950 border border-gray-800">
              {movie1.poster_path ? (
                <Image src={getImageUrl(movie1.poster_path, 'w500')} alt={movie1.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
              )}
            </div>
            <h2 className="text-2xl font-extrabold text-white">{movie1.title}</h2>
            <div className="space-y-2 text-sm text-gray-300">
              <p><strong>Rating:</strong> ⭐ {movie1.vote_average?.toFixed(1)} ({movie1.vote_count} votes)</p>
              <p><strong>Release Date:</strong> {movie1.release_date}</p>
              <p><strong>Runtime:</strong> {movie1.runtime} mins</p>
              <p><strong>Budget:</strong> ${movie1.budget?.toLocaleString()}</p>
              <p><strong>Revenue:</strong> ${movie1.revenue?.toLocaleString()}</p>
              <p><strong>Popularity Score:</strong> {movie1.popularity?.toFixed(1)}</p>
            </div>
          </div>

          {/* Movie 2 Card */}
          <div className="bg-gray-900/80 p-6 rounded-3xl border border-gray-800 space-y-4 text-center md:text-left">
            <div className="relative aspect-[2/3] w-full max-w-[240px] mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-xl bg-gray-950 border border-gray-800">
              {movie2.poster_path ? (
                <Image src={getImageUrl(movie2.poster_path, 'w500')} alt={movie2.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
              )}
            </div>
            <h2 className="text-2xl font-extrabold text-white">{movie2.title}</h2>
            <div className="space-y-2 text-sm text-gray-300">
              <p><strong>Rating:</strong> ⭐ {movie2.vote_average?.toFixed(1)} ({movie2.vote_count} votes)</p>
              <p><strong>Release Date:</strong> {movie2.release_date}</p>
              <p><strong>Runtime:</strong> {movie2.runtime} mins</p>
              <p><strong>Budget:</strong> ${movie2.budget?.toLocaleString()}</p>
              <p><strong>Revenue:</strong> ${movie2.revenue?.toLocaleString()}</p>
              <p><strong>Popularity Score:</strong> {movie2.popularity?.toFixed(1)}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
