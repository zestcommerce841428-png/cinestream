import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { tmdbClient, Movie, getImageUrl, getBackdropUrl } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata, truncateDescription } from '@/lib/metadata';

export const revalidate = 3600;

const TABS = ['recommendations', 'similar'] as const;
type Tab = (typeof TABS)[number];

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

async function getData(id: number) {
  try {
    const [movie, recsRes, similarRes] = await Promise.all([
      tmdbClient.getMovieDetails(id),
      tmdbClient.getMovieRecommendations(id),
      tmdbClient.getMovieSimilar(id),
    ]);
    return {
      movie,
      recommendations: (recsRes.results || []) as Movie[],
      similar: (similarRes.results || []) as Movie[],
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) {
    return { title: 'Movie Not Found', robots: { index: false, follow: false } };
  }

  const { movie, recommendations, similar } = data;
  return buildMetadata({
    title: `Recommendations & Similar Movies — ${movie.title}`,
    description: truncateDescription(
      `${recommendations.length} AI-curated recommendations and ${similar.length} similar movies for ${movie.title}, based on plot themes, genres, and audience preferences.`
    ),
    path: `/recommendations/${movie.id}`,
    image: movie.poster_path ? getImageUrl(movie.poster_path, 'w780') : movie.backdrop_path ? getBackdropUrl(movie.backdrop_path, 'w1280') : null,
  });
}

export default async function RecommendationsPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  const data = await getData(movieId);

  if (!data) {
    notFound();
  }

  const { movie, recommendations, similar } = data;
  const sp = await searchParams;
  const activeTab: Tab = sp.tab === 'similar' ? 'similar' : 'recommendations';
  const currentList = activeTab === 'recommendations' ? recommendations : similar;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {movie.title}</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-brand-500" />
              <h1 className="text-3xl font-extrabold text-white tracking-tight">AI & Similarity Recommendations for &ldquo;{movie.title}&rdquo;</h1>
            </div>
            <p className="text-gray-400 text-sm mt-1">Discover titles recommended based on plot themes, genres, and audience preferences.</p>
          </div>

          <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-800 self-start sm:self-auto">
            <Link
              href={`/recommendations/${movieId}?tab=recommendations`}
              className={`px-4 py-2 rounded-xl text-xs font-semibold ${activeTab === 'recommendations' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Recommendations ({recommendations.length})
            </Link>
            <Link
              href={`/recommendations/${movieId}?tab=similar`}
              className={`px-4 py-2 rounded-xl text-xs font-semibold ${activeTab === 'similar' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Similar Movies ({similar.length})
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {currentList.map((m) => (
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
    </div>
  );
}
