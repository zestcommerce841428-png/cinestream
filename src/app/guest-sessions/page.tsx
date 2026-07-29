'use client';

import React, { useState } from 'react';
import { UserCheck, Key, RefreshCw, Star } from 'lucide-react';
import { tmdbClient } from '@/services/tmdb';

export default function GuestSessionsPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const createSession = async () => {
    setLoading(true);
    try {
      const res = await tmdbClient.createGuestSession();
      if (res.success) {
        setSessionId(res.guest_session_id);
        setExpiresAt(res.expires_at);
      }
    } catch (e) {
      console.error('Failed creating guest session', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-800 pb-6 space-y-2">
        <div className="flex items-center space-x-2">
          <UserCheck className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Guest Authentication & User Ratings Manager</h1>
        </div>
        <p className="text-gray-400 text-sm">Generate temporary guest authentication tokens to submit user ratings and reviews.</p>
      </div>

      <div className="bg-gray-900/80 p-8 rounded-3xl border border-gray-800 space-y-6 text-center">
        {!sessionId ? (
          <div className="space-y-4">
            <Key className="w-12 h-12 text-gray-600 mx-auto" />
            <h2 className="text-xl font-bold text-white">No Active Guest Session</h2>
            <p className="text-xs text-gray-400 max-w-md mx-auto">Create a guest session to rate movies and episodes without needing a full account.</p>
            <button
              onClick={createSession}
              disabled={loading}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg disabled:opacity-50 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Generate Guest Session Token</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-left font-mono text-xs">
            <div className="p-4 bg-gray-950 rounded-2xl border border-emerald-500/40 space-y-2">
              <span className="text-emerald-400 font-bold">Active Guest Session Generated!</span>
              <p className="text-gray-200"><strong>Session ID:</strong> {sessionId}</p>
              <p className="text-gray-400"><strong>Expires At:</strong> {expiresAt}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
