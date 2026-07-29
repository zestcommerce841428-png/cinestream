import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { moodPresets } from '@/lib/moods';

export const metadata: Metadata = buildMetadata({
  title: 'AI Mood & Micro-Genre Recommender',
  description: `Browse ${moodPresets.length} curated cinematic mood presets — from cyberpunk dystopia to gothic haunted mansions — and get matching movie recommendations for each.`,
  path: '/ai-recommendations',
});

export default function AIRecommendationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
