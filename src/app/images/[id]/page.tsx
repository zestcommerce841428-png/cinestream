import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { tmdbClient } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';
import GalleryTabs from './GalleryTabs';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getData(id: number) {
  try {
    const [movie, imagesData] = await Promise.all([tmdbClient.getMovieDetails(id), tmdbClient.getMovieImages(id)]);
    return { movie, imagesData };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) return { title: 'Movie Not Found', robots: { index: false, follow: false } };
  return buildMetadata({
    title: `Media Gallery — ${data.movie.title}`,
    description: `High-resolution backdrops, posters, and logos for ${data.movie.title}.`,
    path: `/images/${id}`,
  });
}

export default async function ImagesPage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  const data = await getData(movieId);

  if (!data) {
    notFound();
  }

  const { movie, imagesData } = data;
  const backdrops = imagesData?.backdrops || [];
  const posters = imagesData?.posters || [];
  const logos = imagesData?.logos || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <GalleryTabs movieId={movieId} movieTitle={movie.title} backdrops={backdrops} posters={posters} logos={logos} />
    </div>
  );
}
