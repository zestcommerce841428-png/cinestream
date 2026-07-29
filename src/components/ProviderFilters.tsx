'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface ProviderFiltersProps {
  mediaType: 'movie' | 'tv';
  region: string;
  regionsList: { iso_3166_1: string; english_name: string }[];
}

export default function ProviderFilters({ mediaType, region, regionsList }: ProviderFiltersProps) {
  const router = useRouter();

  const navigate = (patch: Partial<{ type: string; region: string }>) => {
    const next = { type: mediaType, region, ...patch };
    const params = new URLSearchParams();
    if (next.type !== 'movie') params.set('type', next.type);
    if (next.region !== 'US') params.set('region', next.region);
    router.push(`/providers${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="flex items-center space-x-3 bg-gray-900/90 p-2 rounded-2xl border border-gray-800 self-start sm:self-auto">
      <select
        value={mediaType}
        onChange={(e) => navigate({ type: e.target.value })}
        className="bg-gray-950 text-xs font-semibold text-white p-2 rounded-xl border border-gray-800 focus:outline-none"
      >
        <option value="movie">Movies</option>
        <option value="tv">TV Shows</option>
      </select>

      <select
        value={region}
        onChange={(e) => navigate({ region: e.target.value })}
        className="bg-gray-950 text-xs font-semibold text-white p-2 rounded-xl border border-gray-800 focus:outline-none"
      >
        {regionsList.map((r) => (
          <option key={r.iso_3166_1} value={r.iso_3166_1}>
            {r.english_name} ({r.iso_3166_1})
          </option>
        ))}
      </select>
    </div>
  );
}
