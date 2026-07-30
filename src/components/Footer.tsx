import React from 'react';
import Link from 'next/link';
import { Film } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-800/80 bg-dark-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">

        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-rose-500 flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-wide">CineStream</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Next-generation movie and TV platform powered by Next.js 16.2+ App Router, Tailwind CSS, and TMDB&apos;s API.
          </p>
        </div>

        {/* Feature Hubs */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Cinema Showcase</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/inflation-calculator" className="text-emerald-400 font-bold hover:underline">Inflation Calculator 💰</Link></li>
            <li><Link href="/collaborations" className="hover:text-white transition">Director-Actor Duos</Link></li>
            <li><Link href="/aspect-ratios" className="hover:text-white transition">Aspect Ratios & Specs</Link></li>
            <li><Link href="/awards-predictor" className="hover:text-white transition">Awards Predictor</Link></li>
            <li><Link href="/wallpapers" className="text-brand-400 font-bold hover:underline">4K Wallpapers 🖼️</Link></li>
            <li><Link href="/streaming-matrix" className="hover:text-white transition">Streaming Matrix</Link></li>
            <li><Link href="/franchises-analytics" className="hover:text-white transition">Franchise Analytics</Link></li>
          </ul>
        </div>

        {/* Television & Schedule */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">TV & Schedule</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/timezones" className="hover:text-white transition">Broadcast Timezones</Link></li>
            <li><Link href="/release-calendar" className="text-brand-400 font-bold hover:underline">Global Release Calendar 📅</Link></li>
            <li><Link href="/airing-today" className="hover:text-white transition">Airing Today Schedule</Link></li>
            <li><Link href="/on-the-air" className="hover:text-white transition">On The Air TV Series</Link></li>
            <li><Link href="/networks" className="hover:text-white transition">TV Networks Directory</Link></li>
            <li><Link href="/languages" className="hover:text-white transition">Global World Cinema</Link></li>
            <li><Link href="/popular-people" className="hover:text-white transition">Popular People & Actors</Link></li>
          </ul>
        </div>

        {/* Discovery Tools (added with the six-degrees/franchise-guides/etc. batch) */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Discovery Tools</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/hidden-gems" className="hover:text-white transition">Hidden Gems</Link></li>
            <li><Link href="/this-day" className="text-brand-400 font-bold hover:underline">This Day in Film History 📅</Link></li>
            <li><Link href="/underrated-overrated" className="hover:text-white transition">Underrated & Overrated</Link></li>
            <li><Link href="/box-office-flops" className="hover:text-white transition">Biggest Box Office Flops</Link></li>
            <li><Link href="/six-degrees" className="text-brand-400 font-bold hover:underline">Six Degrees of Separation</Link></li>
            <li><Link href="/franchise-guides" className="hover:text-white transition">Franchise Viewing Order Guides</Link></li>
            <li><Link href="/sequel-tracker" className="hover:text-white transition">Sequel Tracker</Link></li>
          </ul>
        </div>

        {/* Industry & Tools */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Industry & Tools</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/jobs" className="hover:text-white transition">Production Jobs Guide</Link></li>
            <li><Link href="/countries-catalog" className="hover:text-white transition">Countries Catalog</Link></li>
            <li><Link href="/directorial-debuts" className="hover:text-white transition">Directorial Debuts</Link></li>
            <li><Link href="/guest-sessions" className="text-brand-400 font-bold hover:underline">Guest Sessions & Ratings</Link></li>
            <li><Link href="/ai-recommendations" className="text-brand-400 font-bold hover:underline">AI Mood Recommender (70+)</Link></li>
            <li><Link href="/box-office-predictor" className="text-emerald-400 font-bold hover:underline">Box Office Predictor 💰</Link></li>
            <li><Link href="/trivia" className="text-amber-400 font-bold hover:underline">Movie Trivia Game 🏆</Link></li>
          </ul>
        </div>

        {/* Your Library (localStorage-backed personal tracking) */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Your Library</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/watchlist" className="hover:text-white transition">Watchlist</Link></li>
            <li><Link href="/continue-watching" className="text-brand-400 font-bold hover:underline">Continue Watching</Link></li>
            <li><Link href="/history" className="hover:text-white transition">Viewing History</Link></li>
            <li><Link href="/my-ratings" className="hover:text-white transition">My Ratings</Link></li>
            <li><Link href="/watch-analytics" className="hover:text-white transition">Watch Statistics</Link></li>
            <li><Link href="/api-explorer" className="text-brand-400 font-bold hover:underline">TMDB Endpoints Playground</Link></li>
            <li><a href="https://developer.themoviedb.org" target="_blank" rel="noreferrer" className="hover:text-white transition">TMDB Documentation</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-800/60 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
        <p>© {new Date().getFullYear()} CineStream. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Migrated & Modernized with Next.js 16.2+ & Tailwind CSS</p>
      </div>
    </footer>
  );
}
