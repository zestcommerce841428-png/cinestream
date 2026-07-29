'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tag, Search } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';

export default function KeywordsDirectoryPage() {
  const [query, setQuery] = useState('hero');
  const [keywords, setKeywords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const presets = ['hero', 'space', 'robot', 'magic', 'superhero', 'zombie', 'time travel', 'alien', 'anime', 'spy'];

  useEffect(() => {
    async function loadKeywords() {
      if (!query.trim()) return;
      setLoading(true);
      try {
        const res = await tmdbClient.searchKeywordsList(query);
        setKeywords(res.results || []);
      } catch (e) {
        console.error('Failed loading keywords', e);
      } finally {
        setLoading(false);
      }
    }
    loadKeywords();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Tag className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Movie Keywords & Plot Tropes Index</h1>
        </div>
        <p className="text-gray-400 text-sm">Browse thousands of plot keywords, tropes, and thematic tags.</p>

        <div className="flex flex-wrap gap-2 pt-2">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => setQuery(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                query === p ? 'bg-brand-600 text-white border-brand-500' : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              #{p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {keywords.map((k) => (
          <Link
            key={k.id}
            href={`/keyword/${k.id}`}
            className="bg-gray-900/80 p-3 rounded-xl border border-gray-800 hover:border-brand-500 text-xs font-semibold text-gray-200 hover:text-white transition flex items-center justify-between"
          >
            <span className="truncate">#{k.name}</span>
            <Tag className="w-3.5 h-3.5 text-brand-400 flex-shrink-0 ml-1" />
          </Link>
        ))}
      </div>
    </div>
  );
}
