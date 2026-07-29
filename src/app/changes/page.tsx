import type { Metadata } from 'next';
import Link from 'next/link';
import { Database } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

const MEDIA_TYPES = [
  { key: 'movie', label: 'Movies' },
  { key: 'tv', label: 'TV Series' },
  { key: 'person', label: 'People' },
] as const;

type MediaTypeKey = (typeof MEDIA_TYPES)[number]['key'];

function resolveMediaType(raw?: string): MediaTypeKey {
  return (MEDIA_TYPES.find((m) => m.key === raw)?.key || 'movie') as MediaTypeKey;
}

interface ChangesPageProps {
  searchParams: Promise<{ type?: string }>;
}

export async function generateMetadata({ searchParams }: ChangesPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const mediaType = resolveMediaType(sp.type);
  const label = MEDIA_TYPES.find((m) => m.key === mediaType)!.label;
  return buildMetadata({
    title: `${label} Database Changes Log`,
    description: `Live feed of recently modified TMDB ${label.toLowerCase()} entries — track metadata edits and database updates.`,
    path: mediaType === 'movie' ? '/changes' : `/changes?type=${mediaType}`,
  });
}

export default async function ChangesLogPage({ searchParams }: ChangesPageProps) {
  const sp = await searchParams;
  const mediaType = resolveMediaType(sp.type);

  const res = await tmdbClient.getMediaChangesFeed(mediaType);
  const changes: Array<{ id: number; adult?: boolean }> = res.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-8 h-8 text-brand-500" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">TMDB Database Changes Log</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">Live updates, metadata edits, and recent database modification logs.</p>
        </div>

        <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-800 self-start sm:self-auto">
          {MEDIA_TYPES.map((m) => (
            <Link
              key={m.key}
              href={`/changes?type=${m.key}`}
              className={`px-4 py-2 rounded-xl text-xs font-semibold ${mediaType === m.key ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {m.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {changes.slice(0, 25).map((item) => (
          <div key={item.id} className="bg-gray-900/60 px-4 py-3 rounded-xl border border-gray-800/80 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white font-bold">{mediaType.toUpperCase()} #{item.id}</span>
            </div>
            <span className="text-gray-400 text-[11px]">Adult Flag: {item.adult ? 'True' : 'False'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
