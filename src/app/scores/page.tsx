import React from 'react';
import type { Metadata } from 'next';
import { Music, Disc } from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Movie Soundtracks & Score Library',
  description: 'Catalog of iconic film scores, symphonic compositions, and legendary movie soundtrack composers.',
  path: '/scores',
});

const iconicScores = [
  { title: 'Interstellar (Original Motion Picture Soundtrack)', composer: 'Hans Zimmer', year: '2014' },
  { title: 'Star Wars: Episode IV - A New Hope', composer: 'John Williams', year: '1977' },
  { title: 'The Good, the Bad and the Ugly', composer: 'Ennio Morricone', year: '1966' },
  { title: 'The Lord of the Rings: The Fellowship of the Ring', composer: 'Howard Shore', year: '2001' },
  { title: 'Oppenheimer', composer: 'Ludwig Göransson', year: '2023' },
  { title: 'Back to the Future', composer: 'Alan Silvestri', year: '1985' },
];

export default function ScoresPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Music className="w-8 h-8 text-rose-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Movie Soundtracks & Score Library</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Catalog of iconic film scores, symphonic compositions, and legendary tracks.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {iconicScores.map((s, idx) => (
          <div key={idx} className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400">{s.year}</span>
              <Disc className="w-5 h-5 text-rose-400" />
            </div>
            <h3 className="font-extrabold text-base text-white">{s.title}</h3>
            <p className="text-xs text-gray-400">
              Composed by <strong>{s.composer}</strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
