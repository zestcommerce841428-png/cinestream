import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { User, ArrowLeft } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getData(id: number) {
  try {
    const [movie, credits] = await Promise.all([tmdbClient.getMovieDetails(id), tmdbClient.getMovieCredits(id)]);
    return { movie, cast: credits.cast || [] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) return { title: 'Movie Not Found', robots: { index: false, follow: false } };
  return buildMetadata({
    title: `Full Cast — ${data.movie.title}`,
    description: `Complete cast list and character roles for ${data.movie.title}.`,
    path: `/movie/${id}/cast`,
  });
}

export default async function MovieCastPage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  const data = await getData(movieId);

  if (!data) {
    notFound();
  }

  const { movie, cast } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <User className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Full Cast Roster — {movie.title}</h1>
        </div>
      </div>

      {cast.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {cast.map((actor: any) => (
            <Link
              key={actor.id}
              href={`/person/${actor.id}`}
              className="group bg-gray-900/80 rounded-2xl overflow-hidden border border-gray-800 hover:border-brand-500/50 transition-all space-y-3 p-3"
            >
              <div className="aspect-[3/4] relative rounded-xl overflow-hidden bg-gray-950">
                {actor.profile_path ? (
                  <Image
                    src={getImageUrl(actor.profile_path, 'w185')}
                    alt={actor.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 16vw"
                    className="object-cover group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-xs text-white group-hover:text-brand-300 line-clamp-1">{actor.name}</h3>
                <p className="text-[11px] text-gray-400 line-clamp-1">{actor.character}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No cast information available.</p>
      )}
    </div>
  );
}
