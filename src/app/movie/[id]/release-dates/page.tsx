'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';

export default function MovieReleaseDatesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movieId = parseInt(resolvedParams.id, 10);

  const [movie, setMovie] = useState<any>(null);
  const [releaseDates, setReleaseDates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReleaseDates() {
      if (!movieId) return;
      setLoading(true);
      try {
        const [mRes, rRes] = await Promise.all([
          tmdbClient.getMovieDetails(movieId),
          tmdbClient.getMovieReleaseDates(movieId)
        ]);
        setMovie(mRes);
        setReleaseDates(rRes.results || []);
      } catch (e) {
        console.error('Failed loading release dates', e);
      } finally {
        setLoading(false);
      }
    }
    loadReleaseDates();
  }, [movieId]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading release dates & ratings...</div>;
  if (!movie) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">Movie not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Calendar className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">International Release Dates & Age Certifications — {movie.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {releaseDates.map((item) => (
          <div key={item.iso_3166_1} className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 space-y-2">
            <h3 className="font-extrabold text-lg text-white">{item.iso_3166_1}</h3>
            {item.release_dates?.map((rd: any, idx: number) => (
              <div key={idx} className="text-xs text-gray-300 flex items-center justify-between border-b border-gray-800/60 pb-1">
                <span>Certification: <strong className="text-brand-400">{rd.certification || 'NR'}</strong></span>
                <span className="text-gray-400">{rd.release_date?.substring(0, 10)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
