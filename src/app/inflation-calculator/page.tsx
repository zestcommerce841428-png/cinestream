'use client';

import React, { useState } from 'react';
import { DollarSign, Calculator, TrendingUp } from 'lucide-react';

export default function InflationCalculatorPage() {
  const [amount, setAmount] = useState(100000000);
  const [releaseYear, setReleaseYear] = useState(1993);

  const calculateAdjusted = () => {
    const baseMultiplier = 2026 / releaseYear;
    return amount * Math.pow(1.032, 2026 - releaseYear);
  };

  const adjusted = calculateAdjusted();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-2">
        <div className="flex items-center space-x-2">
          <Calculator className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Historical Movie Budget & Revenue Inflation Calculator</h1>
        </div>
        <p className="text-gray-400 text-sm">Calculate historical production budgets and box office gross adjusted for 2026 inflation.</p>
      </div>

      <div className="bg-gray-900/80 p-8 rounded-3xl border border-gray-800 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300">Original Amount ($ USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-brand-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300">Release Year (1920 - 2025)</label>
            <input
              type="number"
              value={releaseYear}
              onChange={(e) => setReleaseYear(Number(e.target.value))}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-brand-500 outline-none"
            />
          </div>
        </div>

        <div className="p-6 bg-gray-950 rounded-2xl border border-emerald-500/30 text-center space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Adjusted 2026 Purchasing Power</span>
          <p className="text-4xl font-extrabold text-emerald-400 font-mono">${(adjusted / 1000000).toFixed(2)} Million USD</p>
          <p className="text-xs text-gray-500">Compounded cumulative inflation multiplier: {(adjusted / amount).toFixed(2)}x</p>
        </div>
      </div>
    </div>
  );
}
