import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Movie Trivia Game',
  description: 'Test your film knowledge with a live-scored movie trivia quiz.',
  path: '/trivia',
});

export default function TriviaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
