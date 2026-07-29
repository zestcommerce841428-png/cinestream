'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';

export default function MovieCrewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movieId = parseInt(resolvedParams.id, 10);

  const [movie, setMovie] = useState<any>(null);
  const [crew, setCrew] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCrew() {
      if (!movieId) return;
      setLoading(true);
      try {
        const [mRes, cRes] = await Promise.all([
          tmdbClient.getMovieDetails(movieId),
          tmdbClient.getMovieCredits(movieId)
        ]);
        setMovie(mRes);
        setCrew(cRes.crew || []);
      } catch (e) {
        console.error('Failed loading movie crew', e);
      } finally {
        setLoading(false);
      }
    }
    loadCrew();
  }, [movieId]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading crew roster...</div>;
  if (!movie) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">Movie not found</div>;

  const departmentsMap = crew.reduce((acc: any, member) => {
    const dept = member.department || 'Other';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(member);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Briefcase className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Full Crew Roster — {movie.title}</h1>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(departmentsMap).map(([deptName, members]: [string, any]) => (
          <div key={deptName} className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 space-y-4">
            <h2 className="text-lg font-bold text-brand-400">{deptName} Department</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {members.map((m: any, idx: number) => (
                <Link key={idx} href={`/person/${m.id}`} className="p-3 bg-gray-950 rounded-xl border border-gray-800 hover:border-brand-500/40 transition">
                  <h3 className="font-bold text-xs text-white">{m.name}</h3>
                  <p className="text-[11px] text-gray-400">{m.job}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
