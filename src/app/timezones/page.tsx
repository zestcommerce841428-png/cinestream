import type { Metadata } from 'next';
import { Clock } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: 'Global Cinema Timezones & Regional Broadcast Times',
  description: 'Official broadcast timezones for international television airings by country.',
  path: '/timezones',
});

export default async function TimezonesPage() {
  const timezones = await tmdbClient.getTimezones();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Clock className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Global Cinema Timezones & Regional Broadcast Times</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Official broadcast timezones for international television airings.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {timezones.slice(0, 40).map((tz: any, idx: number) => (
          <div key={idx} className="bg-gray-900/60 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
            <span className="font-bold text-xs text-white">{tz.iso_3166_1}</span>
            <span className="text-xs text-gray-400 truncate max-w-[200px]">{tz.zones?.join(', ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
