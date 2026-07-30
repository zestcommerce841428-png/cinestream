import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, Calendar, Share2, Tv, Film, Sparkles, MessageSquare, Languages, ExternalLink, ShieldAlert, Layers } from 'lucide-react';
import { tmdbClient, getImageUrl, getBackdropUrl } from '@/services/tmdb';
import { getCrossSourceRatings } from '@/services/omdb';
import { buildMetadata, truncateDescription } from '@/lib/metadata';
import { jsonLdScriptProps, tvSeriesJsonLd, breadcrumbJsonLd } from '@/lib/jsonld';
import { getPreferredLanguage } from '@/lib/i18n-server';
import WatchlistButton from '@/components/WatchlistButton';
import CrossSourceRatings from '@/components/CrossSourceRatings';

// No `revalidate` export: reading the language cookie makes this route inherently
// per-request (see src/lib/i18n-server.ts) — a static ISR interval would be misleading.

interface TVPageProps {
  params: Promise<{ id: string }>;
}

async function getTV(id: number) {
  try {
    const language = await getPreferredLanguage();
    const tv = await tmdbClient.getTVDetailsDeep(id, language);
    const crossSourceRatings = await getCrossSourceRatings(tv.external_ids?.imdb_id);
    return { ...tv, crossSourceRatings };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: TVPageProps): Promise<Metadata> {
  const { id } = await params;
  const tv = await getTV(parseInt(id, 10));
  if (!tv) {
    return { title: 'TV Show Not Found', robots: { index: false, follow: false } };
  }

  const year = tv.first_air_date ? ` (${new Date(tv.first_air_date).getFullYear()})` : '';
  return buildMetadata({
    title: `${tv.name}${year}`,
    description: truncateDescription(tv.overview),
    path: `/tv/${tv.id}`,
    // No `image` here: this route has an opengraph-image.tsx that generates a dynamic
    // poster+rating card, and Next.js wires that up as the OG/Twitter image automatically.
    type: 'video.tv_show',
  });
}

export default async function TVDetailsPage({ params }: TVPageProps) {
  const { id } = await params;
  const tvId = parseInt(id, 10);
  const tv = await getTV(tvId);

  if (!tv) {
    notFound();
  }

  const subRouteTabs = [
    { label: 'Aggregate Cast', href: `/tv/${tvId}/aggregate-credits`, icon: Film },
    { label: 'Content Ratings', href: `/tv/${tvId}/content-ratings`, icon: ShieldAlert },
    { label: 'Videos & Teasers', href: `/tv/${tvId}/videos`, icon: Sparkles },
    { label: 'Reviews Stream', href: `/tv/${tvId}/reviews`, icon: MessageSquare },
    { label: 'Watch Providers', href: `/tv/${tvId}/watch-providers`, icon: Tv },
    { label: 'Translations', href: `/tv/${tvId}/translations`, icon: Languages },
    { label: 'Alt Titles', href: `/tv/${tvId}/alternative-titles`, icon: Languages },
    { label: 'External IDs', href: `/tv/${tvId}/external-ids`, icon: ExternalLink },
    { label: 'Episode Groups', href: `/tv/${tvId}/episode-groups`, icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(tvSeriesJsonLd(tv))} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScriptProps(
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'TV Shows', path: '/tv' },
            { name: tv.name, path: `/tv/${tv.id}` },
          ])
        )}
      />

      {/* Hero Banner */}
      <div className="relative h-[65vh] w-full">
        {tv.backdrop_path && (
          <Image
            src={getBackdropUrl(tv.backdrop_path, 'original')}
            alt={tv.name}
            fill
            priority
            className="object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />

        <div className="absolute bottom-0 inset-x-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-end md:items-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="relative w-44 sm:w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex-shrink-0 hidden sm:block">
            <Image src={getImageUrl(tv.poster_path, 'w500')} alt={tv.name} fill className="object-cover" />
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-brand-600/30 text-brand-400 border border-brand-500/40 px-2.5 py-1 rounded-md font-bold uppercase tracking-wide">
                TV Series
              </span>
              {tv.genres?.map((g: any) => (
                <Link
                  key={g.id}
                  href={`/discover?genre=${g.id}&type=tv`}
                  className="bg-gray-900 border border-gray-800 text-gray-300 px-2.5 py-1 rounded-md font-medium hover:border-brand-500/50 hover:text-white transition"
                >
                  {g.name}
                </Link>
              ))}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">{tv.name}</h1>
            {tv.tagline && <p className="text-brand-300 italic text-sm font-medium">&ldquo;{tv.tagline}&rdquo;</p>}

            <div className="flex flex-wrap items-center gap-6 text-xs text-gray-300 font-semibold">
              <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{tv.vote_average?.toFixed(1)} / 10</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Tv className="w-4 h-4 text-brand-400" />
                <span>
                  {tv.number_of_seasons} Seasons ({tv.number_of_episodes} Episodes)
                </span>
              </div>
              {tv.first_air_date && (
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-brand-400" />
                  <span>First Aired: {tv.first_air_date}</span>
                </div>
              )}
            </div>

            {tv.crossSourceRatings && <CrossSourceRatings ratings={tv.crossSourceRatings} />}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <WatchlistButton
                variant="button"
                item={{
                  id: tv.id,
                  title: tv.name,
                  poster_path: tv.poster_path,
                  vote_average: tv.vote_average,
                  release_date: tv.first_air_date,
                  type: 'tv',
                }}
              />

              <Link
                href={`/share/${tv.id}`}
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
        <nav aria-label="TV show details sections" className="bg-gray-900/80 p-2 rounded-2xl border border-gray-800 flex flex-wrap gap-2">
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

      {/* Overview + Seasons + Cast */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-white">Overview</h2>
          <p className="text-sm text-gray-300 leading-relaxed max-w-4xl">{tv.overview}</p>
        </div>

        {tv.seasons?.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Seasons</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {tv.seasons
                .filter((s: any) => s.season_number !== undefined)
                .map((season: any) => (
                  <Link
                    key={season.id}
                    href={`/season/${tvId}/${season.season_number}`}
                    className="bg-gray-900/60 rounded-2xl overflow-hidden border border-gray-800/80 hover:border-brand-500/50 transition"
                  >
                    <div className="relative aspect-[2/3] w-full bg-gray-950">
                      {season.poster_path ? (
                        <Image
                          src={getImageUrl(season.poster_path, 'w300')}
                          alt={season.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 20vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Poster</div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold text-white line-clamp-1">{season.name}</p>
                      <p className="text-[11px] text-gray-400">{season.episode_count} episodes</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}

        {tv.credits?.cast?.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Top Billed Cast</h2>
              <Link href={`/tv/${tvId}/aggregate-credits`} className="text-xs font-bold text-brand-400 hover:text-brand-300">
                View Full Cast →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {tv.credits.cast.slice(0, 10).map((person: any) => (
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
