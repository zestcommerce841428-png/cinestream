import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'TMDB Account & OAuth',
  description: 'Connect your TMDB account to sync favorites, ratings, watchlist, and custom lists.',
  path: '/auth',
  noIndex: true,
});

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
