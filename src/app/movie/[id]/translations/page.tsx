import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Languages, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getData(id: number) {
  try {
    const [movie, translationsRes] = await Promise.all([
      tmdbClient.getMovieDetails(id),
      tmdbClient.getMovieTranslations(id),
    ]);
    return { movie, translations: translationsRes.translations || [] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) return { title: 'Movie Not Found', robots: { index: false, follow: false } };
  return buildMetadata({
    title: `Translations — ${data.movie.title}`,
    description: `International translations, taglines, and localized overviews for ${data.movie.title}.`,
    path: `/movie/${id}/translations`,
  });
}

export default async function MovieTranslationsPage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  const data = await getData(movieId);

  if (!data) {
    notFound();
  }

  const { movie, translations } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Languages className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">International Translations & Taglines — {movie.title}</h1>
        </div>
      </div>

      {translations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {translations.map((t: any, idx: number) => (
            <div key={idx} className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 space-y-2">
              <span className="font-bold text-xs text-brand-400 uppercase">{t.name} ({t.iso_639_1})</span>
              <h3 className="font-extrabold text-base text-white">{t.data?.title || movie.title}</h3>
              {t.data?.tagline && <p className="text-xs italic text-amber-400">&ldquo;{t.data.tagline}&rdquo;</p>}
              <p className="text-xs text-gray-400 line-clamp-3 pt-1">{t.data?.overview}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No translations available.</p>
      )}
    </div>
  );
}
