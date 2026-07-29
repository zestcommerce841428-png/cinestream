'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';

export default function TVContentRatingsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const tvId = parseInt(resolvedParams.id, 10);

  const [tv, setTv] = useState<any>(null);
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContentRatings() {
      if (!tvId) return;
      setLoading(true);
      try {
        const [tRes, rRes] = await Promise.all([
          tmdbClient.getTVDetails(tvId),
          tmdbClient.getTVContentRatings(tvId)
        ]);
        setTv(tRes);
        setRatings(rRes.results || []);
      } catch (e) {
        console.error('Failed loading content ratings', e);
      } finally {
        setLoading(false);
      }
    }
    loadContentRatings();
  }, [tvId]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading content ratings...</div>;
  if (!tv) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">TV Show not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/tv/${tvId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Series Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">International Content Ratings — {tv.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {ratings.map((r, idx) => (
          <div key={idx} className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
            <span className="font-bold text-xs text-white">{r.iso_3166_1}</span>
            <span className="text-xs font-extrabold text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-lg border border-brand-500/20">{r.rating}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
