'use client';

import React, { useState } from 'react';
import { DollarSign, Calculator, TrendingUp, Sparkles } from 'lucide-react';

export default function BoxOfficePredictorPage() {
  const [budget, setBudget] = useState<number>(100000000); // 100M default
  const [openingMultiplier, setOpeningMultiplier] = useState<number>(2.5);

  const estimatedBoxOffice = budget * openingMultiplier;
  const breakEvenPoint = budget * 2.2;
  const netProfitEst = estimatedBoxOffice - breakEvenPoint;
  const isProfitable = netProfitEst > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-2">
        <div className="flex items-center space-x-2">
          <Calculator className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Box Office Profitability & ROI Predictor</h1>
        </div>
        <p className="text-gray-400 text-sm">Calculate break-even thresholds, marketing multipliers, and theatrical ROI estimates for feature films.</p>
      </div>

      <div className="bg-gray-900/80 p-8 rounded-3xl border border-gray-800 space-y-6">
        <div className="space-y-4">
          <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
            Production Budget ($ USD): <span className="text-emerald-400">${budget.toLocaleString()}</span>
          </label>
          <input
            type="range"
            min={1000000}
            max={400000000}
            step={5000000}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-2 bg-gray-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
            Box Office Multiplier Performance: <span className="text-brand-400">{openingMultiplier}x</span>
          </label>
          <input
            type="range"
            min={1.0}
            max={6.0}
            step={0.1}
            value={openingMultiplier}
            onChange={(e) => setOpeningMultiplier(Number(e.target.value))}
            className="w-full h-2 bg-gray-950 rounded-lg appearance-none cursor-pointer accent-brand-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-800">
          <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase">Estimated Box Office</span>
            <p className="text-2xl font-extrabold text-white">${estimatedBoxOffice.toLocaleString()}</p>
          </div>

          <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase">Est. Break-Even Point (2.2x)</span>
            <p className="text-2xl font-extrabold text-amber-400">${breakEvenPoint.toLocaleString()}</p>
          </div>

          <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase">Estimated Studio Net Profit</span>
            <p className={`text-2xl font-extrabold ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${netProfitEst.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
