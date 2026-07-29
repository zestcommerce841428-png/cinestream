'use client';

import React, { useEffect, useState } from 'react';
import { Clock, Globe } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';

export default function TimezonesPage() {
  const [timezones, setTimezones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTimezones() {
      setLoading(true);
      try {
        const res = await tmdbClient.getTimezones();
        setTimezones(res || []);
      } catch (e) {
        console.error('Failed loading timezones', e);
      } finally {
        setLoading(false);
      }
    }
    loadTimezones();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Clock className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Global Cinema Timezones & Regional Broadcast Times</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Official broadcast timezones for international television airings.</p>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading timezones...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {timezones.slice(0, 40).map((tz, idx) => (
            <div key={idx} className="bg-gray-900/60 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
              <span className="font-bold text-xs text-white">{tz.iso_3166_1}</span>
              <span className="text-xs text-gray-400 truncate max-w-[200px]">{tz.zones?.join(', ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
