import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getData(id: number) {
  try {
    const [movie, images] = await Promise.all([
      tmdbClient.getMovieDetails(id),
      tmdbClient.getMovieImages(id),
    ]);
    return { movie, posters: images.posters || [] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) return { title: 'Movie Not Found', robots: { index: false, follow: false } };
  return buildMetadata({
    title: `Posters Gallery — ${data.movie.title}`,
    description: `Browse official poster artwork in multiple languages and regions for ${data.movie.title}.`,
    path: `/movie/${id}/posters`,
  });
}

export default async function MoviePostersPage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  const data = await getData(movieId);

  if (!data) {
    notFound();
  }

  const { movie, posters } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <ImageIcon className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Official Posters Gallery — {movie.title}</h1>
        </div>
      </div>

      {posters.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {posters.map((p: any, idx: number) => (
            <div key={idx} className="aspect-[2/3] relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-950">
              <Image src={getImageUrl(p.file_path, 'w500')} alt={`${movie.title} Poster`} fill className="object-cover" />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No posters available.</p>
      )}
    </div>
  );
}
