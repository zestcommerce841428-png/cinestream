import type { Metadata } from 'next';

export const SITE_NAME = 'CineStream';
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const SITE_DESCRIPTION =
  'CineStream is a free movie and TV discovery platform — browse trending titles, deep cast & crew credits, trailers, ratings, watch providers, and build your personal watchlist, powered by TMDB.';

interface BuildMetadataOptions {
  /** Page title. Rendered through the root layout's "%s | CineStream" template. */
  title: string;
  /** 120-160 character plain-text summary for search engines and social previews. */
  description: string;
  /** Path relative to the site root, e.g. "/movie/550". Used for canonical + OG/Twitter urls. */
  path: string;
  /** Absolute or metadataBase-relative image URL for social previews. */
  image?: string | null;
  type?: 'website' | 'article' | 'video.movie' | 'video.tv_show' | 'profile';
  noIndex?: boolean;
}

/**
 * Builds a consistent Metadata object (canonical + Open Graph + Twitter) for a route.
 * `metadataBase` is set once on the root layout, so `path`/`image` here may be relative.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const images = image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type: type === 'profile' ? 'profile' : type,
      images,
    },
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/** Truncates a long overview/bio to a clean plain-text meta description. */
export function truncateDescription(text: string | null | undefined, max = 160): string {
  if (!text) return SITE_DESCRIPTION;
  const clean = text.trim().replace(/\s+/g, ' ');
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}
