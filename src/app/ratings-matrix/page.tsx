import type { Metadata } from 'next';
import { BarChart3 } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Ratings & Audience Score Matrix',
  description: 'Movies ranked by audience voter consensus — the largest, most-rated sample sizes on TMDB, not just the highest averages.',
  path: '/ratings-matrix',
});

export default async function RatingsMatrixPage() {
  // Distinct from /top-rated (sorted purely by average rating): this ranks by voter
  // consensus size — the titles with the largest audience sample backing their score.
  const res = await tmdbClient.discoverMovies({ sort_by: 'vote_count.desc', 'vote_average.gte': 6 });
  const movies = res.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Ratings & Audience Score Matrix</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Explore score distributions, voter consensus ratings, and high-rating masterpieces.</p>
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
