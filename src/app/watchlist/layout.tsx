import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Your Watchlist',
  description: 'Movies and TV series you have saved to watch later, stored privately in your browser.',
  path: '/watchlist',
  noIndex: true,
});

export default function WatchlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
