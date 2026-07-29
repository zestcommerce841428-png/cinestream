'use client';

import React, { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Film, ArrowLeft } from 'lucide-react';
import { tmdbClient, getImageUrl, CastMember, CrewMember } from '@/services/tmdb';

export default function CreditsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movieId = parseInt(resolvedParams.id, 10);

  const [movie, setMovie] = useState<any>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCredits() {
      if (!movieId) return;
      setLoading(true);
      try {
        const [detailsRes, creditsRes] = await Promise.all([
          tmdbClient.getMovieDetails(movieId),
          tmdbClient.getMovieCredits(movieId)
        ]);
        setMovie(detailsRes);
        setCast(creditsRes.cast || []);
        setCrew(creditsRes.crew || []);
      } catch (e) {
        console.error('Error fetching full credits', e);
      } finally {
        setLoading(false);
      }
    }
    loadCredits();
  }, [movieId]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading full cast & crew...</div>;

  if (!movie) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">Movie not found</div>;

  // Group crew members by department
  const crewByDepartment = crew.reduce((acc: Record<string, CrewMember[]>, member) => {
    const dept = member.department || 'Other';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(member);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-gray-800 pb-6 space-y-3">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Full Cast & Crew - {movie.title}</h1>
        <p className="text-gray-400 text-sm">{cast.length} Cast Members • {crew.length} Crew Members across {Object.keys(crewByDepartment).length} Departments</p>
      </div>

      {/* Cast Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
          <User className="w-6 h-6 text-brand-500" />
          <span>Cast Members ({cast.length})</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {cast.map((c) => (
            <Link
              key={c.id}
              href={`/person/${c.id}`}
              className="group bg-gray-900/60 p-3 rounded-2xl border border-gray-800 hover:border-brand-500/50 transition-all text-center"
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-950 mb-2">
                {c.profile_path ? (
                  <Image src={getImageUrl(c.profile_path, 'w185')} alt={c.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Image</div>
                )}
              </div>
              <h3 className="font-semibold text-xs text-white group-hover:text-brand-400 line-clamp-1">{c.name}</h3>
              <p className="text-[11px] text-gray-400 line-clamp-1">{c.character}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Crew Sections Grouped by Department */}
      <div className="space-y-8 border-t border-gray-800 pt-8">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Film className="w-6 h-6 text-purple-400" />
          <span>Crew Members by Department</span>
        </h2>

        {Object.entries(crewByDepartment).map(([dept, members]) => (
          <div key={dept} className="space-y-3">
            <h3 className="text-lg font-bold text-brand-400 border-b border-gray-800 pb-2">{dept} ({members.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {members.map((m, idx) => (
                <Link
                  key={`${m.id}-${idx}`}
                  href={`/person/${m.id}`}
                  className="bg-gray-900/40 p-3 rounded-xl border border-gray-800/80 hover:border-brand-500/40 transition flex items-center space-x-3"
                >
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-950 flex-shrink-0">
                    {m.profile_path ? (
                      <Image src={getImageUrl(m.profile_path, 'w92')} alt={m.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Pic</div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-white hover:text-brand-400">{m.name}</h4>
                    <p className="text-[11px] text-gray-400">{m.job}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
