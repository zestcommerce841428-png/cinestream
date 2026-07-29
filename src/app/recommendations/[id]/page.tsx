'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Film, ArrowLeft, Sparkles } from 'lucide-react';
import { tmdbClient, Movie } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';

export default function RecommendationsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movieId = parseInt(resolvedParams.id, 10);

  const [movie, setMovie] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'similar'>('recommendations');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!movieId) return;
      setLoading(true);
      try {
        const [detailsRes, recsRes, similarRes] = await Promise.all([
          tmdbClient.getMovieDetails(movieId),
          tmdbClient.getMovieRecommendations(movieId),
          tmdbClient.getMovieSimilar(movieId)
        ]);
        setMovie(detailsRes);
        setRecommendations(recsRes.results || []);
        setSimilar(similarRes.results || []);
      } catch (e) {
        console.error('Error fetching recommendations', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [movieId]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading recommendations engine...</div>;
  if (!movie) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">Movie not found</div>;

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
              <h1 className="text-3xl font-extrabold text-white tracking-tight">AI & Similarity Recommendations for "{movie.title}"</h1>
            </div>
            <p className="text-gray-400 text-sm mt-1">Discover titles recommended based on plot themes, genres, and audience preferences.</p>
          </div>

          <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold ${activeTab === 'recommendations' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Recommendations ({recommendations.length})
            </button>
            <button
              onClick={() => setActiveTab('similar')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold ${activeTab === 'similar' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Similar Movies ({similar.length})
            </button>
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
