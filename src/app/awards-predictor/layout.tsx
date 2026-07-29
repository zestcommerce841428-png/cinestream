import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Film Awards Prediction Engine',
  description: 'Predict Academy Award Best Picture contenders and simulate awards-season ballots.',
  path: '/awards-predictor',
});

export default function AwardsPredictorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
