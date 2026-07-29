import type { Metadata } from 'next';
import Link from 'next/link';
import { Award } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Highest-Rated Leaderboard',
  description: 'The all-time highest-rated films on CineStream, ranked by TMDB community score among widely-voted titles.',
  path: '/leaderboard',
});

export default async function LeaderboardPage() {
  // Ranked by rating (not revenue — see /box-office for the highest-grossing list) among
  // titles with a meaningful vote sample, so a niche film with five 10/10 votes can't outrank
  // a genuine consensus favorite.
  const res = await tmdbClient.discoverMovies({
    sort_by: 'vote_average.desc',
    'vote_count.gte': 3000,
  });
  const movies = res.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Award className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">All-Time Highest-Rated Leaderboard</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Ranked by TMDB community rating among films with at least 3,000 votes — see the{' '}
          <Link href="/box-office" className="text-brand-400 hover:underline">
            Box Office Leaderboard
          </Link>{' '}
          for the highest-grossing list instead.
        </p>
      </div>

      <div className="space-y-3">
        {movies.map((m, idx) => (
          <Link
            key={m.id}
            href={`/movie/${m.id}`}
            className="bg-gray-900/80 p-4 rounded-2xl border border-gray-800 flex items-center justify-between hover:border-brand-500/50 transition"
          >
            <div className="flex items-center space-x-4">
              <span className="w-8 h-8 rounded-full bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center font-extrabold text-xs">
                #{idx + 1}
              </span>
              <div>
                <h3 className="font-extrabold text-sm text-white">{m.title}</h3>
                <p className="text-xs text-gray-400">{m.release_date}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-amber-400">⭐ {m.vote_average?.toFixed(1)} ({m.vote_count?.toLocaleString()} votes)</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
