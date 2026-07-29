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
    const [tv, reviews] = await Promise.all([tmdbClient.getTVDetails(id), tmdbClient.getTVReviews(id)]);
    return { tv, reviews: reviews.results || [] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) return { title: 'TV Show Not Found', robots: { index: false, follow: false } };
  return buildMetadata({
    title: `Reviews — ${data.tv.name}`,
    description: `Critic and audience reviews for ${data.tv.name}, sourced from the TMDB community.`,
    path: `/tv/${id}/reviews`,
  });
}

export default async function TVReviewsPage({ params }: PageProps) {
  const { id } = await params;
  const tvId = parseInt(id, 10);
  const data = await getData(tvId);

  if (!data) {
    notFound();
  }

  const { tv, reviews } = data as { tv: any; reviews: Review[] };

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

      {reviews.length > 0 ? (
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
      ) : (
        <p className="text-sm text-gray-400">No reviews available.</p>
      )}
    </div>
  );
}
