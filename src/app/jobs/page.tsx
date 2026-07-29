import type { Metadata } from 'next';
import { Briefcase } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Film Production Jobs & Department Guide',
  description: 'Official TMDB industry crew job titles and department structures, from Directing to Visual Effects.',
  path: '/jobs',
});

export default async function JobsPage() {
  const jobs = (await tmdbClient.getJobs()) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Film Production Jobs & Department Guide</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Official industry crew job titles, department structures, and roles.</p>
      </div>

      <div className="space-y-6">
        {jobs.map((dept: any, idx: number) => (
          <div key={idx} className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 space-y-3">
            <h3 className="text-lg font-bold text-brand-400">{dept.department} Department</h3>
            <div className="flex flex-wrap gap-2">
              {dept.jobs?.map((j: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-gray-950 rounded-xl border border-gray-800 text-xs font-semibold text-gray-300">
                  {j}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
