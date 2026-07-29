import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { tmdbClient } from '@/services/tmdb';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

  const routes = [
    '',
    '/movies',
    '/tv',
    '/trending',
    '/box-office',
    '/top-rated',
    '/upcoming',
    '/now-playing',
    '/popular-people',
    '/collections',
    '/companies',
    '/genres',
    '/certifications',
    '/languages',
    '/reviews',
    '/watch-analytics',
    '/keywords',
    '/airing-today',
    '/on-the-air',
    '/networks',
    '/changes',
    '/providers',
    '/discover',
    '/search',
    '/watchlist',
    '/api-explorer',
    '/ai-recommendations',
    '/compare',
    '/decade',
    '/random',
    '/trivia',
    '/history',
    '/soundtracks',
    '/cinematography',
    '/animation',
    '/oscar-winners',
    '/anime',
    '/documentaries',
    '/cult-classics',
    '/box-office-predictor',
    '/ratings-matrix',
    '/countries',
    '/directors',
    '/tropes',
    '/filmography',
    '/box-office-analytics',
    '/release-calendar',
    '/studios',
    '/sub-genres',
    '/timezones',
    '/jobs',
    '/countries-catalog',
    '/primary-translations',
    '/guest-sessions',
    '/festivals',
    '/eras',
    '/auteurs',
    '/scores',
    '/leaderboard',
    '/streaming-matrix',
    '/audio-formats',
    '/quotes',
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Enrich with real content pages so search engines can discover them directly,
  // instead of relying purely on crawl-discovery through internal links.
  const dynamicEntries: MetadataRoute.Sitemap = [];
  try {
    const [popularMovies, popularTV, popularPeople] = await Promise.all([
      tmdbClient.getMoviePopular(1),
      tmdbClient.getTVPopular(1),
      tmdbClient.getPopularPeople(1),
    ]);

    popularMovies.results.slice(0, 40).forEach((m) => {
      dynamicEntries.push({
        url: `${baseUrl}/movie/${m.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
    popularTV.results.slice(0, 40).forEach((t) => {
      dynamicEntries.push({
        url: `${baseUrl}/tv/${t.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
    popularPeople.results.slice(0, 40).forEach((p) => {
      dynamicEntries.push({
        url: `${baseUrl}/person/${p.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    });
  } catch {
    // TMDB unreachable at build/request time — ship the static routes only rather than failing the sitemap.
  }

  return [...staticEntries, ...dynamicEntries];
}
