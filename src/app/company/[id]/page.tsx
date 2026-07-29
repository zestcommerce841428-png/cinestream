import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Building2, MapPin, Globe, Film } from 'lucide-react';
import { tmdbClient, getImageUrl, Movie } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

interface CompanyPageProps {
  params: Promise<{ id: string }>;
}

async function getCompany(id: number) {
  try {
    const [company, moviesRes] = await Promise.all([
      tmdbClient.getCompanyDetails(id),
      tmdbClient.getCompanyMovies(id).catch(() => ({ results: [] })),
    ]);
    return { company, movies: (moviesRes.results || []) as Movie[] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getCompany(parseInt(id, 10));
  if (!data) {
    return { title: 'Company Not Found', robots: { index: false, follow: false } };
  }
  return buildMetadata({
    title: data.company.name,
    description: `${data.company.name} — production credits, filmography, and studio profile on CineStream.`,
    path: `/company/${data.company.id}`,
    image: data.company.logo_path ? getImageUrl(data.company.logo_path, 'w300') : null,
  });
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { id } = await params;
  const data = await getCompany(parseInt(id, 10));

  if (!data) {
    notFound();
  }

  const { company, movies } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Profile Header */}
      <div className="bg-gray-900/80 p-8 rounded-3xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-24 h-24 bg-white p-4 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
            {company.logo_path ? (
              <Image src={getImageUrl(company.logo_path, 'w300')} alt={company.name} width={80} height={80} className="object-contain max-h-16" />
            ) : (
              <Building2 className="w-10 h-10 text-gray-800" />
            )}
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-3xl font-extrabold text-white">{company.name}</h1>
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 text-xs text-gray-400 font-medium pt-1">
              {company.headquarters && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>{company.headquarters}</span>
                </div>
              )}
              {company.origin_country && (
                <span className="px-2.5 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-300 font-bold uppercase">
                  {company.origin_country}
                </span>
              )}
            </div>
          </div>
        </div>

        {company.homepage && (
          <a
            href={company.homepage}
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-white border border-gray-700 transition"
          >
            <Globe className="w-4 h-4 text-brand-400" />
            <span>Official Website</span>
          </a>
        )}
      </div>

      {/* Produced Media */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Film className="w-6 h-6 text-brand-500" />
          <span>Produced Movies ({movies.length})</span>
        </h2>

        {movies.length > 0 ? (
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
        ) : (
          <p className="text-sm text-gray-400">No movies found for this studio.</p>
        )}
      </div>
    </div>
  );
}
