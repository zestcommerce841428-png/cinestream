import React from 'react';
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
    const [movie, watchProvidersRes] = await Promise.all([
      tmdbClient.getMovieDetails(id),
      tmdbClient.getMovieWatchProvidersDetails(id),
    ]);
    return { movie, providers: watchProvidersRes.results || {} };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) return { title: 'Movie Not Found', robots: { index: false, follow: false } };
  return buildMetadata({
    title: `Watch Providers — ${data.movie.title}`,
    description: `Streaming, rental, and purchase availability by country for ${data.movie.title}.`,
    path: `/movie/${id}/watch-providers`,
  });
}

export default async function MovieWatchProvidersPage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  const data = await getData(movieId);

  if (!data) {
    notFound();
  }

  const { movie, providers } = data;
  const entries = Object.entries(providers).slice(0, 15);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Tv className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Streaming & Digital Purchase Availability — {movie.title}</h1>
        </div>
      </div>

      {entries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map(([countryCode, providerData]: [string, any]) => (
            <div key={countryCode} className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 space-y-3">
              <h3 className="font-bold text-base text-brand-400">{countryCode} Territory</h3>
              {providerData.flatrate && (
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-gray-400">Stream:</span>
                  <p className="text-xs text-white font-bold">{providerData.flatrate.map((p: any) => p.provider_name).join(', ')}</p>
                </div>
              )}
              {providerData.buy && (
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-gray-400">Buy/Rent:</span>
                  <p className="text-xs text-gray-300">{providerData.buy.map((p: any) => p.provider_name).join(', ')}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No watch provider information available.</p>
      )}
    </div>
  );
}
