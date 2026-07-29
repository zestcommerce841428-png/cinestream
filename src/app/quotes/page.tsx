'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, RefreshCw, Copy, Check } from 'lucide-react';

export default function QuotesPage() {
  const [copied, setCopied] = useState(false);
  const [index, setIndex] = useState(0);

  const quotesList = [
    { quote: "May the Force be with you.", movie: "Star Wars", movieId: 11 },
    { quote: "I'm going to make him an offer he can't refuse.", movie: "The Godfather", movieId: 238 },
    { quote: "Why so serious?", movie: "The Dark Knight", movieId: 155 },
    { quote: "There's no place like home.", movie: "The Wizard of Oz", movieId: 630 },
    { quote: "Here's looking at you, kid.", movie: "Casablanca", movieId: 289 },
    { quote: "Keep your friends close, but your enemies closer.", movie: "The Godfather Part II", movieId: 240 },
    { quote: "The first rule of Fight Club is: You do not talk about Fight Club.", movie: "Fight Club", movieId: 550 },
  ];

  const current = quotesList[index];

  const handleNext = () => {
    setIndex((i) => (i + 1) % quotesList.length);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${current.quote}" — ${current.movie}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-center">
      <div className="space-y-3">
        <div className="w-16 h-16 rounded-full bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center mx-auto shadow-xl">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Famous Movie Quotes Generator</h1>
        <p className="text-gray-400 text-sm">Discover iconic cinema dialogue and famous character lines.</p>
      </div>

      <div className="bg-gray-900/80 p-10 rounded-3xl border border-gray-800 space-y-6">
        <p className="text-2xl sm:text-3xl font-extrabold text-white leading-relaxed">&ldquo;{current.quote}&rdquo;</p>
        <Link href={`/movie/${current.movieId}`} className="inline-block text-sm font-bold text-brand-400 hover:underline">
          — {current.movie}
        </Link>

        <div className="flex items-center justify-center space-x-3 pt-4 border-t border-gray-800">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs font-semibold text-gray-300 hover:text-white transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Quote'}</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Next Quote</span>
          </button>
        </div>
      </div>
    </div>
  );
}
