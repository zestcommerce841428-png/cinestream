'use client';

import React from 'react';
import Link from 'next/link';
import { Film, Layers } from 'lucide-react';

export default function StudiosPage() {
  const majorStudios = [
    { id: 420, name: 'Marvel Studios', desc: 'Creators of the MCU' },
    { id: 33, name: 'Universal Pictures', desc: 'Jurassic World, Fast & Furious, Oppenheimer' },
    { id: 174, name: 'Warner Bros. Pictures', desc: 'DC, Harry Potter, Dune, The Dark Knight' },
    { id: 34, name: 'Sony Pictures', desc: 'Spider-Man Universe, Venom' },
    { id: 4, name: 'Paramount Pictures', desc: 'Top Gun, Mission: Impossible, Transformers' },
    { id: 41077, name: 'A24', desc: 'Everything Everywhere, Hereditary, Civil War' },
    { id: 3172, name: 'Blumhouse Productions', desc: 'Get Out, Five Nights at Freddy\'s, M3GAN' },
    { id: 1632, name: 'Lionsgate', desc: 'John Wick, Hunger Games, Saw' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Layers className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Major Film Production Studios</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Catalog of leading film and television production studios worldwide.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {majorStudios.map((s) => (
          <Link
            key={s.id}
            href={`/company/${s.id}`}
            className="group bg-gray-900/80 p-6 rounded-2xl border border-gray-800 hover:border-brand-500/50 transition-all space-y-2"
          >
            <h3 className="font-extrabold text-lg text-white group-hover:text-brand-300">{s.name}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
