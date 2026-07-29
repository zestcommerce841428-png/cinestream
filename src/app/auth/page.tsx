'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Key, UserCheck, Star, Heart, Bookmark, List, Shield, LogOut, ExternalLink, Plus, Trash2, RefreshCw, Check, Film, Tv } from 'lucide-react';
import { tmdbAuthClient, TMDBAccount } from '@/services/tmdbAuth';

export default function AdvancedAuthPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [account, setAccount] = useState<TMDBAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'favorites' | 'ratings' | 'watchlist' | 'lists' | 'rated_episodes'>('favorites');

  const [favorites, setFavorites] = useState<any[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [lists, setLists] = useState<any[]>([]);
  const [ratedEpisodes, setRatedEpisodes] = useState<any[]>([]);

  // Modal State for New Custom List
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [listName, setListName] = useState('');
  const [listDesc, setListDesc] = useState('');

  // Rating State
  const [ratingMediaId, setRatingMediaId] = useState<number | null>(null);
  const [ratingValue, setRatingValue] = useState<number>(8);

  useEffect(() => {
    const savedSession = localStorage.getItem('tmdb_session_id');
    if (savedSession) {
      setSessionId(savedSession);
      fetchAccountData(savedSession);
    }
  }, []);

  const fetchAccountData = async (session: string) => {
    setLoading(true);
    try {
      const acc = await tmdbAuthClient.getAccountDetails(session);
      setAccount(acc);

      if (acc?.id) {
        const [favRes, rateRes, watchRes, listRes, epRes] = await Promise.all([
          tmdbAuthClient.getFavoriteMovies(acc.id, session),
          tmdbAuthClient.getRatedMovies(acc.id, session),
          tmdbAuthClient.getAccountWatchlistMovies(acc.id, session),
          tmdbAuthClient.getAccountLists(acc.id, session),
          tmdbAuthClient.getRatedEpisodes(acc.id, session)
        ]);

        setFavorites(favRes.results || []);
        setRatings(rateRes.results || []);
        setWatchlist(watchRes.results || []);
        setLists(listRes.results || []);
        setRatedEpisodes(epRes.results || []);
      }
    } catch (e) {
      console.error('Failed fetching account details', e);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const handleStartOAuth = async () => {
    setLoading(true);
    try {
      const tokenRes = await tmdbAuthClient.createRequestToken();
      if (tokenRes.success) {
        const redirectUrl = `https://www.themoviedb.org/authenticate/${tokenRes.request_token}?redirect_to=${encodeURIComponent(window.location.href)}`;
        window.location.href = redirectUrl;
      }
    } catch (e) {
      console.error('Error creating request token', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId || !listName) return;
    try {
      await tmdbAuthClient.createCustomList(listName, listDesc, 'en', sessionId);
      setListName('');
      setListDesc('');
      setShowCreateModal(false);
      fetchAccountData(sessionId);
    } catch (err) {
      console.error('Error creating custom list', err);
    }
  };

  const handleClearList = async (listId: string) => {
    if (!sessionId) return;
    try {
      await tmdbAuthClient.clearList(listId, sessionId);
      fetchAccountData(sessionId);
    } catch (err) {
      console.error('Error clearing list', err);
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (!sessionId) return;
    try {
      await tmdbAuthClient.deleteList(listId, sessionId);
      fetchAccountData(sessionId);
    } catch (err) {
      console.error('Error deleting list', err);
    }
  };

  const handleSubmitRating = async (movieId: number) => {
    if (!sessionId) return;
    try {
      await tmdbAuthClient.rateMovie(movieId, sessionId, ratingValue);
      setRatingMediaId(null);
      fetchAccountData(sessionId);
    } catch (err) {
      console.error('Error rating movie', err);
    }
  };

  const logout = () => {
    if (sessionId) {
      tmdbAuthClient.deleteSession(sessionId).catch(() => {});
    }
    localStorage.removeItem('tmdb_session_id');
    setSessionId(null);
    setAccount(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-800 pb-6 space-y-2">
        <div className="flex items-center space-x-2">
          <Key className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">47+ TMDB User Account & OAuth Center</h1>
        </div>
        <p className="text-gray-400 text-sm">Synchronize user favorites, rating submissions, custom list creation, watchlist sync, and OAuth session tokens.</p>
      </div>

      {!account ? (
        <div className="bg-gray-900/80 p-10 rounded-3xl border border-gray-800 space-y-6 text-center max-w-xl mx-auto backdrop-blur-xl">
          <Shield className="w-16 h-16 text-brand-500 mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white">Connect TMDB v3 / v4 OAuth</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Authorize CineStream to manage user favorites, submit 1-10 ratings, build custom lists, and sync watchlists across all devices.
            </p>
          </div>

          <button
            onClick={handleStartOAuth}
            disabled={loading}
            className="w-full inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-xl disabled:opacity-50 transition hover:scale-105"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{loading ? 'Connecting to TMDB...' : 'Authorize with TMDB.org'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Account Profile Header */}
          <div className="bg-gray-900/80 p-6 rounded-3xl border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-brand-600/20 border border-brand-500/40 flex items-center justify-center font-extrabold text-xl text-brand-400">
                {account.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">{account.name || account.username}</h2>
                <span className="text-xs text-brand-400 font-mono">@{account.username} • Account ID #{account.id}</span>
                <p className="text-xs text-gray-400 pt-1">Country: {account.iso_3166_1} | Language: {account.iso_639_1} | Adult Content: {account.include_adult ? 'Allowed' : 'Filtered'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchAccountData(sessionId!)}
                className="p-2.5 rounded-xl bg-gray-950 hover:bg-gray-800 border border-gray-800 text-gray-300 transition"
                title="Refresh Account Sync"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={logout}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gray-950 hover:bg-rose-950/60 border border-gray-800 text-rose-400 text-xs font-bold transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect Session</span>
              </button>
            </div>
          </div>

          {/* Account Management Tabs */}
          <div className="space-y-6">
            <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-800 overflow-x-auto gap-1">
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                  activeTab === 'favorites' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Favorites ({favorites.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('ratings')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                  activeTab === 'ratings' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>User Ratings ({ratings.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('watchlist')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                  activeTab === 'watchlist' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>Account Watchlist ({watchlist.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('lists')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                  activeTab === 'lists' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
                <span>Custom Lists ({lists.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('rated_episodes')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                  activeTab === 'rated_episodes' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Tv className="w-4 h-4" />
                <span>Rated Episodes ({ratedEpisodes.length})</span>
              </button>
            </div>

            {/* Custom Lists Tab */}
            {activeTab === 'lists' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-extrabold text-white">Your TMDB Custom Lists</h3>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Custom List</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lists.map((l) => (
                    <div key={l.id} className="bg-gray-900/80 p-5 rounded-2xl border border-gray-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-white">{l.name}</h4>
                        <span className="text-xs text-brand-400 font-mono">{l.item_count} Items</span>
                      </div>
                      <p className="text-xs text-gray-400">{l.description || 'No description provided.'}</p>
                      <div className="flex items-center space-x-2 pt-2">
                        <button
                          onClick={() => handleClearList(l.id)}
                          className="px-3 py-1.5 rounded-lg bg-gray-950 hover:bg-amber-950/40 text-amber-400 border border-gray-800 text-xs font-bold"
                        >
                          Clear List
                        </button>
                        <button
                          onClick={() => handleDeleteList(l.id)}
                          className="px-3 py-1.5 rounded-lg bg-gray-950 hover:bg-rose-950/40 text-rose-400 border border-gray-800 text-xs font-bold"
                        >
                          Delete List
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {favorites.map((m) => (
                  <Link key={m.id} href={`/movie/${m.id}`} className="bg-gray-900/80 p-3 rounded-2xl border border-gray-800 space-y-2 hover:border-brand-500/50 transition">
                    <span className="font-extrabold text-xs text-white line-clamp-1">{m.title}</span>
                    <span className="text-[11px] text-gray-400 block">⭐ {m.vote_average?.toFixed(1)} / 10</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Ratings Tab */}
            {activeTab === 'ratings' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {ratings.map((m) => (
                  <div key={m.id} className="bg-gray-900/80 p-4 rounded-2xl border border-gray-800 space-y-2">
                    <span className="font-extrabold text-xs text-white block line-clamp-1">{m.title}</span>
                    <div className="text-xs text-amber-400 font-bold">Your Rating: ⭐ {m.rating} / 10</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal for Creating Custom List */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleCreateList} className="bg-gray-900 p-6 rounded-3xl border border-gray-800 max-w-md w-full space-y-4">
            <h3 className="text-xl font-extrabold text-white">Create New Custom TMDB List</h3>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-300">List Title</label>
              <input
                type="text"
                required
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="e.g. Masterpiece Sci-Fi Cinema"
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-300">Description</label>
              <textarea
                value={listDesc}
                onChange={(e) => setListDesc(e.target.value)}
                placeholder="Optional list description..."
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none h-24"
              />
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-950 border border-gray-800 text-gray-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow"
              >
                Create List
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
