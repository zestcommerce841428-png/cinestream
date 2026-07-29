'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Layers, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';

export default function TVEpisodeGroupsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const tvId = parseInt(resolvedParams.id, 10);

  const [tv, setTv] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEpisodeGroups() {
      if (!tvId) return;
      setLoading(true);
      try {
        const [tRes, gRes] = await Promise.all([
          tmdbClient.getTVDetails(tvId),
          tmdbClient.getTVEpisodeGroups(tvId)
        ]);
        setTv(tRes);
        setGroups(gRes.results || []);
      } catch (e) {
        console.error('Failed loading episode groups', e);
      } finally {
        setLoading(false);
      }
    }
    loadEpisodeGroups();
  }, [tvId]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading custom episode groups...</div>;
  if (!tv) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">TV Show not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/tv/${tvId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Series Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Layers className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Episode Groups & Chronological Order — {tv.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((grp) => (
          <div key={grp.id} className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 space-y-2">
            <span className="font-bold text-xs text-brand-400 uppercase">{grp.network?.name || 'Production Group'}</span>
            <h3 className="font-extrabold text-base text-white">{grp.name}</h3>
            <p className="text-xs text-gray-400">{grp.episode_count} Episodes in Group</p>
          </div>
        ))}
      </div>
    </div>
  );
}
