'use client';

import React, { useState } from 'react';
import { Award, Sparkles, CheckCircle } from 'lucide-react';

export default function AwardsPredictorPage() {
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);

  const contenders = [
    { title: 'Oppenheimer', odds: '45% Probability', director: 'Christopher Nolan' },
    { title: 'Dune: Part Two', odds: '25% Probability', director: 'Denis Villeneuve' },
    { title: 'Poor Things', odds: '15% Probability', director: 'Yorgos Lanthimos' },
    { title: 'Killers of the Flower Moon', odds: '15% Probability', director: 'Martin Scorsese' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-2">
        <div className="flex items-center space-x-2">
          <Award className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Film Awards Prediction Engine & Community Ballot</h1>
        </div>
        <p className="text-gray-400 text-sm">Predict Academy Award Best Picture winners and simulate Oscar ballots.</p>
      </div>

      <div className="space-y-4">
        {contenders.map((c) => (
          <div
            key={c.title}
            onClick={() => setSelectedWinner(c.title)}
            className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              selectedWinner === c.title
                ? 'bg-brand-600/20 border-brand-500 shadow-xl'
                : 'bg-gray-900/80 border-gray-800 hover:border-brand-500/40'
            }`}
          >
            <div>
              <h3 className="font-extrabold text-lg text-white">{c.title}</h3>
              <p className="text-xs text-gray-400">Directed by {c.director}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">{c.odds}</span>
              {selectedWinner === c.title && <CheckCircle className="w-5 h-5 text-brand-400" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
