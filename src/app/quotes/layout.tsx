import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Famous Movie Quotes Generator',
  description: 'Discover iconic cinema dialogue and famous character lines from classic and modern films.',
  path: '/quotes',
});

export default function QuotesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
