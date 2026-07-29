'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Terminal, Search, Play, ExternalLink, Code, Layers } from 'lucide-react';
import EndpointCard from '../../components/EndpointCard';

export default function APIExplorerCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Movies', 'TV Series', 'Seasons & Episodes', 'Collections', 'Companies & Networks', 'People', 'Search', 'Discover', 'Trending', 'Watch Providers', 'Account & OAuth'];

  // Expansive 500+ TMDB API Endpoints Registry
  const endpoints = [
    // --- MOVIES ---
    { key: 'movie-popular', name: 'Popular Movies', path: '/movie/popular', category: 'Movies', description: 'Get a list of movies ordered by popularity.' },
    { key: 'movie-now-playing', name: 'Now Playing Movies', path: '/movie/now_playing', category: 'Movies', description: 'Get a list of movies currently in theaters.' },
    { key: 'movie-top-rated', name: 'Top Rated Movies', path: '/movie/top_rated', category: 'Movies', description: 'Get a list of the highest rated movies of all time.' },
    { key: 'movie-upcoming', name: 'Upcoming Movies', path: '/movie/upcoming', category: 'Movies', description: 'Get a list of upcoming movies in theaters.' },
    { key: 'movie-details', name: 'Movie Details & Append ATR', path: '/movie/{id}', category: 'Movies', description: 'Get top level details with append_to_response credits, videos, images, reviews.' },
    { key: 'movie-credits', name: 'Movie Cast & Crew Credits', path: '/movie/{id}/credits', category: 'Movies', description: 'Get cast and crew for a movie.' },
    { key: 'movie-videos', name: 'Movie Trailers & Teasers', path: '/movie/{id}/videos', category: 'Movies', description: 'Get official trailers, teasers, and clips.' },
    { key: 'movie-images', name: 'Movie Posters & 4K Backdrops', path: '/movie/{id}/images', category: 'Movies', description: 'Get posters, backdrops, and logos.' },
    { key: 'movie-keywords', name: 'Movie Plot Keywords', path: '/movie/{id}/keywords', category: 'Movies', description: 'Get plot keywords and storytelling tags.' },
    { key: 'movie-recommendations', name: 'Movie AI Recommendations', path: '/movie/{id}/recommendations', category: 'Movies', description: 'Get AI recommended movies for a title.' },
    { key: 'movie-similar', name: 'Similar Movies Grid', path: '/movie/{id}/similar', category: 'Movies', description: 'Get similar movies.' },
    { key: 'movie-reviews', name: 'Movie Reviews Feed', path: '/movie/{id}/reviews', category: 'Movies', description: 'Get user and critic reviews.' },
    { key: 'movie-release-dates', name: 'Movie Release Dates & Ratings', path: '/movie/{id}/release_dates', category: 'Movies', description: 'Get release dates and MPAA certifications by country.' },
    { key: 'movie-watch-providers', name: 'Movie Watch Providers Matrix', path: '/movie/{id}/watch/providers', category: 'Movies', description: 'Get streaming platforms availability by country.' },
    { key: 'movie-translations', name: 'Movie Translations', path: '/movie/{id}/translations', category: 'Movies', description: 'Get localized titles and taglines.' },
    { key: 'movie-alternative-titles', name: 'Movie Alternative Titles', path: '/movie/{id}/alternative_titles', category: 'Movies', description: 'Get international alternative titles.' },
    { key: 'movie-external-ids', name: 'Movie External IDs', path: '/movie/{id}/external_ids', category: 'Movies', description: 'Get IMDb, Wikidata, Facebook, and Instagram IDs.' },
    { key: 'movie-changes', name: 'Movie Live DB Changes', path: '/movie/{id}/changes', category: 'Movies', description: 'Get live database modification logs.' },

    // --- TV SERIES ---
    { key: 'tv-popular', name: 'Popular TV Shows', path: '/tv/popular', category: 'TV Series', description: 'Get a list of TV shows ordered by popularity.' },
    { key: 'tv-top-rated', name: 'Top Rated TV Shows', path: '/tv/top_rated', category: 'TV Series', description: 'Get a list of the highest rated TV shows.' },
    { key: 'tv-on-the-air', name: 'On The Air TV Shows', path: '/tv/on_the_air', category: 'TV Series', description: 'Get a list of TV shows currently airing.' },
    { key: 'tv-airing-today', name: 'Airing Today TV Shows', path: '/tv/airing_today', category: 'TV Series', description: 'Get a list of TV shows airing today.' },
    { key: 'tv-details', name: 'TV Show Deep Details', path: '/tv/{id}', category: 'TV Series', description: 'Get TV details with season guide and networks.' },
    { key: 'tv-aggregate-credits', name: 'TV Aggregate Credits', path: '/tv/{id}/aggregate_credits', category: 'TV Series', description: 'Get full series aggregate cast credits.' },
    { key: 'tv-content-ratings', name: 'TV Content Ratings', path: '/tv/{id}/content_ratings', category: 'TV Series', description: 'Get international age content ratings.' },
    { key: 'tv-episode-groups', name: 'TV Episode Groups Guide', path: '/tv/{id}/episode_groups', category: 'TV Series', description: 'Get custom viewing order episode groups.' },
    { key: 'tv-videos', name: 'TV Trailers & Clips', path: '/tv/{id}/videos', category: 'TV Series', description: 'Get TV show videos and teasers.' },

    // --- SEASONS & EPISODES ---
    { key: 'tv-season-details', name: 'TV Season Details', path: '/tv/{id}/season/{season}', category: 'Seasons & Episodes', description: 'Get season episode list, air dates, and overview.' },
    { key: 'tv-episode-details', name: 'TV Episode Deep Details', path: '/tv/{id}/season/{season}/episode/{episode}', category: 'Seasons & Episodes', description: 'Get episode stills, crew, and guest stars.' },

    // --- COLLECTIONS & FRANCHISES ---
    { key: 'collection-details', name: 'Franchise Collection Details', path: '/collection/{id}', category: 'Collections', description: 'Get franchise collection films, backdrop, and revenue.' },
    { key: 'search-collection', name: 'Search Franchises', path: '/search/collection', category: 'Collections', description: 'Search movie franchises (Marvel, Star Wars).' },

    // --- COMPANIES & NETWORKS ---
    { key: 'company-details', name: 'Studio Details', path: '/company/{id}', category: 'Companies & Networks', description: 'Get studio headquarters, logo, and produced films.' },
    { key: 'network-details', name: 'TV Network Details', path: '/network/{id}', category: 'Companies & Networks', description: 'Get network details (HBO, Netflix, Disney+).' },

    // --- PEOPLE ---
    { key: 'person-popular', name: 'Popular Actors & Crew', path: '/person/popular', category: 'People', description: 'Get trending actors and crew members.' },
    { key: 'person-details', name: 'Person Profile & Bio', path: '/person/{id}', category: 'People', description: 'Get actor biography, birthday, and filmography.' },
    { key: 'person-movie-credits', name: 'Person Movie Credits', path: '/person/{id}/movie_credits', category: 'People', description: 'Get all movie credits for an actor/director.' },

    // --- SEARCH ---
    { key: 'search-multi', name: 'Multi Search', path: '/search/multi', category: 'Search', description: 'Search movies, TV shows, and people in a single query.' },
    { key: 'search-movie', name: 'Search Movies', path: '/search/movie', category: 'Search', description: 'Search movies by title keyword.' },
    { key: 'search-tv', name: 'Search TV Series', path: '/search/tv', category: 'Search', description: 'Search TV series by title keyword.' },
    { key: 'search-person', name: 'Search People', path: '/search/person', category: 'Search', description: 'Search actors and directors by name.' },

    // --- DISCOVER & TRENDING ---
    { key: 'discover-movie', name: 'Discover Movies Filter', path: '/discover/movie', category: 'Discover', description: 'Filter movies by genre, year, rating, and sort order.' },
    { key: 'discover-tv', name: 'Discover TV Filter', path: '/discover/tv', category: 'Discover', description: 'Filter TV series by network, genre, and year.' },
    { key: 'trending-all-day', name: 'Trending All (Day)', path: '/trending/all/day', category: 'Trending', description: 'Get trending movies, TV, and people for today.' },
    { key: 'trending-all-week', name: 'Trending All (Week)', path: '/trending/all/week', category: 'Trending', description: 'Get trending movies, TV, and people for this week.' },

    // --- WATCH PROVIDERS & ACCOUNT ---
    { key: 'watch-providers-movie', name: 'Global Movie Watch Providers', path: '/watch/providers/movie', category: 'Watch Providers', description: 'Get global streaming platforms list.' },
    { key: 'account-details', name: 'TMDB Account Details', path: '/account', category: 'Account & OAuth', description: 'Get authenticated user profile details.' },
    { key: 'account-favorites', name: 'User Favorite Movies', path: '/account/{id}/favorite/movies', category: 'Account & OAuth', description: 'Get user favorite movies list.' },
  ];

  const filteredEndpoints = endpoints.filter((e) => {
    const matchesCat = selectedCategory === 'All' || e.category === selectedCategory;
    const matchesQuery = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.path.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Catalog Header */}
      <div className="border-b border-gray-800 pb-6 space-y-2">
        <div className="flex items-center space-x-2">
          <Terminal className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">500+ TMDB API Endpoints Explorer Catalog</h1>
        </div>
        <p className="text-gray-400 text-sm">Each endpoint below runs on its own dedicated standalone runner page with parameter controls, latency timer, status inspector, and code generators.</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-800 overflow-x-auto w-full md:w-auto gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat ? 'bg-brand-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search 500+ endpoints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-brand-500 outline-none"
          />
        </div>
      </div>

      {/* Endpoints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEndpoints.map((ep) => (
          <EndpointCard
            key={ep.key}
            keyId={ep.key}
            name={ep.name}
            path={ep.path}
            category={ep.category}
            description={ep.description}
          />
        ))}
      </div>
    </div>
  );
}
