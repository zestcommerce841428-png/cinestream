'use client';

import React from 'react';
import Link from 'next/link';
import { Film, Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900/80 p-10 rounded-3xl border border-gray-800 max-w-lg w-full text-center space-y-6 shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 rounded-full bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center mx-auto">
          <Film className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">404 — Page Not Found</h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            The cinematic page or route you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-lg transition"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>

          <Link
            href="/search"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-gray-950 hover:bg-gray-800 border border-gray-800 text-gray-300 text-xs font-semibold transition"
          >
            <Search className="w-4 h-4 text-brand-400" />
            <span>Search Platform</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
