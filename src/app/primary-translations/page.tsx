'use client';

import React, { useEffect, useState } from 'react';
import { Languages, Globe } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';

export default function PrimaryTranslationsPage() {
  const [translations, setTranslations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTranslations() {
      setLoading(true);
      try {
        const res = await tmdbClient.getPrimaryTranslations();
        setTranslations(res || []);
      } catch (e) {
        console.error('Failed loading primary translations', e);
      } finally {
        setLoading(false);
      }
    }
    loadTranslations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Languages className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Primary Translation Languages Directory ({translations.length})</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Official primary localization languages and ISO locale codes.</p>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading primary translations...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {translations.map((t, idx) => (
            <div key={idx} className="bg-gray-900/60 p-3.5 rounded-xl border border-gray-800 text-center">
              <span className="text-xs font-mono font-bold text-brand-400">{t}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
