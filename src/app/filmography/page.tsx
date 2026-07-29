'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Film } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';

export default function FilmographyPage() {
  const [personId, setPersonId] = useState(525); // Christopher Nolan
  const [person, setPerson] = useState<any>(null);
  const [credits, setCredits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFilmography() {
      setLoading(true);
      try {
        const [detailsRes, creditsRes] = await Promise.all([
          tmdbClient.getPersonDetails(personId),
          tmdbClient.getPersonMovieCredits(personId)
        ]);
        setPerson(detailsRes);
        const sorted = (creditsRes.crew || creditsRes.cast || []).sort((a: any, b: any) => {
          return new Date(b.release_date || 0).getTime() - new Date(a.release_date || 0).getTime();
        });
        setCredits(sorted);
      } catch (e) {
        console.error('Failed loading filmography', e);
      } finally {
        setLoading(false);
      }
    }
    loadFilmography();
  }, [personId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Filmography Timeline Visualizer</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Chronological timeline visualizer for legendary actors and directors.</p>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading filmography timeline...</div>
      ) : person ? (
        <div className="space-y-6">
          <div className="flex items-center space-x-4 bg-gray-900/80 p-6 rounded-2xl border border-gray-800">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-950 flex-shrink-0">
              {person.profile_path ? (
                <Image src={getImageUrl(person.profile_path, 'w185')} alt={person.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Pic</div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white">{person.name}</h2>
              <p className="text-xs text-gray-400">{person.known_for_department} • {credits.length} Titles Released</p>
            </div>
          </div>

          <div className="space-y-3 pl-4 border-l-2 border-brand-500/40">
            {credits.slice(0, 20).map((item, idx) => (
              <Link
                key={`${item.id}-${idx}`}
                href={`/movie/${item.id}`}
                className="bg-gray-900/40 p-4 rounded-xl border border-gray-800/80 hover:border-brand-500/40 transition flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-sm text-white hover:text-brand-400">{item.title}</h3>
                  <p className="text-xs text-gray-400">{item.job || item.character || 'Contributor'}</p>
                </div>
                <span className="text-xs font-bold text-brand-400">{item.release_date ? item.release_date.split('-')[0] : 'N/A'}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
