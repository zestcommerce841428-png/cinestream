import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { tmdbClient, Movie } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';
import MovieCard from '@/components/MovieCard';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getData(id: number) {
  try {
    const [movie, recommendationsRes] = await Promise.all([
      tmdbClient.getMovieDetails(id),
      tmdbClient.getMovieRecommendations(id),
    ]);
    return { movie, recommendations: recommendationsRes.results || [] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) return { title: 'Movie Not Found', robots: { index: false, follow: false } };
  return buildMetadata({
    title: `Recommendations — ${data.movie.title}`,
    description: `Movies recommended by TMDB for fans of ${data.movie.title}.`,
    path: `/movie/${id}/recommendations`,
  });
}

export default async function MovieRecommendationsPage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  const data = await getData(movieId);

  if (!data) {
    notFound();
  }

  const { movie, recommendations } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Recommended Movies Based on {movie.title}</h1>
        </div>
      </div>

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {recommendations.map((m: Movie) => (
            <MovieCard
              key={m.id}
              id={m.id}
              title={m.title}
              posterPath={m.poster_path}
              voteAverage={m.vote_average}
              releaseDate={m.release_date}
              mediaType="movie"
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No recommendations available.</p>
      )}
    </div>
  );
}
