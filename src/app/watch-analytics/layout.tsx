import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Watchlist Statistics & Time Calculator',
  description: 'A breakdown and estimated watch-time stats for the movies and TV shows in your watchlist.',
  path: '/watch-analytics',
  noIndex: true,
});

export default function WatchAnalyticsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
