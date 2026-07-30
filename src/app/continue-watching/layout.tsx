import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Continue Watching',
  description: 'TV series with episodes you have marked as watched, picked up where you left off.',
  path: '/continue-watching',
  noIndex: true,
});

export default function ContinueWatchingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
