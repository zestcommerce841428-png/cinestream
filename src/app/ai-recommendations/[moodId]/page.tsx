import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star } from 'lucide-react';
import { tmdbClient, getImageUrl } from '@/services/tmdb';
import { getMoodById, moodPresets } from '@/lib/moods';
import { buildMetadata } from '@/lib/metadata';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ moodId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { moodId } = await params;
  const mood = getMoodById(moodId);
  return buildMetadata({
    title: `${mood.name} — AI Mood Recommendations`,
    description: `${mood.description} Curated movie recommendations for the ${mood.name.toLowerCase()} mood, powered by TMDB.`,
    path: `/ai-recommendations/${moodId}`,
  });
}

export default async function DedicatedMoodPage({ params }: PageProps) {
  const { moodId } = await params;
  const mood = getMoodById(moodId);
  const Icon = mood.icon;

  const movies = await tmdbClient.getMoviesByMood(mood.genreId).catch(() => ({ results: [] }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-6">
        <Link href="/ai-recommendations" className="inline-flex items-center space-x-2 text-xs font-bold text-gray-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All {moodPresets.length} Mood Cards</span>
        </Link>
        <span className="text-xs font-mono font-bold text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
          {mood.tagline}
        </span>
      </div>

      {/* Hero Mood Banner */}
      <div className={`relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br ${mood.color} shadow-2xl overflow-hidden text-white space-y-4`}>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-white/80">AI Recommended Mood Showcase</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">{mood.name}</h1>
          </div>
        </div>

        <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-3xl">{mood.description}</p>

        <div className="pt-4 flex flex-wrap gap-2">
          {mood.sampleMovies.map((m, i) => (
            <span key={i} className="text-xs font-semibold bg-black/30 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Recommended Movies Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <h2 className="text-2xl font-extrabold text-white">Recommended {mood.name} Movies</h2>
          <span className="text-xs text-gray-400 font-mono">{movies.results.length} Masterpieces Found</span>
        </div>

        {movies.results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.results.map((m) => (
              <Link
                key={m.id}
                href={`/movie/${m.id}`}
                className="group bg-gray-900/80 rounded-2xl overflow-hidden border border-gray-800 hover:border-brand-500/50 transition-all flex flex-col justify-between shadow-xl"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-950">
                  <Image
                    src={getImageUrl(m.poster_path, 'w500')}
                    alt={m.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 20vw"
                    className="object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute top-2 right-2 bg-gray-950/80 backdrop-blur-md px-2 py-1 rounded-lg text-amber-400 font-bold text-xs flex items-center space-x-1 border border-gray-800">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{m.vote_average?.toFixed(1)}</span>
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <h3 className="font-extrabold text-xs text-white group-hover:text-brand-300 transition line-clamp-1">{m.title}</h3>
                  <p className="text-[11px] text-gray-400">{m.release_date}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No matching titles found for this mood right now.</p>
        )}
      </div>
    </div>
  );
}
