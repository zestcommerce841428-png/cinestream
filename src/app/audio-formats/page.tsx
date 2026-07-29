'use client';

import React from 'react';
import { Disc, Music } from 'lucide-react';

export default function AudioFormatsPage() {
  const formats = [
    { name: 'Dolby Atmos', channels: 'Object-based 128 channels', desc: 'Immersive overhead 3D spatial audio' },
    { name: 'IMAX Enhanced Audio', channels: 'Custom DTS:X mix', desc: 'Deep bass dynamic range tuned for large format' },
    { name: 'DTS:X', channels: 'Multi-channel spatial', desc: 'Flexible object-based sound positioning' },
    { name: 'Dolby TrueHD 7.1', channels: '7.1 Discrete Lossless', desc: 'Uncompressed studio master quality' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Disc className="w-8 h-8 text-rose-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Cinematic Sound & Audio Formats Guide</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Technical specifications for theatrical spatial audio and home theater standards.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {formats.map((f, idx) => (
          <div key={idx} className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-lg text-white">{f.name}</span>
              <Music className="w-5 h-5 text-rose-400" />
            </div>
            <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">{f.channels}</span>
            <p className="text-xs text-gray-300 pt-2 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
