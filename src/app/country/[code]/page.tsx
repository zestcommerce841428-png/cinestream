import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Globe } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ code: string }>;
}

async function getCountryData(code: string) {
  const [countries, moviesRes] = await Promise.all([
    tmdbClient.getCountries(),
    tmdbClient.getMoviesByCountry(code, 1),
  ]);
  const country = (countries || []).find((c: { iso_3166_1: string; english_name: string }) => c.iso_3166_1 === code.toUpperCase());
  if (!country) return null;
  return { country, movies: moviesRes.results || [] };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const data = await getCountryData(code);
  if (!data) return { title: 'Country Not Found', robots: { index: false, follow: false } };

  return buildMetadata({
    title: `${data.country.english_name} Cinema`,
    description: `Discover movies produced in ${data.country.english_name}, ranked by popularity.`,
    path: `/country/${code.toUpperCase()}`,
  });
}

export default async function CountryPage({ params }: PageProps) {
  const { code } = await params;
  const data = await getCountryData(code);

  if (!data) {
    notFound();
  }

  const { country, movies } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Globe className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{country.english_name} Cinema</h1>
          <span className="text-[10px] font-mono uppercase bg-gray-900 px-2 py-1 rounded text-brand-400 border border-gray-800">
            {country.iso_3166_1}
          </span>
        </div>
        <p className="text-gray-400 text-sm mt-1">Movies produced in {country.english_name}, ranked by popularity.</p>
      </div>

      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((m) => (
            <MovieCard key={m.id} id={m.id} title={m.title} posterPath={m.poster_path} voteAverage={m.vote_average} releaseDate={m.release_date} mediaType="movie" />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900/40 rounded-3xl border border-gray-800">
          <p className="text-sm text-gray-400">No titles found for {country.english_name} yet.</p>
        </div>
      )}
    </div>
  );
}
