import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Box Office Profitability & ROI Predictor',
  description: 'Estimate break-even thresholds, marketing multipliers, and theatrical ROI for a feature film given its production budget.',
  path: '/box-office-predictor',
});

export default function BoxOfficePredictorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
