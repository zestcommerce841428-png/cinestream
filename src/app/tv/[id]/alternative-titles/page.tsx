'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Globe, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';

export default function TVAlternativeTitlesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const tvId = parseInt(resolvedParams.id, 10);

  const [tv, setTv] = useState<any>(null);
  const [titles, setTitles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTVAlternativeTitles() {
      if (!tvId) return;
      setLoading(true);
      try {
        const [tRes, aRes] = await Promise.all([
          tmdbClient.getTVDetails(tvId),
          tmdbClient.getTVAlternativeTitles(tvId)
        ]);
        setTv(tRes);
        setTitles(aRes.results || []);
      } catch (e) {
        console.error('Failed loading TV alternative titles', e);
      } finally {
        setLoading(false);
      }
    }
    loadTVAlternativeTitles();
  }, [tvId]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading alternative titles...</div>;
  if (!tv) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">TV Show not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/tv/${tvId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Series Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Globe className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">International Alternative Titles — {tv.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {titles.map((t, idx) => (
          <div key={idx} className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
            <span className="font-bold text-xs text-white truncate max-w-[180px]">{t.title}</span>
            <span className="text-[10px] font-mono uppercase bg-gray-950 px-2 py-0.5 rounded text-brand-400 border border-gray-800">{t.iso_3166_1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
