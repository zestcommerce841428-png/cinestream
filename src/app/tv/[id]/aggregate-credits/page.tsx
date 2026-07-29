import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { User, ArrowLeft } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getData(id: number) {
  try {
    const [tv, credits] = await Promise.all([tmdbClient.getTVDetails(id), tmdbClient.getTVAggregateCredits(id)]);
    return { tv, credits: credits.cast || [] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) return { title: 'TV Show Not Found', robots: { index: false, follow: false } };
  return buildMetadata({
    title: `Full Aggregate Cast — ${data.tv.name}`,
    description: `Complete series-wide cast list with total episode counts for every actor across all seasons of ${data.tv.name}.`,
    path: `/tv/${id}/aggregate-credits`,
  });
}

export default async function TVAggregateCreditsPage({ params }: PageProps) {
  const { id } = await params;
  const tvId = parseInt(id, 10);
  const data = await getData(tvId);

  if (!data) {
    notFound();
  }

  const { tv, credits } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/tv/${tvId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Series Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <User className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Full Series Aggregate Cast — {tv.name}</h1>
        </div>
      </div>

      {credits.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {credits.map((actor: any) => (
            <Link
              key={actor.id}
              href={`/person/${actor.id}`}
              className="group bg-gray-900/80 rounded-2xl overflow-hidden border border-gray-800 hover:border-brand-500/50 transition-all space-y-3 p-3"
            >
              <div className="aspect-[3/4] relative rounded-xl overflow-hidden bg-gray-950">
                {actor.profile_path ? (
                  <Image src={getImageUrl(actor.profile_path, 'w185')} alt={actor.name} fill className="object-cover group-hover:scale-105 transition" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-xs text-white group-hover:text-brand-300 line-clamp-1">{actor.name}</h3>
                <p className="text-[11px] text-gray-400 line-clamp-1">{actor.total_episode_count} Episodes</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No cast information available.</p>
      )}
    </div>
  );
}
