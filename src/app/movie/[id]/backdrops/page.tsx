import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { tmdbClient, getBackdropUrl } from '@/services/tmdb';
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
    return { movie, backdrops: images.backdrops || [] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) return { title: 'Movie Not Found', robots: { index: false, follow: false } };
  return buildMetadata({
    title: `4K Backdrops — ${data.movie.title}`,
    description: `Browse high-resolution backdrop images and stills from ${data.movie.title}.`,
    path: `/movie/${id}/backdrops`,
  });
}

export default async function MovieBackdropsPage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  const data = await getData(movieId);

  if (!data) {
    notFound();
  }

  const { movie, backdrops } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <ImageIcon className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">4K Backdrops & Stills Gallery — {movie.title}</h1>
        </div>
      </div>

      {backdrops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {backdrops.map((b: any, idx: number) => (
            <div key={idx} className="aspect-video relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-950">
              <Image src={getBackdropUrl(b.file_path, 'w780')} alt={`${movie.title} Backdrop`} fill className="object-cover" />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No backdrops available.</p>
      )}
    </div>
  );
}
