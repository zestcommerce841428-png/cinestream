'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useWatchlist } from '@/context/WatchlistContext';
import { getForYouRecommendationsAction } from '@/lib/actions';
import MediaCarousel from './MediaCarousel';

export default function ForYouRow() {
  const { watchlist } = useWatchlist();
  // `items === null` means "not fetched yet for the current watchlist" (renders the
  // skeleton); `[]` means "fetched, nothing to show". No separate loading flag needed.
  const [items, setItems] = useState<any[] | null>(null);

  useEffect(() => {
    // The render below already bails out to `null` before `items` is read whenever the
    // watchlist is empty, so there's nothing to reset here.
    if (watchlist.length === 0) return;
    let cancelled = false;
    getForYouRecommendationsAction(watchlist.map((w) => ({ id: w.id, type: w.type })))
      .then((res) => {
        if (!cancelled) setItems(res);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [watchlist]);

  if (watchlist.length === 0) return null;

  if (items === null) {
    return (
      <section className="my-10" aria-label="Loading personalized recommendations">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-6 h-6 text-brand-500" />
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">For You</h2>
        </div>
        <div className="flex space-x-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[160px] sm:min-w-[200px] aspect-[2/3] rounded-2xl bg-gray-900/60 border border-gray-800/60 animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return <MediaCarousel title="For You" items={items} icon={<Sparkles className="w-6 h-6 text-brand-500" />} />;
}
