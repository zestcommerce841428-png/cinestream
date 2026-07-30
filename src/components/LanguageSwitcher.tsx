'use client';

import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, LANG_COOKIE, isSupportedLanguage } from '@/lib/i18n';

// Mirrors the useSyncExternalStore + module-level read/write pattern already used by
// WatchlistContext for localStorage — same reasoning applies to the cookie here:
// document.cookie has no native change event, so a custom event bridges same-tab writes.
const CHANGE_EVENT = 'tmdb-lang-changed';

function readLanguageCookie(): string {
  const match = document.cookie.match(/(?:^|; )tmdb_lang=([^;]*)/);
  const value = match ? decodeURIComponent(match[1]) : undefined;
  return isSupportedLanguage(value) ? value : DEFAULT_LANGUAGE;
}

function writeLanguageCookie(code: string) {
  document.cookie = `${LANG_COOKIE}=${code}; path=/; max-age=31536000; SameSite=Lax`;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}

function getServerSnapshot() {
  return DEFAULT_LANGUAGE;
}

export default function LanguageSwitcher() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const current = useSyncExternalStore(subscribe, readLanguageCookie, getServerSnapshot);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const select = (code: string) => {
    writeLanguageCookie(code);
    setOpen(false);
    // Server Components (home, movie/tv/person detail, discover, search, movies, tv)
    // read the cookie on render, so a refresh is enough to re-fetch content in the
    // new language without a full page reload.
    router.refresh();
  };

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === current) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center space-x-1.5 p-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-900 border border-gray-800/80 transition"
        aria-label="Change content language"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline text-xs">{currentLang.flag}</span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 py-1.5 max-h-80 overflow-y-auto custom-scrollbar"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              role="option"
              aria-selected={lang.code === current}
              onClick={() => select(lang.code)}
              className={`w-full flex items-center space-x-2.5 px-3.5 py-2 text-left text-xs font-semibold transition ${
                lang.code === current ? 'text-brand-400 bg-brand-600/10' : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
