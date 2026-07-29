import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'API Explorer',
  description: 'Browse the TMDB API endpoint catalog and run live requests directly from your browser, with generated code snippets.',
  path: '/api-explorer',
});

export default function ApiExplorerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
