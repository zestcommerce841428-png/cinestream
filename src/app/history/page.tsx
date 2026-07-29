'use client';

import React from 'react';
import { History, Film, Tv, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-8 h-8 text-brand-500" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Viewing History & Watch Log</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">Track completed movies, TV episodes, and recently visited media pages.</p>
        </div>
      </div>

      <div className="text-center py-20 bg-gray-900/40 rounded-3xl border border-gray-800 space-y-3">
        <History className="w-12 h-12 text-gray-600 mx-auto" />
        <h2 className="text-lg font-bold text-white">Your Viewing History is Clean</h2>
        <p className="text-xs text-gray-400 max-w-sm mx-auto">Titles and episodes you browse will automatically be logged in your personal viewing history.</p>
        <Link href="/movies" className="inline-block mt-2 text-xs font-semibold text-brand-400 hover:underline">
          Explore Movies Now
        </Link>
      </div>
    </div>
  );
}
