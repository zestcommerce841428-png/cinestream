import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, Clock, Calendar, Share2, Film, Sparkles, MessageSquare, Tv, Languages, ExternalLink, History } from 'lucide-react';
import { tmdbClient, getImageUrl, getBackdropUrl } from '@/services/tmdb';
import { getCrossSourceRatings } from '@/services/omdb';
import { buildMetadata, truncateDescription } from '@/lib/metadata';
import { jsonLdScriptProps, movieJsonLd, breadcrumbJsonLd } from '@/lib/jsonld';
import { getPreferredLanguage } from '@/lib/i18n-server';
import WatchlistButton from '@/components/WatchlistButton';
import CrossSourceRatings from '@/components/CrossSourceRatings';

// No `revalidate` export: reading the language cookie makes this route inherently
// per-request (see src/lib/i18n-server.ts) — a static ISR interval would be misleading.

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

async function getMovie(id: number) {
  try {
    const language = await getPreferredLanguage();
    const movie = await tmdbClient.getMovieDetailsDeep(id, language);
    const crossSourceRatings = await getCrossSourceRatings(movie.imdb_id);
    return { ...movie, crossSourceRatings };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovie(parseInt(id, 10));
  if (!movie) {
    return { title: 'Movie Not Found', robots: { index: false, follow: false } };
  }

  const year = movie.release_date ? ` (${new Date(movie.release_date).getFullYear()})` : '';
  return buildMetadata({
    title: `${movie.title}${year}`,
    description: truncateDescription(movie.overview),
    path: `/movie/${movie.id}`,
    // No `image` here: this route has an opengraph-image.tsx that generates a dynamic
    // poster+rating card, and Next.js wires that up as the OG/Twitter image automatically.
    type: 'video.movie',
  });
}

export default async function MovieDetailsPage({ params }: MoviePageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  const movie = await getMovie(movieId);

  if (!movie) {
    notFound();
  }

  const trailer = movie.videos?.results?.find((v: any) => v.type === 'Trailer' || v.type === 'Teaser');

  const subRouteTabs = [
    { label: 'Full Cast', href: `/movie/${movieId}/cast`, icon: Film },
    { label: 'Full Crew', href: `/movie/${movieId}/crew`, icon: Film },
    { label: 'Trailers Theater', href: `/movie/${movieId}/trailers`, icon: Film },
    { label: 'Posters Gallery', href: `/movie/${movieId}/posters`, icon: Sparkles },
    { label: '4K Backdrops', href: `/movie/${movieId}/backdrops`, icon: Sparkles },
    { label: 'Release Dates', href: `/movie/${movieId}/release-dates`, icon: Calendar },
    { label: 'Plot Keywords', href: `/movie/${movieId}/keywords`, icon: Sparkles },
    { label: 'Similar Movies', href: `/movie/${movieId}/similar`, icon: Film },
    { label: 'Recommendations', href: `/movie/${movieId}/recommendations`, icon: Sparkles },
    { label: 'Reviews Stream', href: `/movie/${movieId}/reviews`, icon: MessageSquare },
    { label: 'Watch Providers', href: `/movie/${movieId}/watch-providers`, icon: Tv },
    { label: 'Translations', href: `/movie/${movieId}/translations`, icon: Languages },
    { label: 'Alt Titles', href: `/movie/${movieId}/alternative-titles`, icon: ExternalLink },
    { label: 'External IDs', href: `/movie/${movieId}/external-ids`, icon: ExternalLink },
    { label: 'Revision History', href: `/movie/${movieId}/changes`, icon: History },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScriptProps(movieJsonLd(movie))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScriptProps(
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Movies', path: '/movies' },
            { name: movie.title, path: `/movie/${movie.id}` },
          ])
        )}
      />

      {/* Hero Banner */}
      <div className="relative h-[65vh] w-full">
        {movie.backdrop_path && (
          <Image
            src={getBackdropUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            fill
            priority
            className="object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />

        <div className="absolute bottom-0 inset-x-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-end md:items-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="relative w-44 sm:w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex-shrink-0 hidden sm:block">
            <Image src={getImageUrl(movie.poster_path, 'w500')} alt={movie.title} fill className="object-cover" />
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-brand-600/30 text-brand-400 border border-brand-500/40 px-2.5 py-1 rounded-md font-bold uppercase tracking-wide">
                Movie
              </span>
              {movie.genres?.map((g: any) => (
                <Link
                  key={g.id}
                  href={`/discover?genre=${g.id}`}
                  className="bg-gray-900 border border-gray-800 text-gray-300 px-2.5 py-1 rounded-md font-medium hover:border-brand-500/50 hover:text-white transition"
                >
                  {g.name}
                </Link>
              ))}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">{movie.title}</h1>
            {movie.tagline && <p className="text-brand-300 italic text-sm font-medium">&ldquo;{movie.tagline}&rdquo;</p>}

            <div className="flex flex-wrap items-center gap-6 text-xs text-gray-300 font-semibold">
              <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{movie.vote_average?.toFixed(1)} / 10</span>
                <span className="text-gray-500 font-normal">({movie.vote_count?.toLocaleString()} votes)</span>
              </div>
              {movie.runtime > 0 && (
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-brand-400" />
                  <span>{movie.runtime} min</span>
                </div>
              )}
              {movie.release_date && (
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-brand-400" />
                  <span>{movie.release_date}</span>
                </div>
              )}
            </div>

            {movie.crossSourceRatings && <CrossSourceRatings ratings={movie.crossSourceRatings} />}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <WatchlistButton
                variant="button"
                item={{
                  id: movie.id,
                  title: movie.title,
                  poster_path: movie.poster_path,
                  vote_average: movie.vote_average,
                  release_date: movie.release_date,
                  type: 'movie',
                }}
              />

              {trailer && (
                <Link
                  href={`/movie/${movieId}/trailers`}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-800 text-xs font-bold transition"
                >
                  <Film className="w-4 h-4 text-brand-400" />
                  <span>Watch Trailer</span>
                </Link>
              )}

              <Link
                href={`/share/${movie.id}`}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-800 text-xs font-bold transition"
              >
                <Share2 className="w-4 h-4 text-brand-400" />
                <span>Social Card</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Route Navigation Hub */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav aria-label="Movie details sections" className="bg-gray-900/80 p-2 rounded-2xl border border-gray-800 flex flex-wrap gap-2">
          {subRouteTabs.map((tab, idx) => {
            const Icon = tab.icon;
            return (
              <Link
                key={idx}
                href={tab.href}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800/80 hover:border-brand-500/50 text-[11px] font-bold text-gray-300 hover:text-white transition"
              >
                <Icon className="w-3.5 h-3.5 text-brand-400" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-white">Overview</h2>
          <p className="text-sm text-gray-300 leading-relaxed max-w-4xl">{movie.overview}</p>
        </div>

        {movie.credits?.cast?.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Top Billed Cast</h2>
              <Link href={`/movie/${movieId}/cast`} className="text-xs font-bold text-brand-400 hover:text-brand-300">
                View Full Cast →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {movie.credits.cast.slice(0, 10).map((person: any) => (
                <Link
                  key={person.id}
                  href={`/person/${person.id}`}
                  className="bg-gray-900/60 rounded-2xl overflow-hidden border border-gray-800/80 hover:border-brand-500/50 transition"
                >
                  <div className="relative aspect-[2/3] w-full bg-gray-950">
                    {person.profile_path ? (
                      <Image
                        src={getImageUrl(person.profile_path, 'w300')}
                        alt={person.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 20vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Photo</div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-bold text-white line-clamp-1">{person.name}</p>
                    <p className="text-[11px] text-gray-400 line-clamp-1">{person.character}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
