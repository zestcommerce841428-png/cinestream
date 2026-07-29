import type { Metadata } from 'next';
import { Award } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Global Film Festivals & Prestigious Awards',
  description: "Discover Palme d'Or, Golden Lion, and Sundance award-winning indie and auteur masterpieces.",
  path: '/festivals',
});

const festivals = [
  { name: 'Cannes Film Festival 🇫🇷', desc: 'Palme d\'Or winners and auteur selections' },
  { name: 'Venice International Film Festival 🇮🇹', desc: 'Golden Lion recipients' },
  { name: 'Sundance Film Festival 🇺🇸', desc: 'Independent breakthrough cinema' },
  { name: 'Toronto International Film Festival (TIFF) 🇨🇦', desc: 'People\'s Choice Award champions' },
  { name: 'Berlin International Film Festival 🇩🇪', desc: 'Golden Bear winners' },
];

export default async function FestivalsPage() {
  const res = await tmdbClient.getOscarWinnerMovies();
  const movies = res.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Award className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Global Film Festivals & Prestigious Awards</h1>
        </div>
        <p className="text-gray-400 text-sm">Palme d&apos;Or, Golden Lion, and Sundance award-winning indie & auteur masterpieces.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {festivals.map((f, i) => (
            <div key={i} className="bg-gray-900/80 p-3.5 rounded-2xl border border-gray-800 space-y-1">
              <h3 className="font-bold text-xs text-amber-400">{f.name}</h3>
              <p className="text-[11px] text-gray-400 leading-normal">{f.desc}</p>
            </div>
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
