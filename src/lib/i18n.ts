// Client-and-server-safe language data. Kept free of 'next/headers' so the language
// switcher (a client component) can import it directly — see i18n-server.ts for the
// cookie-reading half of this that only server code may import.
export interface SupportedLanguage {
  code: string;
  label: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en-US', label: 'English', flag: '🇺🇸' },
  { code: 'es-ES', label: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', label: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it-IT', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
  { code: 'ja-JP', label: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', label: '한국어', flag: '🇰🇷' },
  { code: 'hi-IN', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'zh-CN', label: '中文', flag: '🇨🇳' },
];

export const DEFAULT_LANGUAGE = 'en-US';
export const LANG_COOKIE = 'tmdb_lang';

export function isSupportedLanguage(code: string | undefined | null): code is string {
  return !!code && SUPPORTED_LANGUAGES.some((l) => l.code === code);
}
