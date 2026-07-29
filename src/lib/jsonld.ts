import { getImageUrl } from '@/services/tmdb';
import { SITE_NAME, SITE_URL } from '@/lib/metadata';

/** Renders a JSON-LD object as a safe <script> payload for use in a Server Component. */
export function jsonLdScriptProps(data: Record<string, unknown>) {
  return { __html: JSON.stringify(data) };
}

export function movieJsonLd(movie: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    description: movie.overview || undefined,
    image: movie.poster_path ? getImageUrl(movie.poster_path, 'original') : undefined,
    datePublished: movie.release_date || undefined,
    duration: movie.runtime ? `PT${movie.runtime}M` : undefined,
    genre: movie.genres?.map((g: any) => g.name),
    url: `${SITE_URL}/movie/${movie.id}`,
    ...(movie.vote_count
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: movie.vote_average,
            ratingCount: movie.vote_count,
            bestRating: 10,
            worstRating: 0,
          },
        }
      : {}),
  };
}

export function tvSeriesJsonLd(show: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: show.name,
    description: show.overview || undefined,
    image: show.poster_path ? getImageUrl(show.poster_path, 'original') : undefined,
    datePublished: show.first_air_date || undefined,
    genre: show.genres?.map((g: any) => g.name),
    numberOfSeasons: show.number_of_seasons || undefined,
    numberOfEpisodes: show.number_of_episodes || undefined,
    url: `${SITE_URL}/tv/${show.id}`,
    ...(show.vote_count
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: show.vote_average,
            ratingCount: show.vote_count,
            bestRating: 10,
            worstRating: 0,
          },
        }
      : {}),
  };
}

export function personJsonLd(person: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    description: person.biography || undefined,
    image: person.profile_path ? getImageUrl(person.profile_path, 'original') : undefined,
    birthDate: person.birthday || undefined,
    deathDate: person.deathday || undefined,
    birthPlace: person.place_of_birth || undefined,
    jobTitle: person.known_for_department || undefined,
    url: `${SITE_URL}/person/${person.id}`,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function itemListJsonLd(name: string, items: { id: number; title?: string; name?: string }[], mediaType: 'movie' | 'tv') {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.slice(0, 20).map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/${mediaType}/${item.id}`,
      name: item.title || item.name,
    })),
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={search_term}` },
      'query-input': 'required name=search_term',
    },
  };
}
