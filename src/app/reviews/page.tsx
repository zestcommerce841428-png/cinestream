import type { Metadata } from 'next';
import { MessageSquare, Star } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Critic & Community Reviews Stream',
  description: 'Read honest audience and critic reviews for popular movies.',
  path: '/reviews',
});

export default async function ReviewsPage() {
  const res = await tmdbClient.getTrendingReviewsStream();
  const reviews = res.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Critic & Community Reviews Stream</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Read honest audience and critic reviews for popular titles.</p>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-brand-400">{rev.author}</span>
                  {rev.author_details?.rating && (
                    <span className="flex items-center space-x-1 text-amber-400 text-xs font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{rev.author_details.rating}/10</span>
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">{new Date(rev.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed max-h-48 overflow-y-auto pr-2 custom-scrollbar">{rev.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No reviews available right now.</p>
      )}
    </div>
  );
}
