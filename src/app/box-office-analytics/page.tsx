import type { Metadata } from 'next';
import { DollarSign } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Box Office Revenue vs Budget Analytics',
  description: 'Ranked analytics of the highest-grossing movies worldwide, benchmarked by TMDB popularity and audience rating.',
  path: '/box-office-analytics',
});

export default async function BoxOfficeAnalyticsPage() {
  const res = await tmdbClient.getBoxOfficeMovies();
  const movies = res.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Box Office Revenue vs Budget Analytics</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Deep analytics and financial revenue benchmarks for global blockbusters.</p>
      </div>

      <div className="space-y-3">
        {movies.slice(0, 15).map((m, idx) => (
          <div key={m.id} className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-extrabold text-brand-400">#{idx + 1}</span>
              <span className="font-bold text-white text-sm">{m.title}</span>
            </div>
            <div className="flex items-center space-x-4 text-xs font-semibold text-gray-300">
              <span>Rating: ⭐ {m.vote_average?.toFixed(1)}</span>
              <span className="text-emerald-400">Popularity: {m.popularity?.toFixed(0)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
