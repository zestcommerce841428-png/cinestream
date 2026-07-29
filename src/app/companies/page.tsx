import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { getImageUrl } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Production Studios & Companies',
  description: 'Browse iconic film studios and production companies, from Marvel Studios and Disney to A24, and jump into their catalogs.',
  path: '/companies',
});

const majorStudios = [
  { id: 420, name: 'Marvel Studios', logo: '/hA5OToEX2EMiogAzHDWcFiOwKSC.png', country: 'US' },
  { id: 33, name: 'Universal Pictures', logo: '/83o2koL82Yj02FW0fvsyRyd9x9.png', country: 'US' },
  { id: 174, name: 'Warner Bros. Pictures', logo: '/I24.png', country: 'US' },
  { id: 2, name: 'Walt Disney Pictures', logo: '/wZycLJBpOFUtT2r6Yz57488z.png', country: 'US' },
  { id: 4, name: 'Paramount', logo: '/gA8.png', country: 'US' },
  { id: 25, name: '20th Century Studios', logo: '/8z7.png', country: 'US' },
  { id: 41077, name: 'A24', logo: '/p123.png', country: 'US' },
  { id: 5, name: 'Columbia Pictures', logo: '/71.png', country: 'US' },
];

export default function CompaniesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Building2 className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Production Studios & Companies</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Explore iconic film studios, independent production houses, and network distributors.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {majorStudios.map((studio) => (
          <Link
            key={studio.id}
            href={`/company/${studio.id}`}
            className="group bg-gray-900/80 p-6 rounded-2xl border border-gray-800 hover:border-brand-500/50 transition-all flex flex-col items-center justify-center text-center space-y-3"
          >
            <div className="relative w-20 h-20 bg-white p-3 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
              {studio.logo ? (
                <Image src={getImageUrl(studio.logo, 'w185')} alt={studio.name} fill className="object-contain p-3" />
              ) : (
                <Building2 className="w-10 h-10 text-gray-800" />
              )}
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-brand-400">{studio.name}</h3>
            <span className="text-[11px] font-semibold text-gray-500 uppercase">{studio.country}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
