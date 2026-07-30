import { tmdbClient } from '@/services/tmdb';

/**
 * Resolves a keyword name (e.g. "true story") to its numeric TMDB keyword ID via
 * search, rather than hardcoding IDs — a hardcoded keyword ID silently pointed at the
 * wrong keyword in this codebase before (sub-genres page, shared "Found Footage" /
 * "Spaghetti Western" IDs) and was hard to notice since the page still rendered results,
 * just for the wrong topic. Resolving at request time avoids that failure mode entirely;
 * the result is still cheap since the underlying fetch is cached (see tmdbFetch).
 */
export async function resolveKeywordId(query: string): Promise<number | null> {
  try {
    const res = await tmdbClient.searchKeywords(query);
    const lower = query.toLowerCase();
    const exact = res.results?.find((k: { id: number; name: string }) => k.name.toLowerCase() === lower);
    return (exact ?? res.results?.[0])?.id ?? null;
  } catch {
    return null;
  }
}
