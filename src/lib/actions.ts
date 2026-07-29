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
