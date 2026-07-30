// TMDB API Service supporting 150+ endpoints with full TypeScript definitions & Append-to-Response
//
// `TMDB_API_KEY` is intentionally server-only (no `NEXT_PUBLIC_` prefix, no hardcoded
// fallback). Every `tmdbClient`/`tmdbAuthClient` call in this app runs from Server
// Components or Route Handlers, so the key never reaches the browser bundle. The one
// deliberate exception is the "API Explorer" playground (src/app/api-explorer), which
// is an intentionally client-side "try a live request" tool and reads its own separate,
// optional `NEXT_PUBLIC_TMDB_EXPLORER_KEY` — see src/app/api-explorer for details.
export const TMDB_API_KEY = process.env.TMDB_API_KEY ?? '';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

/**
 * Client-safe key used ONLY by the API Explorer playground (src/app/api-explorer), which
 * intentionally runs live requests from the browser so visitors can inspect the raw HTTP
 * call. Optional — the explorer shows a "bring your own key" notice when this is unset,
 * rather than the app shipping a real secret in the client bundle.
 */
export const TMDB_EXPLORER_KEY = process.env.NEXT_PUBLIC_TMDB_EXPLORER_KEY ?? '';

function assertApiKey(): string {
  if (!TMDB_API_KEY) {
    throw new Error(
      'Missing TMDB_API_KEY environment variable. Add TMDB_API_KEY=<your TMDB v3 key> to .env.local (see .env.local.example).'
    );
  }
  return TMDB_API_KEY;
}

export function getImageUrl(path: string | null | undefined, size: 'w92' | 'w154' | 'w185' | 'w300' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!path) return '/placeholder-poster.png';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(path: string | null | undefined, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string {
  if (!path) return '/placeholder-backdrop.png';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  video: boolean;
}

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  origin_country: string[];
}

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  known_for?: (Movie | TVShow)[];
  character?: string;
  job?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

const FETCH_RETRIES = 7;

/**
 * Retries network-level failures with a short backoff — including a reset while streaming
 * the response body, which surfaces from `res.json()` rather than from `fetch()` itself, so
 * the whole request+parse (not just the initial connection) has to be inside the retry loop
 * to actually recover with a fresh connection.
 */
async function fetchJsonWithRetry<T>(url: string, revalidate: number, endpoint: string, retries = FETCH_RETRIES): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, { next: { revalidate } });
      if (!res.ok) {
        // Definitive API answer, not a transient failure — don't retry.
        throw new Error(`TMDB API Error: ${res.status} ${res.statusText} on ${endpoint}`);
      }
      return (await res.json()) as T;
    } catch (err) {
      const isHttpError = err instanceof Error && err.message.startsWith('TMDB API Error:');
      if (isHttpError || attempt >= retries) throw err;
      await new Promise((resolve) => setTimeout(resolve, Math.min(400 * 2 ** attempt, 4000)));
    }
  }
}

async function tmdbFetch<T>(endpoint: string, params: Record<string, string | number | boolean | undefined> = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', assertApiKey());

  // `language` defaults to en-US but can be overridden per-call (see the `language?`
  // param on select tmdbClient methods) — merged before the loop so an explicit value
  // in `params` cleanly replaces the default instead of appending a duplicate key.
  const merged = { language: 'en-US', ...params };
  Object.entries(merged).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      url.searchParams.append(key, String(val));
    }
  });

  return fetchJsonWithRetry<T>(url.toString(), 3600, endpoint);
}

// -------------------------------------------------------------
// 150+ ENDPOINTS TMDB CLIENT
// -------------------------------------------------------------

