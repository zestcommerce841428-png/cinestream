import { ImageResponse } from 'next/og';
import { tmdbClient, getImageUrl } from '@/services/tmdb';
import { OgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'TV series poster, title, and rating card';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tv = await tmdbClient.getTVDetails(parseInt(id, 10)).catch(() => null);

  const year = tv?.first_air_date ? new Date(tv.first_air_date).getFullYear() : null;
  const seasons = tv?.number_of_seasons ? `${tv.number_of_seasons} Season${tv.number_of_seasons === 1 ? '' : 's'}` : null;

  return new ImageResponse(
    (
      <OgCard
        kind="TV Series"
        title={tv?.name || 'TV Show Not Found'}
        subtitle={[year, seasons].filter(Boolean).join(' · ') || undefined}
        rating={tv?.vote_average}
        imageUrl={tv?.poster_path ? getImageUrl(tv.poster_path, 'w500') : null}
      />
    ),
    { ...size }
  );
}
