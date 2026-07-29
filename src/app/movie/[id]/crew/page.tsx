import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Briefcase, ArrowLeft } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getData(id: number) {
  try {
    const [movie, credits] = await Promise.all([
      tmdbClient.getMovieDetails(id),
      tmdbClient.getMovieCredits(id),
    ]);
    return { movie, crew: credits.crew || [] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(parseInt(id, 10));
  if (!data) return { title: 'Movie Not Found', robots: { index: false, follow: false } };
  return buildMetadata({
    title: `Full Crew — ${data.movie.title}`,
    description: `Complete crew list grouped by department for ${data.movie.title}.`,
    path: `/movie/${id}/crew`,
  });
}

export default async function MovieCrewPage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  const data = await getData(movieId);

  if (!data) {
    notFound();
  }

  const { movie, crew } = data;

  const departmentsMap = crew.reduce((acc: any, member: any) => {
    const dept = member.department || 'Other';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(member);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-4">
        <Link href={`/movie/${movieId}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Details</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Briefcase className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Full Crew Roster — {movie.title}</h1>
        </div>
      </div>

      {crew.length > 0 ? (
        <div className="space-y-8">
          {Object.entries(departmentsMap).map(([deptName, members]: [string, any]) => (
            <div key={deptName} className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 space-y-4">
              <h2 className="text-lg font-bold text-brand-400">{deptName} Department</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {members.map((m: any, idx: number) => (
                  <Link key={idx} href={`/person/${m.id}`} className="p-3 bg-gray-950 rounded-xl border border-gray-800 hover:border-brand-500/40 transition">
                    <h3 className="font-bold text-xs text-white">{m.name}</h3>
                    <p className="text-[11px] text-gray-400">{m.job}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No crew information available.</p>
      )}
    </div>
  );
}
