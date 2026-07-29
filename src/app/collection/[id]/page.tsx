import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Layers, Film } from 'lucide-react';
import { tmdbClient, getBackdropUrl, getImageUrl, Movie } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata, truncateDescription } from '@/lib/metadata';

export const revalidate = 3600;

interface CollectionPageProps {
  params: Promise<{ id: string }>;
}

async function getCollection(id: number) {
  try {
    return await tmdbClient.getCollectionDetails(id);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { id } = await params;
  const collection = await getCollection(parseInt(id, 10));
  if (!collection) {
    return { title: 'Collection Not Found', robots: { index: false, follow: false } };
  }
  return buildMetadata({
    title: collection.name,
    description: truncateDescription(collection.overview || `${collection.name} — full movie franchise collection on CineStream.`),
    path: `/collection/${collection.id}`,
    image: collection.poster_path ? getImageUrl(collection.poster_path, 'w780') : collection.backdrop_path ? getBackdropUrl(collection.backdrop_path, 'w1280') : null,
  });
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { id } = await params;
  const collection = await getCollection(parseInt(id, 10));

  if (!collection) {
    notFound();
  }

  const parts: Movie[] = (collection.parts || []).slice().sort((a: any, b: any) => {
    const da = a.release_date ? new Date(a.release_date).getTime() : 0;
    const db = b.release_date ? new Date(b.release_date).getTime() : 0;
    return da - db;
  });

  return (
    <div className="space-y-12">
      {/* Header Backdrop */}
      <div className="relative w-full min-h-[450px] overflow-hidden flex items-end">
        <div className="absolute inset-0 bg-gray-950">
          {collection.backdrop_path && (
            <Image
              src={getBackdropUrl(collection.backdrop_path, 'original')}
              alt={collection.name}
              fill
              priority
              className="object-cover opacity-30 scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full z-10 flex flex-col md:flex-row items-end gap-8">
          <div className="hidden md:block relative aspect-[2/3] w-48 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex-shrink-0">
            {collection.poster_path ? (
              <Image src={getImageUrl(collection.poster_path, 'w500')} alt={collection.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-500">No Image</div>
            )}
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 bg-brand-600/20 border border-brand-500/30 px-3 py-1 rounded-full text-xs font-semibold text-brand-400">
              <Layers className="w-4 h-4" />
              <span>Movie Franchise Collection ({parts.length} Movies)</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">{collection.name}</h1>
            <p className="text-sm sm:text-base text-gray-300 max-w-3xl leading-relaxed">{collection.overview}</p>
          </div>
        </div>
      </div>

      {/* Movies List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Film className="w-6 h-6 text-brand-500" />
          <span>Franchise Titles (Chronological Order)</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {parts.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              voteAverage={movie.vote_average}
              releaseDate={movie.release_date}
              mediaType="movie"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
