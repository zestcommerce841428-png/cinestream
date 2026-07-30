import { ImageResponse } from 'next/og';
import { tmdbClient, getImageUrl } from '@/services/tmdb';
import { OgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Movie poster, title, and rating card';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await tmdbClient.getMovieDetails(parseInt(id, 10)).catch(() => null);

  const year = movie?.release_date ? new Date(movie.release_date).getFullYear() : null;
  const runtime = movie?.runtime ? `${movie.runtime} min` : null;

  return new ImageResponse(
    (
      <OgCard
        kind="Movie"
        title={movie?.title || 'Movie Not Found'}
        subtitle={[year, runtime].filter(Boolean).join(' · ') || undefined}
        rating={movie?.vote_average}
        imageUrl={movie?.poster_path ? getImageUrl(movie.poster_path, 'w500') : null}
      />
    ),
    { ...size }
  );
}
