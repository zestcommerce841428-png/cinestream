'use client';

import React, { useEffect, useState } from 'react';
import { Globe, MapPin } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';

export default function CountriesCatalogPage() {
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCountries() {
      setLoading(true);
      try {
        const res = await tmdbClient.getCountries();
        setCountries(res || []);
      } catch (e) {
        console.error('Failed loading countries catalog', e);
      } finally {
        setLoading(false);
      }
    }
    loadCountries();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Globe className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Worldwide Film Production Countries Catalog ({countries.length})</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Full ISO-3166 territory codes and country production registry.</p>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading countries catalog...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {countries.map((c, idx) => (
            <div key={idx} className="bg-gray-900/60 p-3.5 rounded-xl border border-gray-800 flex items-center justify-between">
              <span className="font-bold text-xs text-white truncate max-w-[120px]">{c.english_name}</span>
              <span className="text-[10px] font-mono uppercase bg-gray-950 px-2 py-0.5 rounded text-brand-400 border border-gray-800">{c.iso_3166_1}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
