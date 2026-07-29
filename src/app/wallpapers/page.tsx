import type { Metadata } from 'next';
import Image from 'next/image';
import { Image as ImageIcon, Download } from 'lucide-react';
import { tmdbClient, getBackdropUrl } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: '4K Ultra HD Movie Wallpapers Gallery',
  description: 'High-resolution theatrical backdrop wallpapers for desktop and mobile devices.',
  path: '/wallpapers',
});

export default async function WallpapersPage() {
  const res = await tmdbClient.getCinematographyMovies();
  const movies = (res.results || []).filter((m) => m.backdrop_path);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <ImageIcon className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">4K Ultra HD Movie Wallpapers Gallery</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">High-resolution theatrical backdrop wallpapers for desktop and mobile devices.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {movies.map((m) => (
          <div key={m.id} className="group relative aspect-video rounded-2xl overflow-hidden border border-gray-800 bg-gray-950 shadow-xl">
            <Image
              src={getBackdropUrl(m.backdrop_path, 'w780')}
              alt={m.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
              <h3 className="font-extrabold text-sm text-white">{m.title}</h3>
              <a
                href={getBackdropUrl(m.backdrop_path, 'original')}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-bold w-fit shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download 4K</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
