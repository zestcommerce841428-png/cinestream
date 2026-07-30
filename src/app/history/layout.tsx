import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Viewing History & Watch Log',
  description: 'Movies and TV episodes you have marked as watched, stored privately in your browser.',
  path: '/history',
  noIndex: true,
});

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
