import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Layers, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getData(id: number) {
  try {
    const [tv, groups] = await Promise.all([tmdbClient.getTVDetails(id), tmdbClient.getTVEpisodeGroups(id)]);
    return { tv, groups: groups.results || [] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) return { title: 'TV Show Not Found', robots: { index: false, follow: false } };
  return buildMetadata({
    title: `Episode Groups — ${data.tv.name}`,
    description: `Custom and chronological episode groupings for ${data.tv.name}, including specials and alternate viewing orders.`,
    path: `/tv/${id}/episode-groups`,
  });
}

export default async function TVEpisodeGroupsPage({ params }: PageProps) {
  const { id } = await params;
  const tvId = parseInt(id, 10);
  const data = await getData(tvId);

  if (!data) {
    notFound();
  }

  const { tv, groups } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/tv/${tvId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Series Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Layers className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Episode Groups & Chronological Order — {tv.name}</h1>
        </div>
      </div>

      {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((grp: any) => (
            <div key={grp.id} className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 space-y-2">
              <span className="font-bold text-xs text-brand-400 uppercase">{grp.network?.name || 'Production Group'}</span>
              <h3 className="font-extrabold text-base text-white">{grp.name}</h3>
              <p className="text-xs text-gray-400">{grp.episode_count} Episodes in Group</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No custom episode groups available.</p>
      )}
    </div>
  );
}
