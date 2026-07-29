'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900/80 p-8 sm:p-10 rounded-3xl border border-rose-500/30 max-w-lg w-full text-center space-y-6 shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-white">Something Went Wrong</h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            An unexpected error occurred while fetching or rendering cinema data.
          </p>
          {error.digest && (
            <span className="inline-block text-[10px] font-mono text-rose-400 bg-gray-950 px-3 py-1 rounded border border-gray-800">
              Digest: {error.digest}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-lg transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-gray-950 hover:bg-gray-800 border border-gray-800 text-gray-300 text-xs font-semibold transition"
          >
            <Home className="w-4 h-4 text-brand-400" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
