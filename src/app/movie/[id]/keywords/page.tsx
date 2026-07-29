import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Tag, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getData(id: number) {
  try {
    const [movie, keywordsRes] = await Promise.all([
      tmdbClient.getMovieDetails(id),
      tmdbClient.getMovieKeywords(id),
    ]);
    return { movie, keywords: keywordsRes.keywords || [] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) return { title: 'Movie Not Found', robots: { index: false, follow: false } };
  return buildMetadata({
    title: `Plot Keywords — ${data.movie.title}`,
    description: `Plot keywords and storytelling motifs tagged for ${data.movie.title}.`,
    path: `/movie/${id}/keywords`,
  });
}

export default async function MovieKeywordsPage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  const data = await getData(movieId);

  if (!data) {
    notFound();
  }

  const { movie, keywords } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Tag className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Plot Keywords & Storytelling Motifs — {movie.title}</h1>
        </div>
      </div>

      {keywords.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {keywords.map((k: any) => (
            <Link
              key={k.id}
              href={`/keyword/${k.id}`}
              className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-brand-500/50 text-xs font-bold text-gray-300 hover:text-white transition"
            >
              #{k.name}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No plot keywords available.</p>
      )}
    </div>
  );
}
