import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getData(id: number) {
  try {
    const [movie, ids] = await Promise.all([
      tmdbClient.getMovieDetails(id),
      tmdbClient.getMovieExternalIDs(id),
    ]);
    return { movie, ids };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) return { title: 'Movie Not Found', robots: { index: false, follow: false } };
  return buildMetadata({
    title: `External IDs — ${data.movie.title}`,
    description: `IMDb, Wikidata, and social media identifiers for ${data.movie.title} on external databases.`,
    path: `/movie/${id}/external-ids`,
  });
}

export default async function MovieExternalIDsPage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  const data = await getData(movieId);

  if (!data) {
    notFound();
  }

  const { movie, ids } = data;
  const hasAnyId = Boolean(ids.imdb_id || ids.wikidata_id || ids.facebook_id || ids.instagram_id || ids.twitter_id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <ExternalLink className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">External Database Registries — {movie.title}</h1>
        </div>
      </div>

      {hasAnyId ? (
        <div className="bg-gray-900/80 p-8 rounded-3xl border border-gray-800 space-y-4 font-mono text-xs">
          {ids.imdb_id && (
            <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
              <span className="text-gray-400">IMDb Registry ID</span>
              <a href={`https://www.imdb.com/title/${ids.imdb_id}`} target="_blank" rel="noreferrer" className="text-amber-400 font-bold hover:underline">
                {ids.imdb_id} ↗
              </a>
            </div>
          )}
          {ids.wikidata_id && (
            <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
              <span className="text-gray-400">Wikidata Registry ID</span>
              <span className="text-brand-400 font-bold">{ids.wikidata_id}</span>
            </div>
          )}
          {ids.facebook_id && (
            <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
              <span className="text-gray-400">Facebook Handle</span>
              <span className="text-blue-400 font-bold">{ids.facebook_id}</span>
            </div>
          )}
          {ids.instagram_id && (
            <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
              <span className="text-gray-400">Instagram Handle</span>
              <span className="text-rose-400 font-bold">{ids.instagram_id}</span>
            </div>
          )}
          {ids.twitter_id && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Twitter / X Handle</span>
              <span className="text-sky-400 font-bold">{ids.twitter_id}</span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No external IDs available.</p>
      )}
    </div>
  );
}
