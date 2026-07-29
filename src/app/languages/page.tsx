import type { Metadata } from 'next';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

const TOP_LANGUAGES = [
  { code: 'ja', name: 'Japanese (Anime & Cinema)' },
  { code: 'es', name: 'Spanish Cinema' },
  { code: 'fr', name: 'French Cinema' },
  { code: 'ko', name: 'Korean (K-Drama & Film)' },
  { code: 'hi', name: 'Hindi (Bollywood)' },
  { code: 'de', name: 'German Cinema' },
  { code: 'it', name: 'Italian Classics' },
  { code: 'zh', name: 'Chinese & Martial Arts' },
] as const;

interface LanguagesPageProps {
  searchParams: Promise<{ lang?: string }>;
}

function resolveLang(raw?: string): string {
  return TOP_LANGUAGES.some((l) => l.code === raw) ? (raw as string) : 'ja';
}

export async function generateMetadata({ searchParams }: LanguagesPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const code = resolveLang(sp.lang);
  const label = TOP_LANGUAGES.find((l) => l.code === code)!.name;
  return buildMetadata({
    title: `${label} — Global International Cinema`,
    description: `Browse movies filtered to ${label}, part of a world-cinema directory categorized by original language.`,
    path: code === 'ja' ? '/languages' : `/languages?lang=${code}`,
  });
}

export default async function LanguagesPage({ searchParams }: LanguagesPageProps) {
  const sp = await searchParams;
  const selectedLang = resolveLang(sp.lang);

  const res = await tmdbClient.getMoviesByLanguage(selectedLang);
  const movies = res.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Globe className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Global International Cinema</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Discover world cinema categorized by original language.</p>

        {/* Preset Chips */}
        <div className="flex flex-wrap gap-2 pt-4">
          {TOP_LANGUAGES.map((lang) => (
            <Link
              key={lang.code}
              href={`/languages?lang=${lang.code}`}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                selectedLang === lang.code ? 'bg-brand-600 text-white border-brand-500 shadow-md' : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {lang.name}
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
