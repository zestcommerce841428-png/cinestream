'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Users, ArrowRight } from 'lucide-react';
import { searchMultiAction, findConnectionAction } from '@/lib/actions';
import { getImageUrl } from '@/services/tmdb';

interface PersonPick {
  id: number;
  name: string;
  profile_path: string | null;
}

function PersonSearchBox({ label, onPick }: { label: string; onPick: (person: PersonPick) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const search = async (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    setOpen(true);
    try {
      const res = await searchMultiAction(value);
      setResults((res.results || []).filter((r: any) => r.media_type === 'person').slice(0, 6));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex-1">
      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => search(e.target.value)}
          onFocus={() => query && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search for an actor..."
          className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:border-brand-500 outline-none"
        />
      </div>
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-xs text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            results.map((r) => (
              <button
                key={r.id}
                onMouseDown={() => {
                  onPick({ id: r.id, name: r.name, profile_path: r.profile_path });
                  setQuery(r.name);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-gray-200 hover:bg-gray-800 transition"
              >
                {r.name}
              </button>
            ))
          ) : (
            <div className="p-3 text-xs text-gray-500">No people found.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SixDegreesFinder() {
  const [personA, setPersonA] = useState<PersonPick | null>(null);
  const [personB, setPersonB] = useState<PersonPick | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof findConnectionAction>> | null>(null);

  const runSearch = async () => {
    if (!personA || !personB) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await findConnectionAction(personA.id, personB.id);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/80 p-5 rounded-2xl border border-gray-800 flex flex-col sm:flex-row gap-4 items-end">
        <PersonSearchBox label="Actor 1" onPick={setPersonA} />
        <PersonSearchBox label="Actor 2" onPick={setPersonB} />
        <button
          onClick={runSearch}
          disabled={!personA || !personB || loading}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition h-[42px]"
        >
          <Users className="w-4 h-4" />
          <span>{loading ? 'Searching…' : 'Find Connection'}</span>
        </button>
      </div>

      {result && personA && personB && (
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-4">
          {result.degree === 0 && <p className="text-sm text-gray-300">That&apos;s the same person.</p>}

          {result.degree === 1 && result.via && (
            <div className="space-y-3">
              <p className="text-sm text-white font-bold">
                {personA.name} and {personB.name} appeared together directly — 1 degree of separation.
              </p>
              <div className="flex flex-wrap gap-2">
                {result.via.map((v) => (
                  <Link
                    key={`${v.mediaType}-${v.id}`}
                    href={`/${v.mediaType}/${v.id}`}
                    className="px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800 text-xs font-semibold text-brand-400 hover:text-brand-300 transition"
                  >
                    {v.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {result.degree === 2 && result.via && result.connector && (
            <div className="space-y-3">
              <p className="text-sm text-white font-bold">
                {personA.name} and {personB.name} are 2 degrees apart, connected via {result.connector.name}.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-semibold text-gray-300 px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800">
                  {personA.name}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-600" />
                <Link
                  href={`/${result.via[0].mediaType}/${result.via[0].id}`}
                  className="text-xs font-semibold text-brand-400 px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800 hover:text-brand-300 transition"
                >
                  {result.via[0].title}
                </Link>
                <ArrowRight className="w-4 h-4 text-gray-600" />
                <Link
                  href={`/person/${result.connector.id}`}
                  className="flex items-center gap-2 text-xs font-semibold text-white px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800 hover:border-brand-500/50 transition"
                >
                  <span className="relative w-5 h-5 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                    <Image src={getImageUrl(result.connector.profile_path, 'w92')} alt={result.connector.name} fill className="object-cover" />
                  </span>
                  {result.connector.name}
                </Link>
                <ArrowRight className="w-4 h-4 text-gray-600" />
                <Link
                  href={`/${result.via[1].mediaType}/${result.via[1].id}`}
                  className="text-xs font-semibold text-brand-400 px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800 hover:text-brand-300 transition"
                >
                  {result.via[1].title}
                </Link>
                <ArrowRight className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-semibold text-gray-300 px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800">
                  {personB.name}
                </span>
              </div>
            </div>
          )}

          {result.degree === null && (
            <p className="text-sm text-gray-400">
              No connection found between {personA.name} and {personB.name} within 2 degrees of separation (searched each
              actor&apos;s top 12 most popular credits). They may still be connected further out.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
