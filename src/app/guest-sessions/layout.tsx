import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Guest Sessions',
  description: 'Generate a temporary TMDB guest session to rate movies and episodes without a full account.',
  path: '/guest-sessions',
  noIndex: true,
});

export default function GuestSessionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
