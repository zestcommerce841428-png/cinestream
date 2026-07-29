import type { Metadata } from 'next';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

const TOP_COUNTRIES = [
  { code: 'US', name: 'United States 🇺🇸', label: 'the United States' },
  { code: 'GB', name: 'United Kingdom 🇬🇧', label: 'the United Kingdom' },
  { code: 'FR', name: 'France 🇫🇷', label: 'France' },
  { code: 'JP', name: 'Japan 🇯🇵', label: 'Japan' },
  { code: 'KR', name: 'South Korea 🇰🇷', label: 'South Korea' },
  { code: 'IN', name: 'India 🇮🇳', label: 'India' },
  { code: 'DE', name: 'Germany 🇩🇪', label: 'Germany' },
  { code: 'IT', name: 'Italy 🇮🇹', label: 'Italy' },
  { code: 'CA', name: 'Canada 🇨🇦', label: 'Canada' },
  { code: 'ES', name: 'Spain 🇪🇸', label: 'Spain' },
] as const;

function resolveCountry(raw?: string) {
  return TOP_COUNTRIES.find((c) => c.code === raw) || TOP_COUNTRIES[0];
}

interface CountriesPageProps {
  searchParams: Promise<{ country?: string }>;
}

export async function generateMetadata({ searchParams }: CountriesPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const country = resolveCountry(sp.country);
  return buildMetadata({
    title: `Cinema from ${country.label}`,
    description: `Explore movies produced in ${country.label}, browsable by country of origin on CineStream.`,
    path: country.code === 'US' ? '/countries' : `/countries?country=${country.code}`,
  });
}

export default async function CountriesPage({ searchParams }: CountriesPageProps) {
  const sp = await searchParams;
  const country = resolveCountry(sp.country);

  const res = await tmdbClient.getMoviesByCountry(country.code);
  const movies = res.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Globe className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Global Cinema by Country</h1>
        </div>
        <p className="text-gray-400 text-sm">Explore cinema production outputs by country of origin.</p>

        <div className="flex flex-wrap gap-2 pt-2">
          {TOP_COUNTRIES.map((c) => (
            <Link
              key={c.code}
              href={`/countries?country=${c.code}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                country.code === c.code
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {c.name}
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
