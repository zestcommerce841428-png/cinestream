import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { User, Calendar, MapPin, Film } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { buildMetadata, truncateDescription } from '@/lib/metadata';
import { jsonLdScriptProps, personJsonLd, breadcrumbJsonLd } from '@/lib/jsonld';
import { getPreferredLanguage } from '@/lib/i18n-server';

// No `revalidate` export: reading the language cookie makes this route inherently
// per-request (see src/lib/i18n-server.ts) — a static ISR interval would be misleading.

interface PersonPageProps {
  params: Promise<{ id: string }>;
}

async function getPerson(id: number) {
  try {
    const language = await getPreferredLanguage();
    const [person, creditsRes] = await Promise.all([
      tmdbClient.getPersonDetails(id, language),
      tmdbClient.getPersonCombinedCredits(id, language).catch(() => ({ cast: [] })),
    ]);
    return { person, credits: (creditsRes.cast || []) as any[] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PersonPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getPerson(parseInt(id, 10));
  if (!data) {
    return { title: 'Person Not Found', robots: { index: false, follow: false } };
  }

  return buildMetadata({
    title: data.person.name,
    description: truncateDescription(
      data.person.biography || `${data.person.name} — filmography, known-for credits, and biography on CineStream.`
    ),
    path: `/person/${data.person.id}`,
    // No `image` here: this route has an opengraph-image.tsx that generates a dynamic
    // profile card, and Next.js wires that up as the OG/Twitter image automatically.
    type: 'profile',
  });
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params;
  const personId = parseInt(id, 10);
  const data = await getPerson(personId);

  if (!data) {
    notFound();
  }

  const { person, credits } = data;
  const knownFor = [...credits]
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 15);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(personJsonLd(person))} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScriptProps(
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Popular People', path: '/popular-people' },
            { name: person.name, path: `/person/${person.id}` },
          ])
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Profile Image */}
        <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 shadow-xl">
          {person.profile_path ? (
            <Image
              src={getImageUrl(person.profile_path, 'w500')}
              alt={person.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
          )}
        </div>

        {/* Bio */}
        <div className="md:col-span-3 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{person.name}</h1>

          <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-medium">
            {person.birthday && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-brand-500" />
                <span>Born: {person.birthday}</span>
              </div>
            )}
            {person.place_of_birth && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>{person.place_of_birth}</span>
              </div>
            )}
            {person.known_for_department && (
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4 text-purple-500" />
                <span>Department: {person.known_for_department}</span>
              </div>
            )}
          </div>

          {person.biography && (
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Biography</h3>
              <p className="text-sm text-gray-300 leading-relaxed max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {person.biography}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Known For / Filmography */}
      {knownFor.length > 0 && (
        <div className="space-y-4 border-t border-gray-800 pt-8">
          <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Film className="w-6 h-6 text-brand-500" />
            <span>Known For & Filmography ({credits.length})</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {knownFor.map((item) => (
              <MovieCard
                key={`${item.media_type}-${item.id}`}
                id={item.id}
                title={item.title || item.name}
                posterPath={item.poster_path}
                voteAverage={item.vote_average}
                releaseDate={item.release_date || item.first_air_date}
                mediaType={item.media_type === 'tv' ? 'tv' : 'movie'}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
