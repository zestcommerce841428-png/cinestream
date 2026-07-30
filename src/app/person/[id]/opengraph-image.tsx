import { ImageResponse } from 'next/og';
import { tmdbClient, getImageUrl } from '@/services/tmdb';
import { OgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Cast/crew profile card';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = await tmdbClient.getPersonDetails(parseInt(id, 10)).catch(() => null);

  return new ImageResponse(
    (
      <OgCard
        kind="Cast & Crew"
        title={person?.name || 'Person Not Found'}
        subtitle={person?.known_for_department || undefined}
        meta={person?.place_of_birth || undefined}
        imageUrl={person?.profile_path ? getImageUrl(person.profile_path, 'w500') : null}
        imageShape="circle"
      />
    ),
    { ...size }
  );
}
