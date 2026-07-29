'use client';

import React from 'react';
import Link from 'next/link';
import { Tv } from 'lucide-react';

export default function NetworksPage() {
  const networksList = [
    { id: 49, name: 'HBO', country: 'US', desc: 'Home of Game of Thrones, Succession, The Last of Us' },
    { id: 213, name: 'Netflix', country: 'US', desc: 'Global streaming giant' },
    { id: 2552, name: 'Apple TV+', country: 'US', desc: 'Award-winning originals' },
    { id: 2739, name: 'Disney+', country: 'US', desc: 'Marvel, Star Wars, Pixar' },
    { id: 1024, name: 'Amazon Prime', country: 'US', desc: 'Rings of Power, The Boys' },
    { id: 174, name: 'AMC', country: 'US', desc: 'Breaking Bad, The Walking Dead' },
    { id: 6, name: 'NBC', country: 'US', desc: 'Classic sitcoms and drama' },
    { id: 19, name: 'FOX', country: 'US', desc: 'Animation and primetime series' },
    { id: 4, name: 'BBC One', country: 'GB', desc: 'Doctor Who, Sherlock' },
    { id: 43, name: 'National Geographic', country: 'US', desc: 'Documentaries and exploration' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Tv className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">TV Networks Directory</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Explore premier television networks, cable stations, and streaming distributors.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {networksList.map((net) => (
          <Link
            key={net.id}
            href={`/network/${net.id}`}
            className="group bg-gray-900/80 p-6 rounded-2xl border border-gray-800 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/20 px-2.5 py-1 rounded-md border border-purple-500/30">
                {net.country}
              </span>
              <Tv className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white group-hover:text-purple-300">{net.name}</h3>
              <p className="text-xs text-gray-400 pt-1 leading-relaxed">{net.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
