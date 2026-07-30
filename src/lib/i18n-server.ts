import { cookies } from 'next/headers';
import { DEFAULT_LANGUAGE, LANG_COOKIE, isSupportedLanguage } from './i18n';

/**
 * Reads the visitor's chosen content language from the `tmdb_lang` cookie (set
 * client-side by LanguageSwitcher). Calling this — like any Next.js "dynamic API" —
 * opts the calling route out of static generation/ISR into per-request rendering,
 * which is unavoidable for genuinely per-user localized content. Only call it from
 * routes that intentionally accept that trade-off (see LanguageSwitcher's usage notes).
 */
export async function getPreferredLanguage(): Promise<string> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LANG_COOKIE)?.value;
  return isSupportedLanguage(value) ? value : DEFAULT_LANGUAGE;
}
