import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { TrendingDown } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Biggest Box Office Flops',
  description: 'Big-budget movies whose worldwide box office revenue never covered their production budget.',
  path: '/box-office-flops',
});

interface FlopMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  budget: number;
  revenue: number;
  loss: number;
}

function formatMoney(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}

async function getFlops(): Promise<FlopMovie[]> {
  // TMDB's discover endpoint has no budget filter or sort, so a real budget-vs-revenue
  // list has to be computed: pull a candidate pool of well-known movies, fetch full
  // details (which include budget/revenue, unlike the list response) for each, then
  // filter down to genuine losses and rank by size of the loss.
  const [page1, page2] = await Promise.all([
    tmdbClient.discoverMovies({ sort_by: 'popularity.desc', 'vote_count.gte': 200, page: 1 }),
    tmdbClient.discoverMovies({ sort_by: 'popularity.desc', 'vote_count.gte': 200, page: 2 }),
  ]);
  const candidates = [...(page1.results || []), ...(page2.results || [])];

  const details = await Promise.all(
    candidates.map((m) => tmdbClient.getMovieDetails(m.id).catch(() => null))
  );

  return details
    .filter((d): d is NonNullable<typeof d> => !!d && d.budget > 5_000_000 && d.revenue > 0 && d.revenue < d.budget)
    .map((d) => ({
      id: d.id,
      title: d.title,
      poster_path: d.poster_path,
      release_date: d.release_date,
      budget: d.budget,
      revenue: d.revenue,
      loss: d.budget - d.revenue,
    }))
    .sort((a, b) => b.loss - a.loss)
    .slice(0, 18);
}

export default async function BoxOfficeFlopsPage() {
  const flops = await getFlops();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <TrendingDown className="w-8 h-8 text-red-400" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Biggest Box Office Flops</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Well-known movies whose worldwide box office revenue never covered their production budget, ranked by total loss.
        </p>
      </div>

      {flops.length > 0 ? (
        <div className="space-y-3">
          {flops.map((m, idx) => (
            <Link
              key={m.id}
              href={`/movie/${m.id}`}
              className="flex items-center gap-4 bg-gray-900/60 border border-gray-800 rounded-2xl p-3 hover:border-red-500/40 transition"
            >
              <span className="text-lg font-extrabold text-gray-600 w-6 text-center flex-shrink-0">{idx + 1}</span>
              <div className="relative w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-950">
                <Image src={getImageUrl(m.poster_path, 'w185')} alt={m.title} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white line-clamp-1">{m.title}</p>
                <p className="text-[11px] text-gray-500">{m.release_date?.slice(0, 4)}</p>
              </div>
              <div className="flex items-center gap-4 text-right flex-shrink-0">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-semibold">Budget</p>
                  <p className="text-xs font-bold text-gray-300">{formatMoney(m.budget)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-semibold">Revenue</p>
                  <p className="text-xs font-bold text-gray-300">{formatMoney(m.revenue)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-red-400/80 uppercase font-semibold">Loss</p>
                  <p className="text-xs font-extrabold text-red-400">{formatMoney(m.loss)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900/40 rounded-3xl border border-gray-800">
          <p className="text-sm text-gray-400">No qualifying flops found in the current candidate pool.</p>
        </div>
      )}
    </div>
  );
}
