'use client';

import React, { useEffect, useState } from 'react';
import { Briefcase, UserCheck } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      try {
        const res = await tmdbClient.getJobs();
        setJobs(res || []);
      } catch (e) {
        console.error('Failed loading crew jobs', e);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Film Production Jobs & Department Guide</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1">Official industry crew job titles, department structures, and roles.</p>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading film production jobs...</div>
      ) : (
        <div className="space-y-6">
          {jobs.map((dept, idx) => (
            <div key={idx} className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 space-y-3">
              <h3 className="text-lg font-bold text-brand-400">{dept.department} Department</h3>
              <div className="flex flex-wrap gap-2">
                {dept.jobs?.map((j: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-gray-950 rounded-xl border border-gray-800 text-xs font-semibold text-gray-300">
                    {j}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
