'use server';

// Thin Server Actions that let client components (CommandMenu, auth, tool pages) reach
// TMDB without ever shipping TMDB_API_KEY to the browser. Each action runs on the server;
// the client only ever sees the JSON result.

import { tmdbClient } from '@/services/tmdb';
import { tmdbAuthClient } from '@/services/tmdbAuth';

export async function searchMultiAction(query: string) {
  if (!query.trim()) return { results: [] };
  return tmdbClient.searchMulti(query);
}

export async function createGuestSessionAction() {
  return tmdbClient.createGuestSession();
}

export async function createRequestTokenAction() {
  return tmdbAuthClient.createRequestToken();
}

export async function createSessionAction(requestToken: string) {
  return tmdbAuthClient.createSession(requestToken);
}

export async function deleteSessionAction(sessionId: string) {
  return tmdbAuthClient.deleteSession(sessionId);
}

export async function getAccountDataAction(sessionId: string) {
  const account = await tmdbAuthClient.getAccountDetails(sessionId);
  if (!account?.id) return { account: null };

  const [favorites, ratings, watchlist, lists, ratedEpisodes] = await Promise.all([
    tmdbAuthClient.getFavoriteMovies(account.id, sessionId),
    tmdbAuthClient.getRatedMovies(account.id, sessionId),
    tmdbAuthClient.getAccountWatchlistMovies(account.id, sessionId),
    tmdbAuthClient.getAccountLists(account.id, sessionId),
    tmdbAuthClient.getRatedEpisodes(account.id, sessionId),
  ]);

  return {
    account,
    favorites: favorites.results || [],
    ratings: ratings.results || [],
    watchlist: watchlist.results || [],
    lists: lists.results || [],
    ratedEpisodes: ratedEpisodes.results || [],
  };
}

export async function createCustomListAction(name: string, description: string, sessionId: string) {
  return tmdbAuthClient.createCustomList(name, description, 'en', sessionId);
}

export async function clearListAction(listId: string, sessionId: string) {
  return tmdbAuthClient.clearList(listId, sessionId);
}

export async function deleteListAction(listId: string, sessionId: string) {
  return tmdbAuthClient.deleteList(listId, sessionId);
}

export async function rateMovieAction(movieId: number, sessionId: string, rating: number) {
  return tmdbAuthClient.rateMovie(movieId, sessionId, rating);
}

/**
 * Builds a lightweight taste profile from the caller's (localStorage) watchlist and
 * returns a personalized discover feed. The watchlist only stores id/type/title/poster,
 * not genres, so this fetches genres for the most recently added items, tallies them
 * per media type (movie and TV genre IDs are different namespaces), and discovers against
 * the top genres in each — capped and de-duplicated against the watchlist itself.
 */
export async function getForYouRecommendationsAction(items: { id: number; type: 'movie' | 'tv' }[]) {
  const sample = items.slice(-10);
  if (sample.length === 0) return [];

  const details = await Promise.all(
    sample.map((it) =>
      (it.type === 'movie' ? tmdbClient.getMovieDetails(it.id) : tmdbClient.getTVDetails(it.id)).catch(() => null)
    )
  );

  const movieGenreTally = new Map<number, number>();
  const tvGenreTally = new Map<number, number>();
  details.forEach((d, idx) => {
    if (!d?.genres) return;
    const tally = sample[idx].type === 'movie' ? movieGenreTally : tvGenreTally;
    for (const g of d.genres as { id: number }[]) tally.set(g.id, (tally.get(g.id) || 0) + 1);
  });

  const topGenres = (tally: Map<number, number>, n: number) =>
    [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([id]) => id);

  const topMovieGenres = topGenres(movieGenreTally, 2);
  const topTVGenres = topGenres(tvGenreTally, 2);
  const excludeIds = new Set(items.map((i) => `${i.type}-${i.id}`));

  const [movieRes, tvRes] = await Promise.all([
    topMovieGenres.length
      ? tmdbClient.discoverMovies({ with_genres: topMovieGenres.join(','), sort_by: 'popularity.desc' })
      : Promise.resolve({ results: [] as any[] }),
    topTVGenres.length
      ? tmdbClient.discoverTV({ with_genres: topTVGenres.join(','), sort_by: 'popularity.desc' })
      : Promise.resolve({ results: [] as any[] }),
  ]);

  return [
    ...movieRes.results.map((m: any) => ({ ...m, media_type: 'movie' })),
    ...tvRes.results.map((t: any) => ({ ...t, media_type: 'tv' })),
  ]
    .filter((r) => !excludeIds.has(`${r.media_type}-${r.id}`))
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 12);
}
