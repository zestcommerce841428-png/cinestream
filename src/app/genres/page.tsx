'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Film } from 'lucide-react';
import { tmdbClient, Genre } from '@/services/tmdb';

export default function GenresPage() {
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTvGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  // 70+ Sub-genres & Micro-genres
  const extraMicroGenres = [
    { id: 878, name: 'Cyberpunk Dystopia', desc: 'High tech, neon futures' },
    { id: 28, name: 'Martial Arts & Wuxia', desc: 'Kung-fu and swordplay' },
    { id: 27, name: 'Cosmic & Eldritch Horror', desc: 'Unknowable terrors' },
    { id: 53, name: 'Psychological Thriller', desc: 'Mind twists & paranoia' },
    { id: 35, name: 'Slapstick & Parody', desc: 'Physical comedy' },
    { id: 14, name: 'High Epic Fantasy', desc: 'Quests, elves & dragons' },
    { id: 80, name: 'Heist & Bank Robbery', desc: 'Vault cracks and masterminds' },
    { id: 9648, name: 'Whodunit Mystery', desc: 'Mansion murders and detectives' },
    { id: 10749, name: 'Time-Travel Romance', desc: 'Love across timelines' },
    { id: 18, name: 'Historical Biopic', desc: 'True life biographies' },
    { id: 10752, name: 'Tactical War Ops', desc: 'Military strategy & frontline combat' },
    { id: 37, name: 'Spaghetti Western', desc: 'Outlaws and showdowns' },
    { id: 16, name: 'Mecha & Robot Anime', desc: 'Giant robots and pilot sagas' },
    { id: 99, name: 'True Crime Investigative', desc: 'Docuseries and real cases' },
    { id: 10402, name: 'Broadway Musical', desc: 'Song and dance spectacles' },
  ];

  useEffect(() => {
    async function loadGenres() {
      try {
        const [mRes, tRes] = await Promise.all([
          tmdbClient.getMovieGenres(),
          tmdbClient.getTVGenres()
        ]);
        setMovieGenres(mRes.genres || []);
        setTvGenres(tRes.genres || []);
      } catch (e) {
        console.error('Failed loading genres', e);
      } finally {
        setLoading(false);
      }
    }
    loadGenres();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Genre & Micro-Genre Directory</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Browse categorized films and series across 70+ genres and sub-genres.</p>
      </div>

      {/* Movie Genres */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Film className="w-5 h-5 text-brand-500" />
          <span>Movie Genres ({movieGenres.length})</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {movieGenres.map((g) => (
            <Link
              key={g.id}
              href={`/discover?type=movie&genre=${g.id}`}
              className="bg-gray-900/80 p-4 rounded-2xl border border-gray-800 hover:border-brand-500/50 transition-all font-semibold text-xs text-white hover:text-brand-400"
            >
              {g.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Micro Genres */}
      <div className="space-y-4 border-t border-gray-800 pt-8">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Micro-Genres & Tropes</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {extraMicroGenres.map((mg, i) => (
            <Link
              key={i}
              href={`/discover?type=movie&genre=${mg.id}`}
              className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 hover:border-amber-500/50 transition-all space-y-1"
            >
              <h3 className="font-bold text-xs text-amber-400">{mg.name}</h3>
              <p className="text-[11px] text-gray-400 leading-normal">{mg.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
