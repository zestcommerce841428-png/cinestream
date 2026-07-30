import type { Metadata } from 'next';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Worldwide Film Production Countries Catalog',
  description: 'Browse the full ISO-3166 registry of every film and TV production country and territory tracked by TMDB.',
  path: '/countries-catalog',
});

export default async function CountriesCatalogPage() {
  const countries = (await tmdbClient.getCountries()) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Globe className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Worldwide Film Production Countries Catalog ({countries.length})</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Full ISO-3166 territory codes and country production registry.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {countries.map((c: any, idx: number) => (
          <Link
            key={idx}
            href={`/country/${c.iso_3166_1}`}
            className="bg-gray-900/60 p-3.5 rounded-xl border border-gray-800 hover:border-brand-500/50 flex items-center justify-between transition"
          >
            <span className="font-bold text-xs text-white truncate max-w-[120px]">{c.english_name}</span>
            <span className="text-[10px] font-mono uppercase bg-gray-950 px-2 py-0.5 rounded text-brand-400 border border-gray-800">{c.iso_3166_1}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
