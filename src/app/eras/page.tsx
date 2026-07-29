import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

const ERAS = [
  { start: 1920, end: 1939, label: 'Golden Age Silent & Early Talkies (1920s-30s)' },
  { start: 1940, end: 1959, label: 'Classic Hollywood & Noir (1940s-50s)' },
  { start: 1960, end: 1979, label: 'New Hollywood Revolution (1960s-70s)' },
  { start: 1980, end: 1999, label: '80s Blockbusters & 90s Indies (1980s-90s)' },
  { start: 2000, end: 2019, label: 'CGI & Franchise Universe Era (2000s-10s)' },
] as const;

function resolveEra(raw?: string) {
  return ERAS.find((e) => e.start.toString() === raw) || ERAS[2];
}

interface ErasPageProps {
  searchParams: Promise<{ era?: string }>;
}

export async function generateMetadata({ searchParams }: ErasPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const era = resolveEra(sp.era);
  return buildMetadata({
    title: `${era.label} — Cinema Eras Timeline`,
    description: `Explore the ${era.label} of global cinema and its most-voted, defining films on CineStream.`,
    path: era.start === 1960 ? '/eras' : `/eras?era=${era.start}`,
  });
}

export default async function ErasPage({ searchParams }: ErasPageProps) {
  const sp = await searchParams;
  const era = resolveEra(sp.era);

  const res = await tmdbClient.getMoviesByDecade(era.start, era.end);
  const movies = res.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Cinematic Eras & Film History Timeline</h1>
        </div>
        <p className="text-gray-400 text-sm">Explore milestone eras of global cinema from silent film talkies to modern CGI blockbusters.</p>

        <div className="flex flex-wrap gap-2 pt-2">
          {ERAS.map((e) => (
            <Link
              key={e.start}
              href={`/eras?era=${e.start}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                era.start === e.start
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {e.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((m) => (
          <MovieCard
            key={m.id}
            id={m.id}
            title={m.title}
            posterPath={m.poster_path}
            voteAverage={m.vote_average}
            releaseDate={m.release_date}
            mediaType="movie"
          />
        ))}
      </div>
    </div>
  );
}
