import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Layers } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

const PRESETS = ['Marvel', 'Star Wars', 'Harry Potter', 'Lord of the Rings', 'Fast & Furious', 'Batman', 'Spider-Man', 'Jurassic Park'];

interface CollectionsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: CollectionsPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const query = sp.q?.trim() || 'Marvel';
  return buildMetadata({
    title: 'Movie Collections & Franchises',
    description: `Browse the ${query} collection alongside other multi-part movie sagas, universe franchises, and trilogies.`,
    path: query === 'Marvel' ? '/collections' : `/collections?q=${encodeURIComponent(query)}`,
  });
}

export default async function CollectionsPage({ searchParams }: CollectionsPageProps) {
  const sp = await searchParams;
  const query = sp.q?.trim() || 'Marvel';

  const res = await tmdbClient.getPopularCollections(query);
  const collections: Array<{ id: number; name: string; poster_path: string | null }> = res.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Layers className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Movie Collections & Franchises</h1>
        </div>
        <p className="text-gray-400 text-sm">Explore multi-part movie sagas, universe franchises, and trilogies.</p>

        {/* Preset Chips */}
        <div className="flex flex-wrap gap-2 pt-2">
          {PRESETS.map((preset) => (
            <Link
              key={preset}
              href={`/collections?q=${encodeURIComponent(preset)}`}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                query === preset ? 'bg-brand-600 text-white border-brand-500' : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {preset}
            </Link>
          ))}
        </div>
      </div>

      {collections.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/collection/${col.id}`}
              className="group relative aspect-[2/3] bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-brand-500 transition-all flex flex-col justify-end p-4"
            >
              {col.poster_path ? (
                <Image src={getImageUrl(col.poster_path, 'w500')} alt={col.name} fill className="object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <div className="absolute inset-0 bg-gray-950 flex items-center justify-center text-gray-600 text-xs">No Poster</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-600/30 px-2 py-0.5 rounded border border-brand-500/30">
                  Franchise
                </span>
                <h3 className="font-extrabold text-sm text-white line-clamp-2">{col.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
          <p className="text-gray-400">No collections found for &quot;{query}&quot;.</p>
        </div>
      )}
    </div>
  );
}
