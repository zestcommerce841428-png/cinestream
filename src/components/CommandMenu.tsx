'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Film, Tv, Flame, Star, Calendar, User, Layers, Sparkles, Globe, Terminal, Bookmark, X, Command } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';

export default function CommandMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const quickNavLinks = [
    { name: 'Home Page', href: '/', icon: Flame },
    { name: 'Trending Showcase', href: '/trending', icon: Flame },
    { name: 'Box Office Blockbusters', href: '/box-office', icon: Flame },
    { name: 'Explore Movies', href: '/movies', icon: Film },
    { name: 'TV Series Hub', href: '/tv', icon: Tv },
    { name: 'Top Rated Masterpieces', href: '/top-rated', icon: Star },
    { name: 'Upcoming Releases', href: '/upcoming', icon: Calendar },
    { name: 'Now Playing in Theaters', href: '/now-playing', icon: Film },
    { name: 'Popular Actors & Crew', href: '/popular-people', icon: User },
    { name: 'Movie Franchises & Sagas', href: '/collections', icon: Layers },
    { name: 'Production Studios', href: '/companies', icon: Layers },
    { name: 'Genre Categories', href: '/genres', icon: Sparkles },
    { name: 'Content Age Ratings Guide', href: '/certifications', icon: Sparkles },
    { name: 'Global World Cinema', href: '/languages', icon: Globe },
    { name: 'Critic & Audience Reviews Stream', href: '/reviews', icon: Sparkles },
    { name: 'Watchlist Analytics & Stats', href: '/watch-analytics', icon: Bookmark },
    { name: 'Plot Keywords & Tropes', href: '/keywords', icon: Sparkles },
    { name: 'Global Watch Providers', href: '/providers', icon: Globe },
    { name: '175+ TMDB Endpoints Playground', href: '/api-explorer', icon: Terminal },
    { name: 'Watchlist Manager', href: '/watchlist', icon: Bookmark },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open menu
          window.dispatchEvent(new CustomEvent('open-command-palette'));
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    async function searchItems() {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await tmdbClient.searchMulti(query);
        setResults(res.results?.slice(0, 6) || []);
      } catch (e) {
        console.error('Command menu search error', e);
      } finally {
        setLoading(false);
      }
    }
    const timer = setTimeout(searchItems, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const navigate = (href: string) => {
    router.push(href);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 space-y-3">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-gray-800">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Type to search movies, TV shows, actors or navigate pages... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent py-4 text-sm text-white placeholder-gray-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[420px] overflow-y-auto custom-scrollbar p-3 space-y-3">
          {/* Live Search Results */}
          {query.trim() !== '' && (
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 px-3">Live Search Results</span>
              {loading ? (
                <div className="p-4 text-xs text-gray-500">Searching...</div>
              ) : results.length > 0 ? (
                results.map((item) => {
                  const mediaType = item.media_type || 'movie';
                  const title = item.title || item.name;
                  const href = mediaType === 'person' ? `/person/${item.id}` : mediaType === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;

                  return (
                    <button
                      key={`${mediaType}-${item.id}`}
                      onClick={() => navigate(href)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-800/80 text-left transition"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-950 flex items-center justify-center text-gray-400 font-bold text-xs border border-gray-800">
                          {mediaType === 'movie' ? '🎬' : mediaType === 'tv' ? '📺' : '👤'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white line-clamp-1">{title}</p>
                          <span className="text-[11px] text-gray-400 capitalize">{mediaType}</span>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-xs text-gray-500">No results found.</div>
              )}
            </div>
          )}

          {/* Quick Navigation Pages */}
          {query.trim() === '' && (
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3">Quick Page Navigation</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                {quickNavLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.name}
                      onClick={() => navigate(link.href)}
                      className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-gray-800 text-left transition"
                    >
                      <div className="p-2 rounded-lg bg-gray-950 text-brand-400 border border-gray-800">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-gray-200 hover:text-white line-clamp-1">{link.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 bg-gray-950 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center space-x-2">
            <Command className="w-3.5 h-3.5" />
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">Ctrl + K</kbd> to open anytime</span>
          </div>
          <span>CineStream Command Palette</span>
        </div>
      </div>
    </div>
  );
}
