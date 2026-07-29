import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { User, ChevronLeft, ChevronRight } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Popular People',
  description: 'Trending actors, actresses, directors, and crew members.',
  path: '/popular-people',
});

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function PopularPeoplePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.min(Math.max(parseInt(sp.page || '1', 10) || 1, 1), 500);

  const res = await tmdbClient.getPopularPeople(page);
  const people = res.results || [];
  const totalPages = Math.min(res.total_pages || 1, 500);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <User className="w-8 h-8 text-rose-500" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Popular People</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">Trending actors, actresses, directors, and crew members.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {people.map((person) => (
          <Link
            key={person.id}
            href={`/person/${person.id}`}
            className="group bg-gray-900/60 p-3 rounded-2xl border border-gray-800 hover:border-brand-500/50 transition-all text-center flex flex-col justify-between"
          >
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-950 mb-3">
              {person.profile_path ? (
                <Image
                  src={getImageUrl(person.profile_path, 'w300')}
                  alt={person.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Image</div>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-white group-hover:text-brand-500 line-clamp-1">{person.name}</h3>
              <p className="text-xs text-gray-400">{person.known_for_department}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-gray-800 pt-6">
        <Link
          href={`/popular-people?page=${Math.max(page - 1, 1)}`}
          aria-disabled={page <= 1}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm font-medium text-gray-300 hover:text-white transition ${
            page <= 1 ? 'pointer-events-none opacity-40' : ''
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Link>

        <span className="text-xs text-gray-400 font-medium">
          Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong>
        </span>

        <Link
          href={`/popular-people?page=${page + 1}`}
          aria-disabled={page >= totalPages}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm font-medium text-gray-300 hover:text-white transition ${
            page >= totalPages ? 'pointer-events-none opacity-40' : ''
          }`}
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
