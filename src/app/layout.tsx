import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import AppChrome from '@/components/AppChrome';
import { WatchlistProvider } from '@/context/WatchlistContext';
import { WatchHistoryProvider } from '@/context/WatchHistoryContext';
import { RatingsProvider } from '@/context/RatingsContext';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/metadata';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Discover Movies & TV Shows`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ['movies', 'tv shows', 'streaming', 'TMDB', 'reviews', 'ratings', 'cast', 'trailers', 'watchlist'],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { email: false, address: false, telephone: false },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo192.png',
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Discover Movies & TV Shows`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: '/sharing/fb-sharing.png', width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Discover Movies & TV Shows`,
    description: SITE_DESCRIPTION,
    images: ['/sharing/fb-sharing.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#e11d48',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-dark-900 text-gray-100 min-h-screen flex flex-col antialiased">
        <WatchlistProvider>
          <WatchHistoryProvider>
            <RatingsProvider>
              <AppChrome>{children}</AppChrome>
            </RatingsProvider>
          </WatchHistoryProvider>
        </WatchlistProvider>
      </body>
    </html>
  );
}
