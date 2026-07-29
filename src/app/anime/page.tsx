import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Anime & Japanese Animation Showcase',
  description: 'Discover legendary anime features, Studio Ghibli masterworks, and modern Japanese animated classics.',
  path: '/anime',
});

export default async function AnimePage() {
  const res = await tmdbClient.getAnimeMedia();
  const movies = res.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-rose-400" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Anime & Japanese Animation Showcase</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Discover legendary anime features, Studio Ghibli masterworks, and modern anime classics.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((m) => (
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
