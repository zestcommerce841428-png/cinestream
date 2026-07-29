import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getData(id: number) {
  try {
    const [movie, releaseDatesRes] = await Promise.all([
      tmdbClient.getMovieDetails(id),
      tmdbClient.getMovieReleaseDates(id),
    ]);
    return { movie, releaseDates: releaseDatesRes.results || [] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) return { title: 'Movie Not Found', robots: { index: false, follow: false } };
  return buildMetadata({
    title: `Release Dates — ${data.movie.title}`,
    description: `International theatrical release dates and age certifications for ${data.movie.title}.`,
    path: `/movie/${id}/release-dates`,
  });
}

export default async function MovieReleaseDatesPage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  const data = await getData(movieId);

  if (!data) {
    notFound();
  }

  const { movie, releaseDates } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Calendar className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">International Release Dates & Age Certifications — {movie.title}</h1>
        </div>
      </div>

      {releaseDates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {releaseDates.map((item: any) => (
            <div key={item.iso_3166_1} className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 space-y-2">
              <h3 className="font-extrabold text-lg text-white">{item.iso_3166_1}</h3>
              {item.release_dates?.map((rd: any, idx: number) => (
                <div key={idx} className="text-xs text-gray-300 flex items-center justify-between border-b border-gray-800/60 pb-1">
                  <span>Certification: <strong className="text-brand-400">{rd.certification || 'NR'}</strong></span>
                  <span className="text-gray-400">{rd.release_date?.substring(0, 10)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No release date information available.</p>
      )}
    </div>
  );
}
