import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getData(id: number) {
  try {
    const [tv, ratings] = await Promise.all([tmdbClient.getTVDetails(id), tmdbClient.getTVContentRatings(id)]);
    return { tv, ratings: ratings.results || [] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) return { title: 'TV Show Not Found', robots: { index: false, follow: false } };
  return buildMetadata({
    title: `Content Ratings — ${data.tv.name}`,
    description: `Age and content ratings (e.g. TV-MA, PG-13) assigned to ${data.tv.name} by country.`,
    path: `/tv/${id}/content-ratings`,
  });
}

export default async function TVContentRatingsPage({ params }: PageProps) {
  const { id } = await params;
  const tvId = parseInt(id, 10);
  const data = await getData(tvId);

  if (!data) {
    notFound();
  }

  const { tv, ratings } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/tv/${tvId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Series Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">International Content Ratings — {tv.name}</h1>
        </div>
      </div>

      {ratings.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {ratings.map((r: any, idx: number) => (
            <div key={idx} className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
              <span className="font-bold text-xs text-white">{r.iso_3166_1}</span>
              <span className="text-xs font-extrabold text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-lg border border-brand-500/20">{r.rating}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No content ratings available.</p>
      )}
    </div>
  );
}
