import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'My Ratings',
  description: 'Your personal movie and TV ratings, stored privately in your browser.',
  path: '/my-ratings',
  noIndex: true,
});

export default function MyRatingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
