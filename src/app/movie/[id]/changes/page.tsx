import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { History, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getData(id: number) {
  try {
    const [movie, changesRes] = await Promise.all([
      tmdbClient.getMovieDetails(id),
      tmdbClient.getMovieChanges(id),
    ]);
    return { movie, changes: changesRes.changes || [] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) return { title: 'Movie Not Found', robots: { index: false, follow: false } };
  return buildMetadata({
    title: `Revision History — ${data.movie.title}`,
    description: `Recent database edit history and modified fields for ${data.movie.title}.`,
    path: `/movie/${id}/changes`,
  });
}

export default async function MovieChangesPage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  const data = await getData(movieId);

  if (!data) {
    notFound();
  }

  const { movie, changes } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <History className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Database Revision Log — {movie.title}</h1>
        </div>
      </div>

      {changes.length > 0 ? (
        <div className="space-y-4">
          {changes.map((c: any, idx: number) => (
            <div key={idx} className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
              <span className="font-bold text-xs text-brand-400 uppercase">{c.key}</span>
              <span className="text-xs text-gray-400">{c.items?.length || 0} Modifications</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No revision history available.</p>
      )}
    </div>
  );
}
