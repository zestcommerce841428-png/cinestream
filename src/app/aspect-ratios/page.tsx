'use client';

import React from 'react';
import { Film, Monitor } from 'lucide-react';

export default function AspectRatiosPage() {
  const ratios = [
    { ratio: '1.43:1', name: 'IMAX 70mm Native', desc: 'Expanded vertical field of view utilized in Oppenheimer, Interstellar, and Dune Part Two' },
    { ratio: '2.39:1', name: 'Anamorphic Widescreen', desc: 'Standard ultra-wide theatrical aspect ratio for modern cinema' },
    { ratio: '1.85:1', name: 'Academy Flat', desc: 'Standard widescreen aspect ratio fill for 16:9 displays' },
    { ratio: '1.33:1', name: 'Academy 4:3 Ratio', desc: 'Classic Hollywood silent & early talkie square aspect ratio' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Monitor className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Cinematic Aspect Ratios & Technical Specs Guide</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Technical camera frame geometry, film stock gauge specs, and aspect ratio standards.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {ratios.map((r, idx) => (
          <div key={idx} className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 space-y-2">
            <span className="text-xs font-mono font-bold text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded border border-brand-500/20">{r.ratio}</span>
            <h3 className="font-extrabold text-lg text-white pt-1">{r.name}</h3>
            <p className="text-xs text-gray-300 leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
