'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Download } from 'lucide-react';
import { tmdbClient, getBackdropUrl, Movie } from '@/services/tmdb';

export default function WallpapersPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWallpapers() {
      setLoading(true);
      try {
        const res = await tmdbClient.getCinematographyMovies();
        setMovies(res.results || []);
      } catch (e) {
        console.error('Failed loading wallpapers', e);
      } finally {
        setLoading(false);
      }
    }
    loadWallpapers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <ImageIcon className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">4K Ultra HD Movie Wallpapers Gallery</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">High-resolution theatrical backdrop wallpapers for desktop and mobile devices.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-video bg-gray-900 animate-pulse rounded-2xl border border-gray-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {movies.map((m) => (
            <div key={m.id} className="group relative aspect-video rounded-2xl overflow-hidden border border-gray-800 bg-gray-950 shadow-xl">
              {m.backdrop_path && (
                <Image src={getBackdropUrl(m.backdrop_path, 'w780')} alt={m.title} fill className="object-cover group-hover:scale-105 transition" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <h3 className="font-extrabold text-sm text-white">{m.title}</h3>
                <a
                  href={getBackdropUrl(m.backdrop_path, 'original')}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-bold w-fit shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download 4K</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
