import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getImageUrl } from '@/services/tmdb';
import { tmdbClient } from '@/services/tmdb';
import { buildMetadata, truncateDescription } from '@/lib/metadata';
import EpisodeWatchedButton from '@/components/EpisodeWatchedButton';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ tvId: string; seasonNumber: string; episodeNumber: string }>;
}

async function getEpisode(tvId: number, seasonNumber: number, episodeNumber: number) {
  try {
    const [episode, show] = await Promise.all([
      tmdbClient.getTVEpisodeDetailsDeep(tvId, seasonNumber, episodeNumber),
      tmdbClient.getTVDetails(tvId).catch(() => null),
    ]);
    return { episode, show };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tvId, seasonNumber, episodeNumber } = await params;
  const data = await getEpisode(parseInt(tvId, 10), parseInt(seasonNumber, 10), parseInt(episodeNumber, 10));
  if (!data?.episode) return { title: 'Episode Not Found', robots: { index: false, follow: false } };

  return buildMetadata({
    title: `S${seasonNumber}E${episodeNumber} — ${data.episode.name}`,
    description: truncateDescription(data.episode.overview || `Episode ${episodeNumber} of season ${seasonNumber}.`),
    path: `/episode/${tvId}/${seasonNumber}/${episodeNumber}`,
    image: data.episode.still_path ? getImageUrl(data.episode.still_path, 'w780') : null,
  });
}

export default async function EpisodePage({ params }: PageProps) {
  const { tvId, seasonNumber, episodeNumber } = await params;
  const tvIdNum = parseInt(tvId, 10);
  const seasonNum = parseInt(seasonNumber, 10);
  const epNum = parseInt(episodeNumber, 10);
  const data = await getEpisode(tvIdNum, seasonNum, epNum);

  if (!data?.episode) {
    notFound();
  }

  const { episode, show } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="space-y-4">
        <Link href={`/season/${tvIdNum}/${seasonNum}`} className="text-xs font-semibold text-purple-400 hover:underline">
          ← Back to Season {seasonNum}
        </Link>
        <div className="relative aspect-video w-full max-h-[450px] rounded-3xl overflow-hidden bg-gray-950 border border-gray-800 shadow-2xl">
          {episode.still_path ? (
            <Image src={getImageUrl(episode.still_path, 'w780')} alt={episode.name} fill priority className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">No Episode Still</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
              Season {seasonNum} • Episode {epNum}
            </span>
            <h1 className="text-3xl font-extrabold text-white">{episode.name}</h1>
          </div>
        </div>
      </div>

      <div className="space-y-4 bg-gray-900/80 p-6 rounded-2xl border border-gray-800">
        <h2 className="text-lg font-bold text-white">Overview</h2>
        <p className="text-sm text-gray-300 leading-relaxed">{episode.overview || 'No overview available.'}</p>
        <div className="flex flex-wrap gap-4 text-xs text-gray-400 pt-2 border-t border-gray-800">
          {episode.air_date && <span>Air Date: {episode.air_date}</span>}
          {episode.runtime > 0 && <span>Runtime: {episode.runtime} mins</span>}
          {episode.vote_average > 0 && <span>Rating: ⭐ {episode.vote_average.toFixed(1)}</span>}
        </div>
        <div className="pt-2">
          <EpisodeWatchedButton
            episode={{
              tvId: tvIdNum,
              showTitle: show?.name || `TV Show ${tvIdNum}`,
              poster_path: show?.poster_path ?? null,
              seasonNumber: seasonNum,
              episodeNumber: epNum,
              episodeName: episode.name,
              episodeRuntime: episode.runtime || undefined,
            }}
          />
        </div>
      </div>

      {episode.credits?.guest_stars?.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Guest Stars</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {episode.credits.guest_stars.slice(0, 12).map((person: any) => (
              <Link
                key={person.id}
                href={`/person/${person.id}`}
                className="bg-gray-900/60 rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition p-3"
              >
                <p className="text-xs font-bold text-white line-clamp-1">{person.name}</p>
                <p className="text-[11px] text-gray-400 line-clamp-1">{person.character}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
