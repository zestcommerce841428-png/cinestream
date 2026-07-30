import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Layers } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Sequel Tracker — Upcoming Franchise Movies',
  description: 'Upcoming movies that are part of an existing collection or franchise, surfaced from TMDB collection data.',
  path: '/sequel-tracker',
});

interface SequelMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  collectionName: string;
}

async function getSequels(): Promise<SequelMovie[]> {
  const today = new Date().toISOString().split('T')[0];
  // Discover list results don't include `belongs_to_collection` — only full movie
  // details do — so a candidate pool of upcoming titles has to be fetched individually
  // to find out which ones are actually sequels/franchise entries.
  const res = await tmdbClient.discoverMovies({
    'primary_release_date.gte': today,
    sort_by: 'popularity.desc',
  });
  const candidates = (res.results || []).slice(0, 20);
  const details = await Promise.all(candidates.map((m) => tmdbClient.getMovieDetails(m.id).catch(() => null)));

  return details
    .filter((d): d is NonNullable<typeof d> & { belongs_to_collection: { name: string } } => !!d?.belongs_to_collection)
    .map((d) => ({
      id: d.id,
      title: d.title,
      poster_path: d.poster_path,
      release_date: d.release_date,
      collectionName: d.belongs_to_collection.name,
    }));
}

export default async function SequelTrackerPage() {
  const sequels = await getSequels();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Layers className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Sequel Tracker</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Upcoming movies that belong to an existing collection or franchise, drawn from TMDB&apos;s most popular unreleased titles.
        </p>
      </div>

      {sequels.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {sequels.map((m) => (
            <Link key={m.id} href={`/movie/${m.id}`} className="group block">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 group-hover:border-brand-500/50 transition">
                <Image src={getImageUrl(m.poster_path, 'w342')} alt={m.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 space-y-1">
                  <p className="text-[10px] font-bold text-brand-400 uppercase tracking-wide line-clamp-1">{m.collectionName}</p>
                  <p className="text-xs font-bold text-white line-clamp-2">{m.title}</p>
                  {m.release_date && <p className="text-[10px] text-gray-400">{m.release_date}</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900/40 rounded-3xl border border-gray-800">
          <p className="text-sm text-gray-400">No upcoming franchise sequels found in the current window.</p>
        </div>
      )}
    </div>
  );
}
