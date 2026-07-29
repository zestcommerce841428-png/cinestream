import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Tv, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getData(id: number) {
  try {
    const [tv, providers] = await Promise.all([tmdbClient.getTVDetails(id), tmdbClient.getTVWatchProviders(id)]);
    return { tv, providers: providers.results || {} };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) return { title: 'TV Show Not Found', robots: { index: false, follow: false } };
  return buildMetadata({
    title: `Watch Providers — ${data.tv.name}`,
    description: `Streaming, rental, and broadcast availability for ${data.tv.name} by country.`,
    path: `/tv/${id}/watch-providers`,
  });
}

export default async function TVWatchProvidersPage({ params }: PageProps) {
  const { id } = await params;
  const tvId = parseInt(id, 10);
  const data = await getData(tvId);

  if (!data) {
    notFound();
  }

  const { tv, providers } = data;
  const entries = Object.entries(providers);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/tv/${tvId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Series Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Tv className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Streaming & Broadcast Availability — {tv.name}</h1>
        </div>
      </div>

      {entries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.slice(0, 15).map(([countryCode, data]: [string, any]) => (
            <div key={countryCode} className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 space-y-3">
              <h3 className="font-bold text-base text-brand-400">{countryCode} Territory</h3>
              {data.flatrate && (
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-gray-400">Stream:</span>
                  <p className="text-xs text-white font-bold">{data.flatrate.map((p: any) => p.provider_name).join(', ')}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No watch providers available.</p>
      )}
    </div>
  );
}
