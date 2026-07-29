'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { Terminal, Play, Clock, Copy, Check, ArrowLeft, AlertTriangle, Layers } from 'lucide-react';
import { TMDB_EXPLORER_KEY, TMDB_BASE_URL } from '@/services/tmdb';

export default function DedicatedEndpointPage({ params }: { params: Promise<{ endpointKey: string }> }) {
  const resolvedParams = use(params);
  const endpointKey = resolvedParams.endpointKey || 'movie-popular';

  // Endpoint dictionary mapping endpoint keys to paths and metadata
  const endpointMap: Record<string, { path: string; category: string; description: string; defaultParams: Record<string, string> }> = {
    'movie-popular': { path: '/movie/popular', category: 'Movies', description: 'Get a list of movies ordered by popularity.', defaultParams: { page: '1' } },
    'movie-now-playing': { path: '/movie/now_playing', category: 'Movies', description: 'Get a list of movies currently in theaters.', defaultParams: { page: '1' } },
    'movie-top-rated': { path: '/movie/top_rated', category: 'Movies', description: 'Get a list of the highest rated movies of all time.', defaultParams: { page: '1' } },
    'movie-upcoming': { path: '/movie/upcoming', category: 'Movies', description: 'Get a list of upcoming movies in theaters.', defaultParams: { page: '1' } },
    'movie-details': { path: '/movie/550', category: 'Movies', description: 'Get top level details of Fight Club (ID 550) or any movie.', defaultParams: { append_to_response: 'credits,videos,images' } },
    'tv-popular': { path: '/tv/popular', category: 'TV Series', description: 'Get a list of TV shows ordered by popularity.', defaultParams: { page: '1' } },
    'tv-top-rated': { path: '/tv/top_rated', category: 'TV Series', description: 'Get a list of the highest rated TV shows of all time.', defaultParams: { page: '1' } },
    'tv-on-the-air': { path: '/tv/on_the_air', category: 'TV Series', description: 'Get a list of TV shows currently airing.', defaultParams: { page: '1' } },
    'tv-airing-today': { path: '/tv/airing_today', category: 'TV Series', description: 'Get a list of TV shows airing today.', defaultParams: { page: '1' } },
    'trending-all-day': { path: '/trending/all/day', category: 'Trending', description: 'Get trending movies, TV, and people for today.', defaultParams: {} },
    'trending-all-week': { path: '/trending/all/week', category: 'Trending', description: 'Get trending movies, TV, and people for this week.', defaultParams: {} },
    'search-multi': { path: '/search/multi', category: 'Search', description: 'Search movies, TV shows, and people in a single query.', defaultParams: { query: 'Batman', page: '1' } },
    'search-movie': { path: '/search/movie', category: 'Search', description: 'Search for movies by keyword title.', defaultParams: { query: 'Inception', page: '1' } },
    'search-tv': { path: '/search/tv', category: 'Search', description: 'Search for TV series by title.', defaultParams: { query: 'Breaking Bad', page: '1' } },
    'genre-movie-list': { path: '/genre/movie/list', category: 'Genres', description: 'Get the official list of movie genres.', defaultParams: {} },
    'genre-tv-list': { path: '/genre/tv/list', category: 'Genres', description: 'Get the official list of TV show genres.', defaultParams: {} },
    'configuration': { path: '/configuration', category: 'Config', description: 'Get TMDB system image base URLs and configuration sizes.', defaultParams: {} },
    'languages': { path: '/configuration/languages', category: 'Config', description: 'Get list of supported ISO 639-1 languages.', defaultParams: {} },
    'watch-providers-movie': { path: '/watch/providers/movie', category: 'Watch Providers', description: 'Get global streaming watch providers list for movies.', defaultParams: { watch_region: 'US' } },
  };

  const meta = endpointMap[endpointKey] || {
    path: `/${endpointKey.replace('-', '/')}`,
    category: 'Custom Endpoint',
    description: `Dedicated endpoint runner for ${endpointKey}.`,
    defaultParams: { page: '1' },
  };

  const [queryParams, setQueryParams] = useState<Record<string, string>>(meta.defaultParams);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [codeTab, setCodeTab] = useState<'curl' | 'fetch' | 'next' | 'python'>('curl');
  const [copied, setCopied] = useState(false);

  const hasExplorerKey = Boolean(TMDB_EXPLORER_KEY);

  const fullUrl = () => {
    const url = new URL(`${TMDB_BASE_URL}${meta.path}`);
    url.searchParams.append('api_key', TMDB_EXPLORER_KEY || '<your-tmdb-api-key>');
    Object.entries(queryParams).forEach(([k, v]) => {
      if (v) url.searchParams.append(k, v);
    });
    return url.toString();
  };

  const handleExecute = async () => {
    if (!hasExplorerKey) return;
    setLoading(true);
    const start = performance.now();
    try {
      const res = await fetch(fullUrl());
      const duration = Math.round(performance.now() - start);
      setLatency(duration);
      setStatus(res.status);
      const data = await res.json();
      setResponse(data);
    } catch (e: any) {
      setResponse({ error: e.message });
      setStatus(500);
    } finally {
      setLoading(false);
    }
  };

  const getCodeSnippet = () => {
    const url = fullUrl();
    if (codeTab === 'curl') return `curl -X GET "${url}"`;
    if (codeTab === 'fetch') return `fetch("${url}")\n  .then(res => res.json())\n  .then(data => console.log(data));`;
    if (codeTab === 'next') return `// Next.js 16.2+ App Router Server Action / Component\nconst res = await fetch("${url}", { next: { revalidate: 3600 } });\nconst data = await res.json();`;
    if (codeTab === 'python') return `import requests\n\nresponse = requests.get("${url}")\ndata = response.json()\nprint(data)`;
    return '';
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Navigation */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-6">
        <Link href="/api-explorer" className="inline-flex items-center space-x-2 text-xs font-bold text-gray-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to API Catalog</span>
        </Link>
        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 uppercase">
          {meta.category}
        </span>
      </div>

      {/* Endpoint Banner */}
      <div className="bg-gray-900/80 p-8 rounded-3xl border border-gray-800 space-y-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <span className="bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs px-3 py-1 rounded-lg border border-emerald-500/30">GET</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono">{meta.path}</h1>
        </div>
        <p className="text-xs text-gray-300">{meta.description}</p>
        <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 font-mono text-xs text-gray-400 break-all select-all">
          {fullUrl()}
        </div>

        {!hasExplorerKey && (
          <div className="flex items-start space-x-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200 leading-relaxed">
              Live requests are disabled — this playground needs its own client-side key. Set{' '}
              <code className="font-mono bg-gray-950 px-1.5 py-0.5 rounded">NEXT_PUBLIC_TMDB_EXPLORER_KEY</code> in{' '}
              <code className="font-mono bg-gray-950 px-1.5 py-0.5 rounded">.env.local</code> with a TMDB v3 API key to enable
              it. You can still copy the generated code snippets and swap in your own key.
            </p>
          </div>
        )}
      </div>

      {/* Runner Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Control Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900/80 p-6 rounded-3xl border border-gray-800 space-y-4">
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-brand-400" />
              <span>Query Parameters</span>
            </h2>

            {Object.entries(queryParams).map(([key, value]) => (
              <div key={key} className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-gray-300">{key}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setQueryParams({ ...queryParams, [key]: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-brand-500 outline-none"
                />
              </div>
            ))}

            <button
              onClick={handleExecute}
              disabled={loading || !hasExplorerKey}
              title={hasExplorerKey ? undefined : 'Set NEXT_PUBLIC_TMDB_EXPLORER_KEY in .env.local to enable live requests'}
              className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{loading ? 'Executing Request...' : hasExplorerKey ? 'Execute API Request' : 'No Explorer Key Configured'}</span>
            </button>
          </div>

          {/* Code Generators */}
          <div className="bg-gray-900/80 p-6 rounded-3xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-white uppercase tracking-wider">Code Snippet</span>
              <button onClick={copyCode} className="text-xs font-bold text-brand-400 hover:underline flex items-center space-x-1">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-800 gap-1 text-[11px] font-bold">
              {(['curl', 'fetch', 'next', 'python'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCodeTab(tab)}
                  className={`flex-1 py-1 rounded-lg uppercase ${codeTab === tab ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <pre className="p-4 bg-gray-950 rounded-xl border border-gray-800 text-[11px] font-mono text-emerald-400 overflow-x-auto">
              {getCodeSnippet()}
            </pre>
          </div>
        </div>

        {/* Right JSON Response Inspector */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-gray-900/80 p-6 rounded-3xl border border-gray-800 space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <span className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Response Output</span>
              </span>

              {status !== null && (
                <div className="flex items-center space-x-3 text-xs font-mono font-bold">
                  <span className={`px-2.5 py-1 rounded-md border ${status === 200 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>
                    HTTP {status}
                  </span>
                  {latency !== null && (
                    <span className="text-gray-400 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{latency} ms</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 bg-gray-950 rounded-2xl border border-gray-800 p-4 font-mono text-xs overflow-auto max-h-[500px]">
              {loading ? (
                <div className="flex items-center justify-center h-48 space-x-2 text-gray-400">
                  <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                  <span>Fetching TMDB payload...</span>
                </div>
              ) : response ? (
                <pre className="text-gray-200">{JSON.stringify(response, null, 2)}</pre>
              ) : (
                <span className="text-gray-500 italic">Click &ldquo;Execute API Request&rdquo; above to view live TMDB JSON response.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
