'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Bookmark, Film, Tag } from 'lucide-react';
import { useWatchlist } from '@/context/WatchlistContext';
import MovieCard from '@/components/MovieCard';
import TagEditor from '@/components/TagEditor';

export default function WatchlistPage() {
  const { watchlist } = useWatchlist();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    watchlist.forEach((item) => item.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [watchlist]);

  const visible = activeTag ? watchlist.filter((item) => item.tags?.includes(activeTag)) : watchlist;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Bookmark className="w-8 h-8 text-rose-500 fill-current" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Watchlist</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Saved movies and TV series to watch later ({watchlist.length} items). Add tags to any card below to organize into folders.
          </p>
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Tag className="w-4 h-4 text-gray-500" />
          <button
            onClick={() => setActiveTag(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              activeTag === null ? 'bg-brand-600 text-white' : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                activeTag === tag ? 'bg-brand-600 text-white' : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {visible.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {visible.map((item) => (
            <div key={`${item.type}-${item.id}`}>
              <MovieCard
                id={item.id}
                title={item.title}
                posterPath={item.poster_path}
                voteAverage={item.vote_average}
                releaseDate={item.release_date || item.first_air_date}
                mediaType={item.type}
              />
              <TagEditor id={item.id} type={item.type} tags={item.tags || []} />
            </div>
          ))}
        </div>
      ) : watchlist.length > 0 ? (
        <div className="text-center py-16 bg-gray-900/40 rounded-3xl border border-gray-800/80">
          <p className="text-sm text-gray-400">No items tagged &ldquo;{activeTag}&rdquo;.</p>
        </div>
      ) : (
        <div className="text-center py-24 bg-gray-900/40 rounded-3xl border border-gray-800/80 space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/20">
            <Bookmark className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Your Watchlist is empty</h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Browse movies and TV series and click the bookmark button to save items to your personal watchlist!
          </p>
          <div className="pt-2">
            <Link
              href="/movies"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-xl transition-all"
            >
              <Film className="w-4 h-4" />
              <span>Explore Movies</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
