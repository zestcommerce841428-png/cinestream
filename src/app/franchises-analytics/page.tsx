'use client';

import React from 'react';
import { Layers, DollarSign } from 'lucide-react';

export default function FranchisesAnalyticsPage() {
  const franchisesData = [
    { name: 'Marvel Cinematic Universe (MCU)', revenue: '$29.8 Billion', films: 33, topFilm: 'Avengers: Endgame ($2.79B)' },
    { name: 'Star Wars Universe', revenue: '$10.3 Billion', films: 12, topFilm: 'The Force Awakens ($2.07B)' },
    { name: 'Harry Potter & Wizarding World', revenue: '$9.6 Billion', films: 11, topFilm: 'Deathly Hallows Part 2 ($1.34B)' },
    { name: 'James Bond (077)', revenue: '$7.8 Billion', films: 25, topFilm: 'Skyfall ($1.10B)' },
    { name: 'Lord of the Rings & Hobbit', revenue: '$5.9 Billion', films: 6, topFilm: 'Return of the King ($1.14B)' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Layers className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Franchise Box Office & Financial Comparison Hub</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Financial benchmarks and cumulative box office metrics for top film sagas.</p>
      </div>

      <div className="space-y-4">
        {franchisesData.map((f, idx) => (
          <div key={idx} className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-brand-400">Franchise Rank #{idx + 1}</span>
              <h3 className="font-extrabold text-xl text-white">{f.name}</h3>
              <p className="text-xs text-gray-400 pt-1">Top Grossing Film: {f.topFilm}</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-gray-400">Total Global Box Office</span>
              <p className="text-2xl font-extrabold text-emerald-400">{f.revenue}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
