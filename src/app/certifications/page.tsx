'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Film, Tv } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';

export default function CertificationsPage() {
  const [movieCerts, setMovieCerts] = useState<Record<string, any[]>>({});
  const [tvCerts, setTvCerts] = useState<Record<string, any[]>>({});
  const [activeCountry, setActiveCountry] = useState('US');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCerts() {
      try {
        const [mRes, tRes] = await Promise.all([
          tmdbClient.getMovieCertifications(),
          tmdbClient.getTVCertifications()
        ]);
        setMovieCerts(mRes.certifications || {});
        setTvCerts(tRes.certifications || {});
      } catch (e) {
        console.error('Failed loading certifications', e);
      } finally {
        setLoading(false);
      }
    }
    loadCerts();
  }, []);

  const countries = ['US', 'GB', 'CA', 'DE', 'FR', 'IN', 'JP', 'AU'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-8 h-8 text-brand-500" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Content Age Certifications Guide</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">Official MPAA and international age rating systems guide for film and television.</p>
        </div>

        <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-800 self-start sm:self-auto">
          {countries.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCountry(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                activeCountry === c ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Movie Certifications */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Film className="w-5 h-5 text-brand-500" />
          <span>Movie Ratings ({activeCountry})</span>
        </h2>

        {movieCerts[activeCountry] ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {movieCerts[activeCountry].map((cert: any) => (
              <div key={cert.certification} className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 space-y-1">
                <span className="inline-block px-2.5 py-1 bg-brand-600/20 text-brand-400 border border-brand-500/30 text-xs font-extrabold rounded-lg">
                  {cert.certification}
                </span>
                <p className="text-xs text-gray-300 leading-normal pt-1">{cert.meaning}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No movie ratings data available for {activeCountry}.</p>
        )}
      </div>

      {/* TV Certifications */}
      <div className="space-y-4 pt-6 border-t border-gray-800">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Tv className="w-5 h-5 text-purple-400" />
          <span>TV Series Ratings ({activeCountry})</span>
        </h2>

        {tvCerts[activeCountry] ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tvCerts[activeCountry].map((cert: any) => (
              <div key={cert.certification} className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 space-y-1">
                <span className="inline-block px-2.5 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-extrabold rounded-lg">
                  {cert.certification}
                </span>
                <p className="text-xs text-gray-300 leading-normal pt-1">{cert.meaning}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No TV ratings data available for {activeCountry}.</p>
        )}
      </div>
    </div>
  );
}
