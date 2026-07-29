'use client';

import React from 'react';
import Link from 'next/link';
import { Music, Disc, Star } from 'lucide-react';

export default function SoundtracksPage() {
  const masterComposers = [
    { name: 'Hans Zimmer', works: 'Interstellar, Inception, The Dark Knight, Dune, Gladiator', icon: '🎼' },
    { name: 'John Williams', works: 'Star Wars, Jurassic Park, Indiana Jones, Harry Potter', icon: '🎷' },
    { name: 'Ennio Morricone', works: 'The Good, the Bad and the Ugly, Cinema Paradiso, The Hateful Eight', icon: '🎺' },
    { name: 'Howard Shore', works: 'The Lord of the Rings, The Hobbit, Seven, The Silence of the Lambs', icon: '🎻' },
    { name: 'Ludwig Göransson', works: 'Oppenheimer, Black Panther, Tenet, The Mandalorian', icon: '🎹' },
    { name: 'Alan Silvestri', works: 'Back to the Future, Avengers: Endgame, Forrest Gump', icon: '🥁' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Music className="w-8 h-8 text-rose-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Soundtracks & Legendary Composers</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Explore film scores, legendary music directors, and iconic soundtracks.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {masterComposers.map((c) => (
          <div key={c.name} className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{c.icon}</span>
              <Disc className="w-5 h-5 text-rose-400" />
            </div>
            <h3 className="font-extrabold text-lg text-white">{c.name}</h3>
            <p className="text-xs text-gray-400 leading-relaxed pt-1"><strong>Key Works:</strong> {c.works}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
