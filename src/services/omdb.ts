// Optional cross-source ratings (IMDb / Rotten Tomatoes / Metacritic) via the OMDb API.
// TMDB has no RT/Metacritic data of its own, so this is a genuinely separate signal.
// `OMDB_API_KEY` is server-only and optional — get a free key at https://www.omdbapi.com/apikey.aspx.
// When unset (or the lookup fails for any reason), callers get `null` and simply render
// nothing extra; this is a progressive enhancement, never a hard dependency.
const OMDB_API_KEY = process.env.OMDB_API_KEY ?? '';
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

export interface CrossSourceRatings {
  imdbRating?: string;
  imdbVotes?: string;
  rottenTomatoes?: string;
  metascore?: string;
}

export async function getCrossSourceRatings(imdbId: string | null | undefined): Promise<CrossSourceRatings | null> {
  if (!OMDB_API_KEY || !imdbId) return null;

  try {
    const url = new URL(OMDB_BASE_URL);
    url.searchParams.set('apikey', OMDB_API_KEY);
    url.searchParams.set('i', imdbId);

    const res = await fetch(url.toString(), { next: { revalidate: 60 * 60 * 24 } });
    if (!res.ok) return null;

    const data = await res.json();
    if (data.Response === 'False') return null;

    const rottenTomatoes = data.Ratings?.find((r: { Source: string; Value: string }) => r.Source === 'Rotten Tomatoes')?.Value;
    const metascore = data.Metascore && data.Metascore !== 'N/A' ? data.Metascore : undefined;
    const imdbRating = data.imdbRating && data.imdbRating !== 'N/A' ? data.imdbRating : undefined;
    const imdbVotes = data.imdbVotes && data.imdbVotes !== 'N/A' ? data.imdbVotes : undefined;

    if (!rottenTomatoes && !metascore && !imdbRating) return null;
    return { imdbRating, imdbVotes, rottenTomatoes, metascore };
  } catch {
    return null;
  }
}
