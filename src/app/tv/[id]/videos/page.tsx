import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Play, ArrowLeft } from 'lucide-react';
import { tmdbClient, Video } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getData(id: number) {
  try {
    const [tv, videos] = await Promise.all([tmdbClient.getTVDetails(id), tmdbClient.getTVVideos(id)]);
    return { tv, videos: videos.results || [] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) return { title: 'TV Show Not Found', robots: { index: false, follow: false } };
  return buildMetadata({
    title: `Videos — ${data.tv.name}`,
    description: `Trailers, teasers, and featurettes for ${data.tv.name}.`,
    path: `/tv/${id}/videos`,
  });
}

export default async function TVVideosPage({ params }: PageProps) {
  const { id } = await params;
  const tvId = parseInt(id, 10);
  const data = await getData(tvId);

  if (!data) {
    notFound();
  }

  const { tv, videos } = data as { tv: any; videos: Video[] };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/tv/${tvId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Series Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Play className="w-8 h-8 text-rose-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Trailers, Teasers & Featurettes — {tv.name}</h1>
        </div>
      </div>

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((vid) => (
            <div key={vid.id} className="bg-gray-900/80 rounded-2xl overflow-hidden border border-gray-800 space-y-3 p-4">
              <div className="aspect-video relative rounded-xl overflow-hidden bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${vid.key}`}
                  title={vid.name}
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">{vid.type}</span>
                <h3 className="font-bold text-sm text-white">{vid.name}</h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No videos available.</p>
      )}
    </div>
  );
}
