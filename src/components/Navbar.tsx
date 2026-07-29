'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Film, Search, Bookmark, Menu, X, Sparkles, UserCheck } from 'lucide-react';
import { useWatchlist } from '@/context/WatchlistContext';

interface NavbarProps {
  onOpenCommandPalette?: () => void;
}

export default function Navbar({ onOpenCommandPalette }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { watchlist } = useWatchlist();

  return (
    <header className="sticky top-0 z-40 w-full glass-nav backdrop-blur-xl border-b border-gray-800/80 bg-gray-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-rose-500 flex items-center justify-center shadow-lg shadow-brand-600/20 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-400">
              CineStream
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-gray-300">
            <Link href="/movies" className="hover:text-white transition">Movies</Link>
            <Link href="/tv" className="hover:text-white transition">TV Series</Link>
            <Link href="/trending" className="hover:text-white transition">Trending</Link>
            <Link href="/ai-recommendations" className="hover:text-brand-300 transition flex items-center space-x-1 text-brand-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Recommender</span>
            </Link>
            <Link href="/auth" className="hover:text-white transition flex items-center space-x-1">
              <UserCheck className="w-3.5 h-3.5 text-brand-400" />
              <span>TMDB Account</span>
            </Link>
            <Link href="/api-explorer" className="hover:text-white transition text-amber-400 font-bold">API Explorer</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenCommandPalette}
              className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-900 border border-gray-800/80 transition"
              aria-label="Command Search Palette"
            >
              <Search className="w-4 h-4" />
            </button>

            <Link
              href="/watchlist"
              className="relative p-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-900 border border-gray-800/80 transition"
              aria-label="Watchlist"
            >
              <Bookmark className="w-4 h-4" />
              {watchlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-600 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center shadow-md">
                  {watchlist.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-900 border border-gray-800/80 transition"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-800 bg-gray-950 px-4 pt-3 pb-6 space-y-3 text-sm font-semibold text-gray-300">
          <Link href="/movies" className="block py-1.5 hover:text-white">Movies</Link>
          <Link href="/tv" className="block py-1.5 hover:text-white">TV Series</Link>
          <Link href="/trending" className="block py-1.5 hover:text-white">Trending</Link>
          <Link href="/ai-recommendations" className="block py-1.5 text-brand-400">AI Mood Recommender</Link>
          <Link href="/auth" className="block py-1.5 text-brand-400">TMDB Account & OAuth</Link>
          <Link href="/api-explorer" className="block py-1.5 text-amber-400">API Explorer</Link>
        </div>
      )}
    </header>
  );
}
