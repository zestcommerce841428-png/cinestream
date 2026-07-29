'use client';

import React, { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Award, Star, ArrowLeft } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';

export default function PersonAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const personId = parseInt(resolvedParams.id, 10);

  const [person, setPerson] = useState<any>(null);
  const [credits, setCredits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      if (!personId) return;
      setLoading(true);
      try {
        const [detailsRes, creditsRes] = await Promise.all([
          tmdbClient.getPersonDetails(personId),
          tmdbClient.getPersonCombinedCredits(personId)
        ]);
        setPerson(detailsRes);
        setCredits(creditsRes.cast || creditsRes.crew || []);
      } catch (e) {
        console.error('Failed loading person analytics', e);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [personId]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading person analytics...</div>;
  if (!person) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">Person not found</div>;

  const avgRating = credits.reduce((acc, c) => acc + (c.vote_average || 0), 0) / (credits.length || 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/person/${personId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Award className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Career Analytics - {person.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 space-y-2">
          <span className="text-xs text-gray-400 font-semibold">Total Credits</span>
          <p className="text-3xl font-extrabold text-white">{credits.length}</p>
        </div>

        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 space-y-2">
          <span className="text-xs text-gray-400 font-semibold">Average Film Rating</span>
          <p className="text-3xl font-extrabold text-amber-400">⭐ {avgRating.toFixed(1)}</p>
        </div>

        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 space-y-2">
          <span className="text-xs text-gray-400 font-semibold">Popularity Index</span>
          <p className="text-3xl font-extrabold text-brand-400">{person.popularity?.toFixed(0)}</p>
        </div>
      </div>
    </div>
  );
}
