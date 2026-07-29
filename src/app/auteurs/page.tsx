import type { Metadata } from 'next';
import Link from 'next/link';
import { User } from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Directors & Auteurs Filmmaking Matrix',
  description: "Explore the signature directorial styles and visual motifs of cinema's most influential auteur filmmakers.",
  path: '/auteurs',
});

export default function AuteursPage() {
  const auteursList = [
    { id: 525, name: 'Christopher Nolan', style: 'Non-linear narratives, practical IMAX scale, mind-bending themes' },
    { id: 138, name: 'Quentin Tarantino', style: 'Non-chronological dialogue, homage cinema, chapter structures' },
    { id: 1032, name: 'Martin Scorsese', style: 'Fast tracking shots, voiceover narration, guilt & redemption' },
    { id: 488, name: 'Steven Spielberg', style: 'Visual wonder, emotional depth, iconic camera dolly moves' },
    { id: 608, name: 'Hayao Miyazaki', style: 'Hand-drawn animation, environmentalism, flight & magic' },
    { id: 137427, name: 'Denis Villeneuve', style: 'Monumental scale, atmospheric soundscapes, brutalist imagery' },
    { id: 2710, name: 'James Cameron', style: 'Revolutionary visual effects, high concept sci-fi spectacles' },
    { id: 578, name: 'Ridley Scott', style: 'Detailed worldbuilding, atmospheric lighting, epic historical scales' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <User className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Directors & Auteurs Filmmaking Matrix</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Explore signature directorial styles, visual motifs, and auteur filmographies.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {auteursList.map((a) => (
          <Link
            key={a.id}
            href={`/person/${a.id}`}
            className="group bg-gray-900/80 p-6 rounded-2xl border border-gray-800 hover:border-brand-500/50 transition-all space-y-2"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400">Auteur Director</span>
            <h3 className="font-extrabold text-lg text-white group-hover:text-brand-300">{a.name}</h3>
            <p className="text-xs text-gray-400 leading-relaxed pt-1"><strong>Signature Style:</strong> {a.style}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
