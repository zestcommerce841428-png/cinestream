'use client';

import React, { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Calendar, MapPin, Film, Tv } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';

export default function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const personId = parseInt(resolvedParams.id, 10);

  const [person, setPerson] = useState<any>(null);
  const [credits, setCredits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPerson() {
      if (!personId) return;
      setLoading(true);
      try {
        const [detailsRes, creditsRes] = await Promise.all([
          tmdbClient.getPersonDetails(personId),
          tmdbClient.getPersonCombinedCredits(personId).catch(() => ({ cast: [] }))
        ]);
        setPerson(detailsRes);
        setCredits(creditsRes.cast || []);
      } catch (err) {
        console.error('Error fetching person', err);
      } finally {
        setLoading(false);
      }
    }
    loadPerson();
  }, [personId]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading profile...</div>;
  }

  if (!person) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">
        <h2>Actor not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Profile Image */}
        <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 shadow-xl">
          {person.profile_path ? (
            <Image src={getImageUrl(person.profile_path, 'w500')} alt={person.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
          )}
        </div>

        {/* Bio */}
        <div className="md:col-span-3 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{person.name}</h1>

          <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-medium">
            {person.birthday && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-brand-500" />
                <span>Born: {person.birthday}</span>
              </div>
            )}
            {person.place_of_birth && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>{person.place_of_birth}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4 text-purple-500" />
              <span>Department: {person.known_for_department}</span>
            </div>
          </div>

          {person.biography && (
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Biography</h3>
              <p className="text-sm text-gray-300 leading-relaxed max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {person.biography}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Known For / Filmography */}
      {credits.length > 0 && (
        <div className="space-y-4 border-t border-gray-800 pt-8">
          <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Film className="w-6 h-6 text-brand-500" />
            <span>Known For & Filmography ({credits.length})</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {credits.slice(0, 15).map((item) => (
              <MovieCard
                key={`${item.media_type}-${item.id}`}
                id={item.id}
                title={item.title || item.name}
                posterPath={item.poster_path}
                voteAverage={item.vote_average}
                releaseDate={item.release_date || item.first_air_date}
                mediaType={item.media_type === 'tv' ? 'tv' : 'movie'}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