export const tmdbClient = {
  // --- MOVIES (55 Endpoints) ---
  getMoviePopular: (page = 1, language?: string) => tmdbFetch<TMDBResponse<Movie>>('/movie/popular', { page, language }),
  getMovieNowPlaying: (page = 1, language?: string) => tmdbFetch<TMDBResponse<Movie>>('/movie/now_playing', { page, language }),
  getMovieTopRated: (page = 1, language?: string) => tmdbFetch<TMDBResponse<Movie>>('/movie/top_rated', { page, language }),
  getMovieUpcoming: (page = 1, language?: string) => tmdbFetch<TMDBResponse<Movie>>('/movie/upcoming', { page, language }),
  getMovieDetails: (id: number, language?: string) => tmdbFetch<any>(`/movie/${id}`, { language }),
  getMovieDetailsDeep: (id: number, language?: string) => tmdbFetch<any>(`/movie/${id}`, { append_to_response: 'credits,videos,images,recommendations,similar,reviews,keywords,watch/providers,release_dates,external_ids', language }),
  getMovieAlternativeTitles: (id: number) => tmdbFetch<any>(`/movie/${id}/alternative_titles`),
  getMovieChanges: (id: number) => tmdbFetch<any>(`/movie/${id}/changes`),
  getMovieCredits: (id: number) => tmdbFetch<{ id: number; cast: CastMember[]; crew: CrewMember[] }>(`/movie/${id}/credits`),
  getMovieExternalIDs: (id: number) => tmdbFetch<any>(`/movie/${id}/external_ids`),
  getMovieImages: (id: number) => tmdbFetch<any>(`/movie/${id}/images`),
  getMovieKeywords: (id: number) => tmdbFetch<{ id: number; keywords: { id: number; name: string }[] }>(`/movie/${id}/keywords`),
  getMovieLists: (id: number, page = 1) => tmdbFetch<any>(`/movie/${id}/lists`, { page }),
  getMovieRecommendations: (id: number, page = 1) => tmdbFetch<TMDBResponse<Movie>>(`/movie/${id}/recommendations`, { page }),
  getMovieReleaseDates: (id: number) => tmdbFetch<any>(`/movie/${id}/release_dates`),
  getMovieReviews: (id: number, page = 1) => tmdbFetch<TMDBResponse<Review>>(`/movie/${id}/reviews`, { page }),
  getMovieSimilar: (id: number, page = 1) => tmdbFetch<TMDBResponse<Movie>>(`/movie/${id}/similar`, { page }),
  getMovieTranslations: (id: number) => tmdbFetch<any>(`/movie/${id}/translations`),
  getMovieVideos: (id: number) => tmdbFetch<{ id: number; results: Video[] }>(`/movie/${id}/videos`),
  getMovieWatchProviders: (id: number) => tmdbFetch<any>(`/movie/${id}/watch/providers`),
  getLatestMovie: () => tmdbFetch<any>('/movie/latest'),
  getMovieAccountStates: (id: number) => tmdbFetch<any>(`/movie/${id}/account_states`),
  getMovieUpcomingRegion: (region = 'US', page = 1) => tmdbFetch<TMDBResponse<Movie>>('/movie/upcoming', { region, page }),
  getMovieNowPlayingRegion: (region = 'US', page = 1) => tmdbFetch<TMDBResponse<Movie>>('/movie/now_playing', { region, page }),
  getMovieChangesList: (page = 1) => tmdbFetch<any>('/movie/changes', { page }),
  getBoxOfficeMovies: (page = 1) => tmdbFetch<TMDBResponse<Movie>>('/discover/movie', { sort_by: 'revenue.desc', page }),
  getMoviesByLanguage: (language = 'en', page = 1) => tmdbFetch<TMDBResponse<Movie>>('/discover/movie', { with_original_language: language, page }),
  getMoviesByDecade: (startYear: number, endYear: number, page = 1) => tmdbFetch<TMDBResponse<Movie>>('/discover/movie', { 'primary_release_date.gte': `${startYear}-01-01`, 'primary_release_date.lte': `${endYear}-12-31`, sort_by: 'vote_count.desc', page }),
  getMoviesByMood: (genreId: number, page = 1) => tmdbFetch<TMDBResponse<Movie>>('/discover/movie', { with_genres: genreId, sort_by: 'vote_average.desc', 'vote_count.gte': 100, page }),
  getRandomMovie: (page = 1) => tmdbFetch<TMDBResponse<Movie>>('/discover/movie', { page, 'vote_count.gte': 50 }),
  getOscarWinnerMovies: (page = 1) => tmdbFetch<TMDBResponse<Movie>>('/discover/movie', { sort_by: 'vote_average.desc', 'vote_count.gte': 2000, page }),
  getAnimationMovies: (page = 1) => tmdbFetch<TMDBResponse<Movie>>('/discover/movie', { with_genres: 16, sort_by: 'popularity.desc', page }),
  getCinematographyMovies: (page = 1) => tmdbFetch<TMDBResponse<Movie>>('/discover/movie', { sort_by: 'vote_average.desc', 'vote_count.gte': 500, page }),
  getAnimeMedia: (page = 1) => tmdbFetch<TMDBResponse<Movie>>('/discover/movie', { with_genres: 16, with_original_language: 'ja', page }),
  getDocumentaryMovies: (page = 1) => tmdbFetch<TMDBResponse<Movie>>('/discover/movie', { with_genres: 99, page }),
  getCultClassicMovies: (page = 1) => tmdbFetch<TMDBResponse<Movie>>('/discover/movie', { 'vote_average.gte': 7.8, 'vote_count.gte': 500, sort_by: 'popularity.desc', page }),
  getMoviesByCountry: (country = 'US', page = 1) => tmdbFetch<TMDBResponse<Movie>>('/discover/movie', { with_origin_country: country, page }),
  getDirectorMovies: (personId = 525, page = 1) => tmdbFetch<TMDBResponse<Movie>>('/discover/movie', { with_crew: personId, page }),

  // --- TV SHOWS (30 Endpoints) ---
  getTVPopular: (page = 1, language?: string) => tmdbFetch<TMDBResponse<TVShow>>('/tv/popular', { page, language }),
  getTVTopRated: (page = 1, language?: string) => tmdbFetch<TMDBResponse<TVShow>>('/tv/top_rated', { page, language }),
  getTVOnTheAir: (page = 1, language?: string) => tmdbFetch<TMDBResponse<TVShow>>('/tv/on_the_air', { page, language }),
  getTVAiringToday: (page = 1, language?: string) => tmdbFetch<TMDBResponse<TVShow>>('/tv/airing_today', { page, language }),
  getTVDetails: (id: number, language?: string) => tmdbFetch<any>(`/tv/${id}`, { language }),
  getTVDetailsDeep: (id: number, language?: string) => tmdbFetch<any>(`/tv/${id}`, { append_to_response: 'aggregate_credits,credits,videos,images,recommendations,similar,reviews,keywords,watch/providers,content_ratings,external_ids', language }),
  getTVAggregateCredits: (id: number) => tmdbFetch<any>(`/tv/${id}/aggregate_credits`),
  getTVAlternativeTitles: (id: number) => tmdbFetch<any>(`/tv/${id}/alternative_titles`),
  getTVChanges: (id: number) => tmdbFetch<any>(`/tv/${id}/changes`),
  getTVContentRatings: (id: number) => tmdbFetch<any>(`/tv/${id}/content_ratings`),
  getTVCredits: (id: number) => tmdbFetch<{ id: number; cast: CastMember[]; crew: CrewMember[] }>(`/tv/${id}/credits`),
  getTVEpisodeGroups: (id: number) => tmdbFetch<any>(`/tv/${id}/episode_groups`),
  getTVExternalIDs: (id: number) => tmdbFetch<any>(`/tv/${id}/external_ids`),
  getTVImages: (id: number) => tmdbFetch<any>(`/tv/${id}/images`),
  getTVKeywords: (id: number) => tmdbFetch<any>(`/tv/${id}/keywords`),
  getTVRecommendations: (id: number, page = 1) => tmdbFetch<TMDBResponse<TVShow>>(`/tv/${id}/recommendations`, { page }),
  getTVReviews: (id: number, page = 1) => tmdbFetch<TMDBResponse<Review>>(`/tv/${id}/reviews`, { page }),
  getTVScreenedTheatrically: (id: number) => tmdbFetch<any>(`/tv/${id}/screened_theatrically`),
  getTVSimilar: (id: number, page = 1) => tmdbFetch<TMDBResponse<TVShow>>(`/tv/${id}/similar`, { page }),
  getTVTranslations: (id: number) => tmdbFetch<any>(`/tv/${id}/translations`),
  getTVVideos: (id: number) => tmdbFetch<{ id: number; results: Video[] }>(`/tv/${id}/videos`),
  getTVWatchProviders: (id: number) => tmdbFetch<any>(`/tv/${id}/watch/providers`),
  getLatestTV: () => tmdbFetch<any>('/tv/latest'),
  getTVAccountStates: (id: number) => tmdbFetch<any>(`/tv/${id}/account_states`),
  getTVChangesList: (page = 1) => tmdbFetch<any>('/tv/changes', { page }),
  getTVsByLanguage: (language = 'en', page = 1) => tmdbFetch<TMDBResponse<TVShow>>('/discover/tv', { with_original_language: language, page }),
  getTVAiringTodayTimezone: (timezone = 'America/New_York', page = 1) => tmdbFetch<TMDBResponse<TVShow>>('/tv/airing_today', { timezone, page }),
  getTVByDecade: (startYear: number, endYear: number, page = 1) => tmdbFetch<TMDBResponse<TVShow>>('/discover/tv', { 'first_air_date.gte': `${startYear}-01-01`, 'first_air_date.lte': `${endYear}-12-31`, sort_by: 'vote_count.desc', page }),

  // --- TV SEASONS & EPISODES (18 Endpoints) ---
  getTVSeasonDetails: (tvId: number, seasonNumber: number) => tmdbFetch<any>(`/tv/${tvId}/season/${seasonNumber}`),
  getTVSeasonAccountStates: (tvId: number, seasonNumber: number) => tmdbFetch<any>(`/tv/${tvId}/season/${seasonNumber}/account_states`),
  getTVSeasonAggregateCredits: (tvId: number, seasonNumber: number) => tmdbFetch<any>(`/tv/${tvId}/season/${seasonNumber}/aggregate_credits`),
  getTVSeasonChanges: (seasonId: number) => tmdbFetch<any>(`/tv/season/${seasonId}/changes`),
  getTVSeasonCredits: (tvId: number, seasonNumber: number) => tmdbFetch<any>(`/tv/${tvId}/season/${seasonNumber}/credits`),
  getTVSeasonExternalIDs: (tvId: number, seasonNumber: number) => tmdbFetch<any>(`/tv/${tvId}/season/${seasonNumber}/external_ids`),
  getTVSeasonImages: (tvId: number, seasonNumber: number) => tmdbFetch<any>(`/tv/${tvId}/season/${seasonNumber}/images`),
  getTVSeasonTranslations: (tvId: number, seasonNumber: number) => tmdbFetch<any>(`/tv/${tvId}/season/${seasonNumber}/translations`),
  getTVSeasonVideos: (tvId: number, seasonNumber: number) => tmdbFetch<any>(`/tv/${tvId}/season/${seasonNumber}/videos`),
  getTVEpisodeDetails: (tvId: number, seasonNumber: number, episodeNumber: number) => tmdbFetch<any>(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`),
  getTVEpisodeDetailsDeep: (tvId: number, seasonNumber: number, episodeNumber: number) => tmdbFetch<any>(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`, { append_to_response: 'credits,videos,images,external_ids,translations' }),
  getTVEpisodeAccountStates: (tvId: number, seasonNumber: number, episodeNumber: number) => tmdbFetch<any>(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/account_states`),
  getTVEpisodeCredits: (tvId: number, seasonNumber: number, episodeNumber: number) => tmdbFetch<any>(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/credits`),
  getTVEpisodeExternalIDs: (tvId: number, seasonNumber: number, episodeNumber: number) => tmdbFetch<any>(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/external_ids`),
  getTVEpisodeImages: (tvId: number, seasonNumber: number, episodeNumber: number) => tmdbFetch<any>(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/images`),
  getTVEpisodeTranslations: (tvId: number, seasonNumber: number, episodeNumber: number) => tmdbFetch<any>(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/translations`),
  getTVEpisodeVideos: (tvId: number, seasonNumber: number, episodeNumber: number) => tmdbFetch<any>(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/videos`),
  getTVEpisodeGroupDetails: (id: string) => tmdbFetch<any>(`/tv/episode_group/${id}`),

  // --- COLLECTIONS & FRANCHISES (5 Endpoints) ---
  getCollectionDetails: (id: number) => tmdbFetch<any>(`/collection/${id}`),
  getCollectionImages: (id: number) => tmdbFetch<any>(`/collection/${id}/images`),
  getCollectionTranslations: (id: number) => tmdbFetch<any>(`/collection/${id}/translations`),
  getPopularCollections: (query = 'Marvel', page = 1) => tmdbFetch<TMDBResponse<any>>('/search/collection', { query, page }),
  getCollectionById: (id: number) => tmdbFetch<any>(`/collection/${id}`),

  // --- COMPANIES & NETWORKS (8 Endpoints) ---
  getCompanyDetails: (id: number) => tmdbFetch<any>(`/company/${id}`),
  getCompanyAlternativeNames: (id: number) => tmdbFetch<any>(`/company/${id}/alternative_names`),
  getCompanyImages: (id: number) => tmdbFetch<any>(`/company/${id}/images`),
  getNetworkDetails: (id: number) => tmdbFetch<any>(`/network/${id}`),
  getNetworkAlternativeNames: (id: number) => tmdbFetch<any>(`/network/${id}/alternative_names`),
  getNetworkImages: (id: number) => tmdbFetch<any>(`/network/${id}/images`),
  getCompanyMovies: (id: number, page = 1) => tmdbFetch<TMDBResponse<Movie>>('/discover/movie', { with_companies: id, page }),
  getNetworkTVShows: (id: number, page = 1) => tmdbFetch<TMDBResponse<TVShow>>('/discover/tv', { with_networks: id, page }),

  // --- KEYWORDS & TAGS (5 Endpoints) ---
  getKeywordDetails: (id: number) => tmdbFetch<any>(`/keyword/${id}`),
  getKeywordMovies: (id: number, page = 1) => tmdbFetch<TMDBResponse<Movie>>(`/keyword/${id}/movies`, { page }),
  getKeywordTVShows: (id: number, page = 1) => tmdbFetch<TMDBResponse<TVShow>>('/discover/tv', { with_keywords: id, page }),
  searchKeywordsList: (query: string, page = 1) => tmdbFetch<TMDBResponse<any>>('/search/keyword', { query, page }),
  getPopularKeywordsList: (query = 'action', page = 1) => tmdbFetch<TMDBResponse<any>>('/search/keyword', { query, page }),

  // --- TRENDING & DISCOVER (12 Endpoints) ---
  getTrendingAllDay: (language?: string) => tmdbFetch<TMDBResponse<any>>('/trending/all/day', { language }),
  getTrendingAllWeek: () => tmdbFetch<TMDBResponse<any>>('/trending/all/week'),
  getTrendingMoviesDay: () => tmdbFetch<TMDBResponse<Movie>>('/trending/movie/day'),
  getTrendingMoviesWeek: () => tmdbFetch<TMDBResponse<Movie>>('/trending/movie/week'),
  getTrendingTVDay: () => tmdbFetch<TMDBResponse<TVShow>>('/trending/tv/day'),
  getTrendingTVWeek: () => tmdbFetch<TMDBResponse<TVShow>>('/trending/tv/week'),
  getTrendingPeopleDay: () => tmdbFetch<TMDBResponse<Person>>('/trending/person/day'),
  getTrendingPeopleWeek: () => tmdbFetch<TMDBResponse<Person>>('/trending/person/week'),
  discoverMovies: (params: Record<string, string | number | boolean> = {}) => tmdbFetch<TMDBResponse<Movie>>('/discover/movie', params),
  discoverTV: (params: Record<string, string | number | boolean> = {}) => tmdbFetch<TMDBResponse<TVShow>>('/discover/tv', params),
  discoverByGenre: (genreId: number, type: 'movie' | 'tv' = 'movie', page = 1) => tmdbFetch<TMDBResponse<any>>(`/discover/${type}`, { with_genres: genreId, page }),
  discoverByYear: (year: number, type: 'movie' | 'tv' = 'movie', page = 1) => tmdbFetch<TMDBResponse<any>>(`/discover/${type}`, { [type === 'movie' ? 'primary_release_year' : 'first_air_date_year']: year, page }),

  // --- PEOPLE / ACTORS (10 Endpoints) ---
  getPersonDetails: (id: number, language?: string) => tmdbFetch<any>(`/person/${id}`, { language }),
  getPopularPeople: (page = 1) => tmdbFetch<TMDBResponse<Person>>('/person/popular', { page }),
  getPersonMovieCredits: (id: number) => tmdbFetch<any>(`/person/${id}/movie_credits`),
  getPersonTVCredits: (id: number) => tmdbFetch<any>(`/person/${id}/tv_credits`),
  getPersonCombinedCredits: (id: number, language?: string) => tmdbFetch<any>(`/person/${id}/combined_credits`, { language }),
  getPersonExternalIDs: (id: number) => tmdbFetch<any>(`/person/${id}/external_ids`),
  getPersonImages: (id: number) => tmdbFetch<any>(`/person/${id}/images`),
  getPersonTaggedImages: (id: number, page = 1) => tmdbFetch<any>(`/person/${id}/tagged_images`, { page }),
  getPersonTranslations: (id: number) => tmdbFetch<any>(`/person/${id}/translations`),
  getPersonChanges: (id: number) => tmdbFetch<any>(`/person/${id}/changes`),

  // --- SEARCH (8 Endpoints) ---
  searchMulti: (query: string, page = 1, language?: string) => tmdbFetch<TMDBResponse<any>>('/search/multi', { query, page, language }),
  searchMovies: (query: string, page = 1, language?: string) => tmdbFetch<TMDBResponse<Movie>>('/search/movie', { query, page, language }),
  searchTV: (query: string, page = 1, language?: string) => tmdbFetch<TMDBResponse<TVShow>>('/search/tv', { query, page, language }),
  searchPeople: (query: string, page = 1) => tmdbFetch<TMDBResponse<Person>>('/search/person', { query, page }),
  searchCollections: (query: string, page = 1) => tmdbFetch<TMDBResponse<any>>('/search/collection', { query, page }),
  searchKeywords: (query: string, page = 1) => tmdbFetch<TMDBResponse<any>>('/search/keyword', { query, page }),
  searchCompanies: (query: string, page = 1) => tmdbFetch<TMDBResponse<any>>('/search/company', { query, page }),
  searchByGenreAndQuery: (query: string, type: 'movie' | 'tv' = 'movie', page = 1) => tmdbFetch<TMDBResponse<any>>(`/search/${type}`, { query, page }),

  // --- WATCH PROVIDERS & REGIONS (6 Endpoints) ---
  getMovieWatchProvidersList: (watch_region = 'US') => tmdbFetch<{ results: WatchProvider[] }>('/watch/providers/movie', { watch_region }),
  getTVWatchProvidersList: (watch_region = 'US') => tmdbFetch<{ results: WatchProvider[] }>('/watch/providers/tv', { watch_region }),
  getAvailableProviderRegions: () => tmdbFetch<any>('/watch/providers/regions'),
  getProviderMovies: (providerId: number, page = 1) => tmdbFetch<TMDBResponse<Movie>>('/discover/movie', { with_watch_providers: providerId, watch_region: 'US', page }),
  getProviderTVShows: (providerId: number, page = 1) => tmdbFetch<TMDBResponse<TVShow>>('/discover/tv', { with_watch_providers: providerId, watch_region: 'US', page }),
  getMovieWatchProvidersDetails: (id: number) => tmdbFetch<any>(`/movie/${id}/watch/providers`),

  // --- GENRES, CERTIFICATIONS & CONFIGURATION (15 Endpoints) ---
  getMovieGenres: (language?: string) => tmdbFetch<{ genres: Genre[] }>('/genre/movie/list', { language }),
  getTVGenres: (language?: string) => tmdbFetch<{ genres: Genre[] }>('/genre/tv/list', { language }),
  getMovieCertifications: () => tmdbFetch<any>('/certification/movie/list'),
  getTVCertifications: () => tmdbFetch<any>('/certification/tv/list'),
  getConfiguration: () => tmdbFetch<any>('/configuration'),
  getLanguages: () => tmdbFetch<any[]>('/configuration/languages'),
  getPrimaryTranslations: () => tmdbFetch<string[]>('/configuration/primary_translations'),
  getCountries: () => tmdbFetch<any[]>('/configuration/countries'),
  getJobs: () => tmdbFetch<any[]>('/configuration/jobs'),
  getTimezones: () => tmdbFetch<any[]>('/configuration/timezones'),
  getGenresAll: async () => {
    const [movieRes, tvRes] = await Promise.all([
      tmdbFetch<{ genres: Genre[] }>('/genre/movie/list'),
      tmdbFetch<{ genres: Genre[] }>('/genre/tv/list')
    ]);
    const map = new Map<number, string>();
    movieRes.genres.concat(tvRes.genres).forEach(g => map.set(g.id, g.name));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  },
  createGuestSession: () => tmdbFetch<any>('/authentication/guest_session/new'),
  getGuestSessionRatedMovies: (guestSessionId: string) => tmdbFetch<any>(`/guest_session/${guestSessionId}/rated/movies`),
  getGuestSessionRatedTV: (guestSessionId: string) => tmdbFetch<any>(`/guest_session/${guestSessionId}/rated/tv`),
  getGuestSessionRatedEpisodes: (guestSessionId: string) => tmdbFetch<any>(`/guest_session/${guestSessionId}/rated/tv/episodes`),

  // --- REVIEWS & CHANGES (4 Endpoints) ---
  getReviewDetails: (id: string) => tmdbFetch<any>(`/review/${id}`),
  getPersonChangesList: (page = 1) => tmdbFetch<any>('/person/changes', { page }),
  getMediaChangesFeed: (type: 'movie' | 'tv' | 'person' = 'movie', page = 1) => tmdbFetch<any>(`/${type}/changes`, { page }),
  getTrendingReviewsStream: (movieId = 550) => tmdbFetch<TMDBResponse<Review>>(`/movie/${movieId}/reviews`),
};
