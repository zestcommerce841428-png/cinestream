import type { Metadata } from 'next';
import Link from 'next/link';
import { User } from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Director & Actor Collaborations Network',
  description: 'Catalog of iconic filmmaker and actor duos — recurring director-actor partnerships that shaped cinema history.',
  path: '/collaborations',
});

export default function CollaborationsPage() {
  const duos = [
    { director: 'Christopher Nolan', directorId: 525, actor: 'Michael Caine', actorId: 3895, count: 8, films: 'The Dark Knight Trilogy, Inception, Interstellar, Dunkirk, Tenet' },
    { director: 'Martin Scorsese', directorId: 1032, actor: 'Robert De Niro', actorId: 380, count: 10, films: 'Taxi Driver, Raging Bull, Goodfellas, Casino, The Irishman' },
    { director: 'Martin Scorsese', directorId: 1032, actor: 'Leonardo DiCaprio', actorId: 6193, count: 6, films: 'Gangs of New York, The Aviator, The Departed, Shutter Island, Wolf of Wall Street' },
    { director: 'Quentin Tarantino', directorId: 138, actor: 'Samuel L. Jackson', actorId: 2231, count: 6, films: 'Pulp Fiction, Jackie Brown, Django Unchained, The Hateful Eight' },
    { director: 'Tim Burton', directorId: 510, actor: 'Johnny Depp', actorId: 85, count: 8, films: 'Edward Scissorhands, Ed Wood, Sleepy Hollow, Charlie and the Chocolate Factory' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <User className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Director & Actor Collaborations Network</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Catalog of iconic filmmaker and actor duos who shaped cinema history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {duos.map((d, idx) => (
          <div key={idx} className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-400 uppercase">{d.count} Shared Feature Films</span>
              <span className="text-xs font-bold text-amber-400">Legendary Duo</span>
            </div>
            <h3 className="font-extrabold text-lg text-white">
              <Link href={`/person/${d.directorId}`} className="hover:underline">{d.director}</Link> & <Link href={`/person/${d.actorId}`} className="hover:underline">{d.actor}</Link>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed"><strong>Notable Collaborations:</strong> {d.films}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
