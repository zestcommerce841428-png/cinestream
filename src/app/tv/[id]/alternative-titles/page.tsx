import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Globe, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getData(id: number) {
  try {
    const [tv, alt] = await Promise.all([tmdbClient.getTVDetails(id), tmdbClient.getTVAlternativeTitles(id)]);
    return { tv, titles: alt.results || [] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) return { title: 'TV Show Not Found', robots: { index: false, follow: false } };
  return buildMetadata({
    title: `Alternative Titles — ${data.tv.name}`,
    description: `International and regional alternative titles used for ${data.tv.name} around the world.`,
    path: `/tv/${id}/alternative-titles`,
  });
}

export default async function TVAlternativeTitlesPage({ params }: PageProps) {
  const { id } = await params;
  const tvId = parseInt(id, 10);
  const data = await getData(tvId);

  if (!data) {
    notFound();
  }

  const { tv, titles } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/tv/${tvId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Series Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Globe className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">International Alternative Titles — {tv.name}</h1>
        </div>
      </div>

      {titles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {titles.map((t: any, idx: number) => (
            <div key={idx} className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
              <span className="font-bold text-xs text-white truncate max-w-[180px]">{t.title}</span>
              <span className="text-[10px] font-mono uppercase bg-gray-950 px-2 py-0.5 rounded text-brand-400 border border-gray-800">{t.iso_3166_1}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No alternative titles available.</p>
      )}
    </div>
  );
}
