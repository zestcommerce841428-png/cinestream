'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { searchMultiAction } from '@/lib/actions';

interface CompareSelectorProps {
  movie1Id: number;
  movie2Id: number;
}

function MovieSearchBox({ label, onPick }: { label: string; onPick: (id: number) => void }) {
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
      setResults((res.results || []).filter((r: any) => r.media_type === 'movie').slice(0, 6));
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
          placeholder="Search for a movie..."
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
                  onPick(r.id);
                  setQuery(r.title);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-gray-200 hover:bg-gray-800 transition flex items-center justify-between"
              >
                <span className="line-clamp-1">{r.title}</span>
                {r.release_date && <span className="text-gray-500 ml-2 flex-shrink-0">{r.release_date.slice(0, 4)}</span>}
              </button>
            ))
          ) : (
            <div className="p-3 text-xs text-gray-500">No results.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CompareSelector({ movie1Id, movie2Id }: CompareSelectorProps) {
  const router = useRouter();
  const [pending1, setPending1] = useState(movie1Id);
  const [pending2, setPending2] = useState(movie2Id);

  const applyIfReady = (id1: number, id2: number) => {
    if (id1 && id2) {
      router.push(`/compare?movie1=${id1}&movie2=${id2}`);
    }
  };

  return (
    <div className="bg-gray-900/80 p-5 rounded-2xl border border-gray-800 flex flex-col sm:flex-row gap-4">
      <MovieSearchBox
        label="Movie 1"
        onPick={(id) => {
          setPending1(id);
          applyIfReady(id, pending2);
        }}
      />
      <MovieSearchBox
        label="Movie 2"
        onPick={(id) => {
          setPending2(id);
          applyIfReady(pending1, id);
        }}
      />
    </div>
  );
}
