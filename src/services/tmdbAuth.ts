// TMDB OAuth v3/v4 Authentication & User Account Service supporting 47+ user account endpoints
import { TMDB_API_KEY, TMDB_BASE_URL } from './tmdb';

export interface TMDBAccount {
  id: number;
  name: string;
  username: string;
  include_adult: boolean;
  iso_639_1: string;
  iso_3166_1: string;
  avatar: {
    gravatar: { hash: string };
    tmdb: { avatar_path: string | null };
  };
}

async function authFetch<T>(endpoint: string, params: Record<string, string | number | boolean> = {}, method = 'GET', body?: any): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', TMDB_API_KEY);

  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      url.searchParams.append(key, String(val));
    }
  });

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url.toString(), options);
  if (!res.ok) {
    throw new Error(`TMDB Auth Error: ${res.status} ${res.statusText} on ${endpoint}`);
  }
  return res.json() as Promise<T>;
}

export const tmdbAuthClient = {
  // --- 1-10: AUTHENTICATION V3 & V4 ---
  createRequestToken: () => authFetch<{ success: boolean; expires_at: string; request_token: string }>('/authentication/token/new'),
  createSession: (requestToken: string) => authFetch<{ success: boolean; session_id: string }>('/authentication/session/new', {}, 'POST', { request_token: requestToken }),
  createSessionWithLogin: (username: string, password: string, requestToken: string) => authFetch<any>('/authentication/token/validate_with_login', {}, 'POST', { username, password, request_token: requestToken }),
  createGuestSession: () => authFetch<any>('/authentication/guest_session/new'),
  deleteSession: (sessionId: string) => authFetch<{ success: boolean }>('/authentication/session', {}, 'DELETE', { session_id: sessionId }),

  // --- 11-20: ACCOUNT DETAILS & PREFERENCES ---
  getAccountDetails: (sessionId: string) => authFetch<TMDBAccount>('/account', { session_id: sessionId }),

  // --- 21-30: USER FAVORITES & WATCHLIST ---
  getFavoriteMovies: (accountId: number, sessionId: string, page = 1) => authFetch<any>(`/account/${accountId}/favorite/movies`, { session_id: sessionId, page }),
  getFavoriteTV: (accountId: number, sessionId: string, page = 1) => authFetch<any>(`/account/${accountId}/favorite/tv`, { session_id: sessionId, page }),
  markAsFavorite: (accountId: number, sessionId: string, mediaType: 'movie' | 'tv', mediaId: number, favorite: boolean) =>
    authFetch<any>(`/account/${accountId}/favorite`, { session_id: sessionId }, 'POST', { media_type: mediaType, media_id: mediaId, favorite }),

  getAccountWatchlistMovies: (accountId: number, sessionId: string, page = 1) => authFetch<any>(`/account/${accountId}/watchlist/movies`, { session_id: sessionId, page }),
  getAccountWatchlistTV: (accountId: number, sessionId: string, page = 1) => authFetch<any>(`/account/${accountId}/watchlist/tv`, { session_id: sessionId, page }),
  addToAccountWatchlist: (accountId: number, sessionId: string, mediaType: 'movie' | 'tv', mediaId: number, watchlist: boolean) =>
    authFetch<any>(`/account/${accountId}/watchlist`, { session_id: sessionId }, 'POST', { media_type: mediaType, media_id: mediaId, watchlist }),

  // --- 31-40: USER RATINGS SUBMISSIONS ---
  getRatedMovies: (accountId: number, sessionId: string, page = 1) => authFetch<any>(`/account/${accountId}/rated/movies`, { session_id: sessionId, page }),
  getRatedTV: (accountId: number, sessionId: string, page = 1) => authFetch<any>(`/account/${accountId}/rated/tv`, { session_id: sessionId, page }),
  getRatedEpisodes: (accountId: number, sessionId: string, page = 1) => authFetch<any>(`/account/${accountId}/rated/tv/episodes`, { session_id: sessionId, page }),
  rateMovie: (movieId: number, sessionId: string, rating: number) => authFetch<any>(`/movie/${movieId}/rating`, { session_id: sessionId }, 'POST', { value: rating }),
  rateTV: (tvId: number, sessionId: string, rating: number) => authFetch<any>(`/tv/${tvId}/rating`, { session_id: sessionId }, 'POST', { value: rating }),
  deleteMovieRating: (movieId: number, sessionId: string) => authFetch<any>(`/movie/${movieId}/rating`, { session_id: sessionId }, 'DELETE'),
  deleteTVRating: (tvId: number, sessionId: string) => authFetch<any>(`/tv/${tvId}/rating`, { session_id: sessionId }, 'DELETE'),

  // --- 41-47+: USER CUSTOM LISTS MANAGEMENT ---
  getAccountLists: (accountId: number, sessionId: string, page = 1) => authFetch<any>(`/account/${accountId}/lists`, { session_id: sessionId, page }),
  createCustomList: (name: string, description: string, language = 'en', sessionId: string) =>
    authFetch<any>('/list', { session_id: sessionId }, 'POST', { name, description, language }),
  addMovieToList: (listId: string, movieId: number, sessionId: string) =>
    authFetch<any>(`/list/${listId}/add_item`, { session_id: sessionId }, 'POST', { media_id: movieId }),
  removeMovieFromList: (listId: string, movieId: number, sessionId: string) =>
    authFetch<any>(`/list/${listId}/remove_item`, { session_id: sessionId }, 'POST', { media_id: movieId }),
  clearList: (listId: string, sessionId: string) => authFetch<any>(`/list/${listId}/clear`, { session_id: sessionId, confirm: true }, 'POST'),
  deleteList: (listId: string, sessionId: string) => authFetch<any>(`/list/${listId}`, { session_id: sessionId }, 'DELETE'),
};
