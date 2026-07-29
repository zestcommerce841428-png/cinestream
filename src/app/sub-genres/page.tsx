import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Cinematic Sub-Genres & Micro-Genres',
  description: 'Explore specialized cinematic sub-genres and niche film movements, from neo-noir to found footage horror.',
  path: '/sub-genres',
});

// Each entry links to either a TMDB keyword page (specific enough to have its own keyword)
// or a genre-filtered discover view (broader movements without one single TMDB keyword).
const subGenres = [
  { name: 'Neo-Noir', href: '/keyword/10085', desc: 'Dark modern crime, cynical heroes, and moody cinematography' },
  { name: 'Found Footage', href: '/keyword/10683', desc: 'First-person raw camera style horror and mystery' },
  { name: 'Tech Noir & Cyberpunk', href: '/keyword/12190', desc: 'Futuristic neon dystopias and digital crime' },
  { name: 'Space Western', href: '/keyword/3801', desc: 'Sci-fi space opera with frontier western tropes' },
  { name: 'Spaghetti Western', href: '/discover?type=movie&genre=37', desc: 'Gritty 1960s Italian-style western sagas' },
  { name: 'Slapstick Comedy', href: '/discover?type=movie&genre=35', desc: 'Physical comedy, fast action, and visual humor' },
];

export default function SubGenresPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Cinematic Sub-Genres & Micro-Genres</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Explore specialized cinematic sub-genres and niche film movements.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {subGenres.map((sg) => (
          <Link
            key={sg.name}
            href={sg.href}
            className="group bg-gray-900/80 p-6 rounded-2xl border border-gray-800 hover:border-amber-500/50 transition-all space-y-2"
          >
            <h3 className="font-extrabold text-lg text-white group-hover:text-amber-300">{sg.name}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{sg.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
