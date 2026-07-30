import type { Metadata } from 'next';
import { Users } from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';
import SixDegreesFinder from '@/components/SixDegreesFinder';

export const metadata: Metadata = buildMetadata({
  title: 'Six Degrees of Separation',
  description: 'Find the shortest co-star connection between any two actors.',
  path: '/six-degrees',
});

export default function SixDegreesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Users className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Six Degrees of Separation</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Pick two actors to find their shortest co-star connection — direct shared credits, or a mutual co-star linking them.
        </p>
      </div>

      <SixDegreesFinder />
    </div>
  );
}
