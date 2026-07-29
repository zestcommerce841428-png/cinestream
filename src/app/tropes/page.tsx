import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Tag } from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Cinematic Tropes & Themes Index',
  description: 'Browse movies categorized by plot tropes, narrative themes, and storytelling motifs.',
  path: '/tropes',
});

const tropesList = [
  { name: 'Time Travel', id: 4379, desc: 'Temporal anomalies, timeline shifts, and time loops' },
  { name: 'Cyberpunk', id: 12190, desc: 'High tech, low life, neon dystopias and neural cybernetics' },
  { name: 'Artificial Intelligence', id: 310, desc: 'Sentient AI, androids, and machine uprisings' },
  { name: 'Heist & Robbery', id: 10085, desc: 'High-stakes bank jobs, vault cracks, and team plans' },
  { name: 'Multiverse & Parallel Worlds', id: 284093, desc: 'Alternate dimensions and timelines' },
  { name: 'Space Exploration', id: 3801, desc: 'Interstellar voyages, deep space stations, and planetary landings' },
  { name: 'Survival & Wilderness', id: 10683, desc: 'Human vs nature, desert islands, and extreme environments' },
  { name: 'Dystopian Future', id: 4565, desc: 'Totalitarian regimes and post-apocalyptic societies' },
];

export default function TropesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Tag className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Cinematic Tropes & Themes Index</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Browse movies categorized by plot tropes, narrative themes, and storytelling motifs.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tropesList.map((t) => (
          <Link
            key={t.name}
            href={`/keyword/${t.id}`}
            className="group bg-gray-900/80 p-6 rounded-2xl border border-gray-800 hover:border-brand-500/50 transition-all flex flex-col justify-between space-y-2"
          >
            <div>
              <span className="text-xs font-extrabold text-brand-400">#{t.name}</span>
              <p className="text-xs text-gray-400 pt-1 leading-relaxed">{t.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
