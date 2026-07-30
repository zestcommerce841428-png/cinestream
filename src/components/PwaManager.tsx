'use client';

import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

const DISMISS_KEY = 'pwa_install_dismissed';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PwaManager() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      if (localStorage.getItem(DISMISS_KEY)) return;
      if (window.matchMedia('(display-mode: standalone)').matches) return;
      setInstallEvent(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setVisible(false);
  };

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // localStorage may be unavailable (private mode); dismissing for this session is fine.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 sm:w-80 z-50 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-4 flex items-start space-x-3 animate-fadeIn">
      <div className="p-2 rounded-xl bg-brand-600/20 border border-brand-500/40 text-brand-400">
        <Download className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-white">Install CineStream</p>
        <p className="text-xs text-gray-400 mt-0.5">
          Add to your home screen for offline watchlist access and a faster, app-like experience.
        </p>
        <div className="flex items-center space-x-2 mt-3">
          <button
            onClick={install}
            className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition"
          >
            Install
          </button>
          <button
            onClick={dismiss}
            className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition"
          >
            Not now
          </button>
        </div>
      </div>
      <button onClick={dismiss} aria-label="Dismiss install prompt" className="text-gray-500 hover:text-gray-300">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
