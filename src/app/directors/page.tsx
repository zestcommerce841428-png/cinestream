'use client';

import React from 'react';
import Link from 'next/link';
import { User, Film, Star } from 'lucide-react';

export default function DirectorsPage() {
  const directorsList = [
    { id: 525, name: 'Christopher Nolan', works: 'Oppenheimer, Interstellar, Inception, The Dark Knight Trilogy' },
    { id: 138, name: 'Quentin Tarantino', works: 'Pulp Fiction, Django Unchained, Inglorious Basterds, Kill Bill' },
    { id: 1032, name: 'Martin Scorsese', works: 'Goodfellas, Taxi Driver, The Wolf of Wall Street, The Departed' },
    { id: 488, name: 'Steven Spielberg', works: 'Jurassic Park, Schindler\'s List, Saving Private Ryan, Jaws' },
    { id: 608, name: 'Hayao Miyazaki', works: 'Spirited Away, Princess Mononoke, Howl\'s Moving Castle' },
    { id: 137427, name: 'Denis Villeneuve', works: 'Dune, Blade Runner 2049, Arrival, Sicario' },
    { id: 2710, name: 'James Cameron', works: 'Avatar, Titanic, Aliens, Terminator 2: Judgment Day' },
    { id: 578, name: 'Ridley Scott', works: 'Gladiator, Alien, Blade Runner, The Martian' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <User className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Master Film Directors & Auteurs</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Explore filmographies of visionary directors and auteur filmmakers.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {directorsList.map((d) => (
          <Link
            key={d.id}
            href={`/person/${d.id}`}
            className="group bg-gray-900/80 p-6 rounded-2xl border border-gray-800 hover:border-brand-500/50 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400">Director</span>
              <h3 className="font-extrabold text-lg text-white group-hover:text-brand-300">{d.name}</h3>
              <p className="text-xs text-gray-400 pt-2 leading-relaxed"><strong>Notable Works:</strong> {d.works}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
