'use client';

import React, { useMemo, useState } from 'react';
import { Terminal, Search, AlertTriangle } from 'lucide-react';
import EndpointCard from '@/components/EndpointCard';
import { endpoints } from '@/lib/endpoints';
import { TMDB_EXPLORER_KEY } from '@/services/tmdb';

export default function APIExplorerCatalogPage() {
  const hasExplorerKey = Boolean(TMDB_EXPLORER_KEY);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => ['All', ...Array.from(new Set(endpoints.map((e) => e.category)))], []);

  const filteredEndpoints = endpoints.filter((e) => {
    const matchesCat = selectedCategory === 'All' || e.category === selectedCategory;
    const matchesQuery = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.path.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Catalog Header */}
      <div className="border-b border-gray-800 pb-6 space-y-2">
        <div className="flex items-center space-x-2">
          <Terminal className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">TMDB API Endpoints Explorer Catalog</h1>
        </div>
        <p className="text-gray-400 text-sm">
          {endpoints.length} curated TMDB endpoints, each with its own dedicated runner page with parameter controls,
          latency timer, status inspector, and code generators.
        </p>
        {!hasExplorerKey && (
          <div className="flex items-start space-x-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl mt-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200 leading-relaxed">
              Live requests are disabled until <code className="font-mono bg-gray-950 px-1.5 py-0.5 rounded">NEXT_PUBLIC_TMDB_EXPLORER_KEY</code> is
              set in <code className="font-mono bg-gray-950 px-1.5 py-0.5 rounded">.env.local</code>. You can still browse
              every endpoint and copy code snippets.
            </p>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-800 overflow-x-auto w-full md:w-auto gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat ? 'bg-brand-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search endpoints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-brand-500 outline-none"
          />
        </div>
      </div>

      {/* Endpoints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEndpoints.map((ep) => (
          <EndpointCard
            key={ep.key}
            keyId={ep.key}
            name={ep.name}
            path={ep.path}
            category={ep.category}
            description={ep.description}
          />
        ))}
      </div>
    </div>
  );
}
