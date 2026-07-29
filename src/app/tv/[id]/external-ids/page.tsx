import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getData(id: number) {
  try {
    const [tv, ids] = await Promise.all([tmdbClient.getTVDetails(id), tmdbClient.getTVExternalIDs(id)]);
    return { tv, ids };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) return { title: 'TV Show Not Found', robots: { index: false, follow: false } };
  return buildMetadata({
    title: `External IDs — ${data.tv.name}`,
    description: `IMDb, TheTVDB, Wikidata, and social media identifiers linked to ${data.tv.name}.`,
    path: `/tv/${id}/external-ids`,
  });
}

export default async function TVExternalIDsPage({ params }: PageProps) {
  const { id } = await params;
  const tvId = parseInt(id, 10);
  const data = await getData(tvId);

  if (!data) {
    notFound();
  }

  const { tv, ids } = data;
  const hasAnyId = Boolean(ids.imdb_id || ids.tvdb_id || ids.wikidata_id || ids.facebook_id || ids.instagram_id || ids.twitter_id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/tv/${tvId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Series Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <ExternalLink className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">External Database Registries — {tv.name}</h1>
        </div>
      </div>

      {hasAnyId ? (
        <div className="bg-gray-900/80 p-8 rounded-3xl border border-gray-800 space-y-4 font-mono text-xs">
          {ids.imdb_id && (
            <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
              <span className="text-gray-400">IMDb Registry ID</span>
              <a href={`https://www.imdb.com/title/${ids.imdb_id}`} target="_blank" rel="noreferrer" className="text-amber-400 font-bold hover:underline">
                {ids.imdb_id} ↗
              </a>
            </div>
          )}
          {ids.tvdb_id && (
            <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
              <span className="text-gray-400">TheTVDB ID</span>
              <span className="text-brand-400 font-bold">{ids.tvdb_id}</span>
            </div>
          )}
          {ids.wikidata_id && (
            <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
              <span className="text-gray-400">Wikidata Registry ID</span>
              <span className="text-brand-400 font-bold">{ids.wikidata_id}</span>
            </div>
          )}
          {ids.facebook_id && (
            <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
              <span className="text-gray-400">Facebook Handle</span>
              <span className="text-blue-400 font-bold">{ids.facebook_id}</span>
            </div>
          )}
          {ids.instagram_id && (
            <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
              <span className="text-gray-400">Instagram Handle</span>
              <span className="text-rose-400 font-bold">{ids.instagram_id}</span>
            </div>
          )}
          {ids.twitter_id && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Twitter / X Handle</span>
              <span className="text-sky-400 font-bold">{ids.twitter_id}</span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No external database IDs available.</p>
      )}
    </div>
  );
}
