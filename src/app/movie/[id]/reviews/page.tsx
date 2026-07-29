'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowLeft, Star } from 'lucide-react';
import { tmdbClient, Review } from '@/services/tmdb';

export default function MovieReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movieId = parseInt(resolvedParams.id, 10);

  const [movie, setMovie] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      if (!movieId) return;
      setLoading(true);
      try {
        const [mRes, rRes] = await Promise.all([
          tmdbClient.getMovieDetails(movieId),
          tmdbClient.getMovieReviews(movieId)
        ]);
        setMovie(mRes);
        setReviews(rRes.results || []);
      } catch (e) {
        console.error('Failed loading movie reviews', e);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, [movieId]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading reviews...</div>;
  if (!movie) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">Movie not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Critic & Community Reviews — {movie.title}</h1>
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
