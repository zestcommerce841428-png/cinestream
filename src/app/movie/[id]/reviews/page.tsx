import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { tmdbClient, Review } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getData(id: number) {
  try {
    const [movie, reviewsRes] = await Promise.all([
      tmdbClient.getMovieDetails(id),
      tmdbClient.getMovieReviews(id),
    ]);
    return { movie, reviews: reviewsRes.results || [] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) return { title: 'Movie Not Found', robots: { index: false, follow: false } };
  return buildMetadata({
    title: `Reviews — ${data.movie.title}`,
    description: `Critic and community reviews for ${data.movie.title}.`,
    path: `/movie/${id}/reviews`,
  });
}

export default async function MovieReviewsPage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  const data = await getData(movieId);

  if (!data) {
    notFound();
  }

  const { movie, reviews } = data;

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

      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((rev: Review) => (
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
      ) : (
        <p className="text-sm text-gray-400">No reviews available.</p>
      )}
    </div>
  );
}
