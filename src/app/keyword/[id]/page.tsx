'use client';

import React, { use, useEffect, useState } from 'react';
import { Tag, Film } from 'lucide-react';
import { tmdbClient, Movie } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';

export default function KeywordPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const keywordId = parseInt(resolvedParams.id, 10);

  const [keyword, setKeyword] = useState<any>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadKeyword() {
      if (!keywordId) return;
      setLoading(true);
      try {
        const [detailsRes, moviesRes] = await Promise.all([
          tmdbClient.getKeywordDetails(keywordId),
          tmdbClient.getKeywordMovies(keywordId).catch(() => ({ results: [] }))
        ]);
        setKeyword(detailsRes);
        setMovies(moviesRes.results || []);
      } catch (e) {
        console.error('Error loading keyword', e);
      } finally {
        setLoading(false);
      }
    }
    loadKeyword();
  }, [keywordId]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-gray-400">Loading keyword tagged items...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 flex items-center space-x-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
          <Tag className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Keyword Tag</span>
          <h1 className="text-3xl font-extrabold text-white capitalize">{keyword?.name || `Keyword #${keywordId}`}</h1>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Film className="w-5 h-5 text-brand-500" />
          <span>Tagged Movies ({movies.length})</span>
        </h2>

        {movies.length > 0 ? (
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
        ) : (
          <p className="text-sm text-gray-400">No movies found tagged with this keyword.</p>
        )}
      </div>
    </div>
  );
}
