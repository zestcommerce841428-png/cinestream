import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Globe, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getData(id: number) {
  try {
    const [movie, transRes] = await Promise.all([tmdbClient.getMovieDetails(id), tmdbClient.getMovieTranslations(id)]);
    return { movie, translations: transRes.translations || [] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) return { title: 'Movie Not Found', robots: { index: false, follow: false } };

  return buildMetadata({
    title: `International Translations — ${data.movie.title}`,
    description: `Official title, tagline, and overview translations across ${data.translations.length} world territories for ${data.movie.title}.`,
    path: `/translations/${id}`,
  });
}

export default async function TranslationsPage({ params }: PageProps) {
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
          <span>Back to {movie.title}</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Globe className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">International Localized Titles ({translations.length} Languages)</h1>
        </div>
        <p className="text-gray-400 text-sm">Official title, tagline, and overview translations across world territories for {movie.title}.</p>
      </div>

      {translations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {translations.map((t: any, idx: number) => (
            <div key={idx} className="bg-gray-900/60 p-5 rounded-2xl border border-gray-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-brand-400">
                  {t.english_name} ({t.iso_639_1}-{t.iso_3166_1})
                </span>
                <span className="text-[11px] font-semibold text-gray-400 uppercase bg-gray-950 px-2 py-0.5 rounded border border-gray-800">{t.name}</span>
              </div>
              <h3 className="font-semibold text-white text-sm">{t.data?.title || movie.title}</h3>
              {t.data?.tagline && <p className="text-xs italic text-rose-400">&ldquo;{t.data.tagline}&rdquo;</p>}
              <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed pt-1">{t.data?.overview || 'No translation provided.'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No translations available for this title.</p>
      )}
    </div>
  );
}
