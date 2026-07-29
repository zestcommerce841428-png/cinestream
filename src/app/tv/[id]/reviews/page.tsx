'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { tmdbClient, Review } from '@/services/tmdb';

export default function TVReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const tvId = parseInt(resolvedParams.id, 10);

  const [tv, setTv] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTVReviews() {
      if (!tvId) return;
      setLoading(true);
      try {
        const [tRes, rRes] = await Promise.all([
          tmdbClient.getTVDetails(tvId),
          tmdbClient.getTVReviews(tvId)
        ]);
        setTv(tRes);
        setReviews(rRes.results || []);
      } catch (e) {
        console.error('Failed loading TV reviews', e);
      } finally {
        setLoading(false);
      }
    }
    loadTVReviews();
  }, [tvId]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading TV reviews...</div>;
  if (!tv) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">TV Show not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/tv/${tvId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Series Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Critic & Audience Reviews — {tv.name}</h1>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white">{rev.author}</span>
              {rev.author_details?.rating && (
                <span className="text-xs font-bold text-amber-400">⭐ {rev.author_details.rating}/10</span>
              )}
            </div>
            <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">{rev.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
