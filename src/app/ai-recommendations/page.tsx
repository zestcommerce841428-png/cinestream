'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Search, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import { moodPresets } from '@/lib/moods';

export default function AIRecommendationsCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [ambientTheme, setAmbientTheme] = useState<'oled' | 'cyber' | 'matrix' | 'crimson' | 'amethyst'>('oled');

  const themeClasses = {
    oled: 'bg-gray-950 text-gray-100',
    cyber: 'bg-slate-950 text-cyan-100',
    matrix: 'bg-emerald-950/60 text-emerald-100',
    crimson: 'bg-rose-950/60 text-rose-100',
    amethyst: 'bg-purple-950/60 text-purple-100',
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToBottom = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

  const filteredPresets = moodPresets.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tagline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen transition-colors duration-500 ${themeClasses[ambientTheme]}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Header & Theme Switcher Bar */}
        <div className="border-b border-gray-800/80 pb-8 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-rose-500 to-amber-400 flex items-center justify-center shadow-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">AI Mood & Micro-Genre Recommender</h1>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Select from {moodPresets.length} deep cinematic mood presets to open dedicated recommendation pages.</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Count Badge */}
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20">
                {moodPresets.length} Active Mood Presets
              </span>

              {/* Ambient Background Switcher */}
              <div className="flex bg-gray-900/90 p-1 rounded-xl border border-gray-800 text-xs font-bold gap-1">
                <button onClick={() => setAmbientTheme('oled')} className={`p-2 rounded-lg ${ambientTheme === 'oled' ? 'bg-brand-600 text-white' : 'text-gray-400'}`} title="OLED Obsidian">🖤</button>
                <button onClick={() => setAmbientTheme('cyber')} className={`p-2 rounded-lg ${ambientTheme === 'cyber' ? 'bg-cyan-600 text-white' : 'text-gray-400'}`} title="Cyber Neon">🌌</button>
                <button onClick={() => setAmbientTheme('matrix')} className={`p-2 rounded-lg ${ambientTheme === 'matrix' ? 'bg-emerald-600 text-white' : 'text-gray-400'}`} title="Matrix Emerald">🟢</button>
                <button onClick={() => setAmbientTheme('crimson')} className={`p-2 rounded-lg ${ambientTheme === 'crimson' ? 'bg-rose-600 text-white' : 'text-gray-400'}`} title="Crimson Velvet">🔴</button>
                <button onClick={() => setAmbientTheme('amethyst')} className={`p-2 rounded-lg ${ambientTheme === 'amethyst' ? 'bg-purple-600 text-white' : 'text-gray-400'}`} title="Amethyst Royal">💜</button>
              </div>
            </div>
          </div>

          {/* Search Mood Cards */}
          <div className="relative max-w-md pt-2">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-[58%] -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search across all ${moodPresets.length} moods (e.g. Cyberpunk, Kaiju, Space Opera, Samurai)...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900/90 border border-gray-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:border-brand-500 outline-none shadow-lg"
            />
          </div>
        </div>

        {/* Mood Presets Grid — linking to dedicated per-mood pages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPresets.map((preset) => {
            const Icon = preset.icon;
            return (
              <Link
                key={preset.id}
                href={`/ai-recommendations/${preset.id}`}
                className="group relative p-6 sm:p-8 rounded-3xl border border-gray-800/80 hover:border-brand-500/50 bg-gray-900/80 hover:bg-gray-900 transition-all duration-300 overflow-hidden backdrop-blur-xl shadow-xl flex flex-col justify-between hover:-translate-y-1.5"
              >
                <div className={`absolute -right-12 -top-12 w-44 h-44 rounded-full bg-gradient-to-br ${preset.color} opacity-15 blur-2xl group-hover:opacity-30 transition-opacity`} />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${preset.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 bg-gray-950 px-3 py-1 rounded-full border border-gray-800">
                      {preset.tagline}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-extrabold text-white group-hover:text-brand-300 transition">{preset.name}</h3>
                    <p className="text-xs text-gray-300 leading-relaxed">{preset.description}</p>
                  </div>
                </div>

                <div className="pt-6 relative z-10 space-y-3 border-t border-gray-800/80 mt-6">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Key Highlights:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {preset.sampleMovies.map((m, i) => (
                      <span key={i} className="text-[11px] font-semibold text-gray-300 bg-gray-950 px-2.5 py-1 rounded-lg border border-gray-800/80">
                        {m}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 text-xs font-bold text-brand-400 group-hover:text-white transition">
                    <span>Open Dedicated Mood Page</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Floating Scroll Navigation Buttons */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2">
          <button
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center shadow-2xl transition hover:scale-110 border border-brand-400/30"
            title="Scroll to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <button
            onClick={scrollToBottom}
            className="w-12 h-12 rounded-full bg-gray-900 hover:bg-gray-800 text-gray-300 flex items-center justify-center shadow-2xl transition hover:scale-110 border border-gray-800"
            title="Scroll to Bottom"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
