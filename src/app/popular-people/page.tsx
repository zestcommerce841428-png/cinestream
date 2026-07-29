'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, ChevronLeft, ChevronRight } from 'lucide-react';
import { tmdbClient, getImageUrl, Person } from '@/services/tmdb';

export default function PopularPeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPeople() {
      setLoading(true);
      try {
        const res = await tmdbClient.getPopularPeople(page);
        setPeople(res.results || []);
        setTotalPages(Math.min(res.total_pages, 500));
      } catch (err) {
        console.error('Failed to fetch popular people', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPeople();
  }, [page]);

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

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-gray-900 animate-pulse rounded-2xl border border-gray-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {people.map((person) => (
            <Link
              key={person.id}
              href={`/person/${person.id}`}
              className="group bg-gray-900/60 p-3 rounded-2xl border border-gray-800 hover:border-brand-500/50 transition-all text-center flex flex-col justify-between"
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-950 mb-3">
                {person.profile_path ? (
                  <Image src={getImageUrl(person.profile_path, 'w300')} alt={person.name} fill className="object-cover group-hover:scale-105 transition-transform" />
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
      )}

      <div className="flex items-center justify-between border-t border-gray-800 pt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm font-medium text-gray-300 disabled:opacity-40 hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="text-xs text-gray-400 font-medium">
          Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong>
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm font-medium text-gray-300 disabled:opacity-40 hover:text-white transition"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
