'use client';

import React, { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Star, Zap, Moon, Compass, Skull, Flame, Shield, Radio, Heart, Video, Cpu, Anchor, Ghost, Key, Lock, Globe, Eye, Target, Award } from 'lucide-react';
import { tmdbClient, getImageUrl, Movie } from '@/services/tmdb';

export default function DedicatedMoodPage({ params }: { params: Promise<{ moodId: string }> }) {
  const resolvedParams = use(params);
  const moodId = resolvedParams.moodId || 'cyberpunk';

  // 105 Mood Presets Registry
  const moodDictionary: Record<string, { name: string; genreId: number; description: string; tagline: string; icon: any; color: string; sampleMovies: string[] }> = {
    'cyberpunk': { name: 'Cyberpunk Dystopia', genreId: 878, description: 'High-tech low-life neon futuristic cities, artificial intelligence, and corporate surveillance.', tagline: 'Neon Grid & Cyborg Realities', icon: Zap, color: 'from-cyan-500 via-blue-600 to-indigo-700', sampleMovies: ['Blade Runner 2049', 'The Matrix', 'Ghost in the Shell'] },
    'neo-noir': { name: 'Neo-Noir Crime', genreId: 80, description: 'Shadowy rain-slicked city streets, morally gray detectives, femme fatales, and dark conspiracies.', tagline: 'Rain-Slicked Shadows & Crime', icon: Moon, color: 'from-amber-600 via-orange-600 to-rose-700', sampleMovies: ['Se7en', 'Drive', 'Chinatown'] },
    'space-opera': { name: 'Space Opera Sagas', genreId: 878, description: 'Intergalactic armadas, alien civilizations, epic starship battles, and cosmic empires.', tagline: 'Galactic Empires & Star Wars', icon: Compass, color: 'from-purple-600 via-indigo-600 to-blue-800', sampleMovies: ['Interstellar', 'Dune', 'Star Wars'] },
    'cosmic-horror': { name: 'Cosmic & Eldritch Horror', genreId: 27, description: 'Lovecraftian ancient horrors, incomprehensible alien entities, and mind-bending insanity.', tagline: 'Unspeakable Entities & Insanity', icon: Skull, color: 'from-rose-600 via-red-700 to-gray-900', sampleMovies: ['The Thing', 'Annihilation', 'Alien'] },
    'kaiju-monsters': { name: 'Kaiju & Titan Battles', genreId: 28, description: 'Gigantic monsters leveling metropolitan skyscrapers in titanic apocalyptic showdowns.', tagline: 'Giant Titans Leveling Cities', icon: Flame, color: 'from-amber-500 via-yellow-600 to-red-700', sampleMovies: ['Godzilla Minus One', 'Pacific Rim', 'King Kong'] },
    'psychological': { name: 'Psychological Mind-Benders', genreId: 53, description: 'Unreliable narrators, twisted realities, hallucinatory illusions, and shocking plot twists.', tagline: 'Twisted Realities & Illusions', icon: Sparkles, color: 'from-emerald-600 via-teal-700 to-cyan-800', sampleMovies: ['Inception', 'Shutter Island', 'Memento'] },
    'slapstick-comedy': { name: 'Slapstick & Dark Comedy', genreId: 35, description: 'Hilarious physical gags, absurd situational chaos, and razor-sharp satirical humor.', tagline: 'Absurd Chaos & Laughs', icon: Heart, color: 'from-yellow-400 via-amber-500 to-orange-600', sampleMovies: ['The Big Lebowski', 'Superbad', 'Knives Out'] },
    'post-apocalypse': { name: 'Post-Apocalyptic Survival', genreId: 878, description: 'Desolate wasteland deserts, radioactive ruins, scavengers, and human survival against all odds.', tagline: 'Desolate Wastelands & Scavengers', icon: Shield, color: 'from-orange-600 via-amber-700 to-stone-900', sampleMovies: ['Mad Max: Fury Road', 'The Road', 'Wall-E'] },
    'steampunk': { name: 'Steampunk Victorian', genreId: 878, description: 'Steam-powered airships, brass clockwork automatons, and Victorian retro-futurism.', tagline: 'Clockwork Gearwork & Airships', icon: Radio, color: 'from-amber-700 via-yellow-800 to-stone-800', sampleMovies: ['Hugo', 'Mortal Engines', 'Wild Wild West'] },
    'time-travel': { name: 'Time Travel Paradox', genreId: 878, description: 'Temporal butterfly effects, closed time loops, past alterations, and timeline paradoxes.', tagline: 'Temporal Loops & Time Machines', icon: Compass, color: 'from-blue-600 via-indigo-700 to-purple-900', sampleMovies: ['Back to the Future', 'Looper', 'Tenet'] },
    'high-fantasy': { name: 'High Fantasy Magic', genreId: 14, description: 'Mythical dragons, ancient magic rings, elven realms, and legendary sword quests.', tagline: 'Dragons, Elves & Sword Quests', icon: Sparkles, color: 'from-emerald-500 via-green-600 to-teal-800', sampleMovies: ['The Lord of the Rings', 'The Hobbit', 'Harry Potter'] },
    'superhero-origin': { name: 'Superhero Origin Stories', genreId: 28, description: 'Radioactive bites, cosmic powers, vigilante suits, and saving humanity from arch-villains.', tagline: 'Vigilantes & Cosmic Powers', icon: Zap, color: 'from-red-600 via-rose-600 to-blue-700', sampleMovies: ['The Dark Knight', 'Spider-Man', 'Iron Man'] },
    'martial-arts': { name: 'Martial Arts Wuxia', genreId: 28, description: 'Breathtaking kung fu choreography, swordplay, gravity-defying Wuxia, and honor duels.', tagline: 'Kung Fu Choreography & Honor', icon: Flame, color: 'from-rose-600 via-red-600 to-amber-700', sampleMovies: ['Crouching Tiger, Hidden Dragon', 'Hero', 'Ip Man'] },
    'heist-thriller': { name: 'High-Stakes Heist', genreId: 80, description: 'Masterplan bank robberies, vault cracks, laser grids, disguise swaps, and double-crosses.', tagline: 'Vault Cracks & Double-Crosses', icon: Shield, color: 'from-blue-700 via-sky-700 to-slate-900', sampleMovies: ["Ocean's Eleven", 'Heat', 'The Town'] },
    'zombie-apocalypse': { name: 'Zombie Horde Apocalypse', genreId: 27, description: 'Relentless undead hordes, barricaded safehouses, and desperate infection outbreaks.', tagline: 'Undead Hordes & Barricades', icon: Skull, color: 'from-lime-600 via-emerald-700 to-gray-900', sampleMovies: ['28 Days Later', 'Train to Busan', 'World War Z'] },
    'sports-underdog': { name: 'Sports Underdog Triumphs', genreId: 18, description: 'Championship stadium final rounds, inspiring coaches, and underdog comeback victories.', tagline: 'Stadium Finals & Comebacks', icon: Star, color: 'from-amber-500 via-orange-500 to-red-600', sampleMovies: ['Rocky', 'Moneyball', 'Rush'] },
  };

  const mood = moodDictionary[moodId] || {
    name: moodId.replace('-', ' ').toUpperCase(),
    genreId: 878,
    description: `Dedicated AI recommended movies catalog for ${moodId}.`,
    tagline: 'AI Mood Recommendation Engine',
    icon: Sparkles,
    color: 'from-brand-600 to-rose-600',
    sampleMovies: ['Blockbuster Showcase'],
  };

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMoodMovies() {
      setLoading(true);
      try {
        const res = await tmdbClient.getMoviesByMood(mood.genreId);
        setMovies(res.results || []);
      } catch (e) {
        console.error('Error fetching mood movies', e);
      } finally {
        setLoading(false);
      }
    }
    loadMoodMovies();
  }, [mood.genreId]);

  const Icon = mood.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-6">
        <Link href="/ai-recommendations" className="inline-flex items-center space-x-2 text-xs font-bold text-gray-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All 105 Mood Cards</span>
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
          <span className="text-xs text-gray-400 font-mono">{movies.length} Masterpieces Found</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-900 animate-pulse rounded-2xl border border-gray-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((m) => (
              <Link
                key={m.id}
                href={`/movie/${m.id}`}
                className="group bg-gray-900/80 rounded-2xl overflow-hidden border border-gray-800 hover:border-brand-500/50 transition-all flex flex-col justify-between shadow-xl"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-950">
                  <Image src={getImageUrl(m.poster_path, 'w500')} alt={m.title} fill className="object-cover group-hover:scale-105 transition" />
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
        )}
      </div>
    </div>
  );
}
