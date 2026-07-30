// Hand-written service worker (no next-pwa — keeps the dependency tree small and avoids
// known Turbopack/next-pwa friction). Three strategies:
//  1. TMDB poster/backdrop images: stale-while-revalidate, capped cache size.
//  2. Next.js immutable build assets (/_next/static/*): cache-first.
//  3. Page navigations: network-first, falling back to the cached shell or offline.html.
// v2: bumps the cache name so `activate` purges any stale v1 cache — see the note on
// `PRECACHE_URLS` below for why a stale '/' snapshot could otherwise stick around.
const CACHE_VERSION = 'cinestream-v2';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
// Deliberately excludes '/' and '/watchlist': precaching a page at install time caches
// whatever HTML happened to be live at that exact moment with no way to revalidate it
// until the SW itself updates, which risks pinning a visitor to a stale snapshot. Static,
// truly-immutable assets are safe to precache; real pages are left to the network-first
// navigate handler below, which caches only successful, fresh responses as they're seen.
const PRECACHE_URLS = ['/manifest.json', '/favicon.ico', '/logo192.png', '/logo512.png', '/offline.html'];
const MAX_IMAGE_ENTRIES = 150;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('cinestream-') && key !== STATIC_CACHE && key !== IMAGE_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    await cache.delete(keys[0]);
    await trimCache(cacheName, maxEntries);
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (url.hostname === 'image.tmdb.org') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
              trimCache(IMAGE_CACHE, MAX_IMAGE_ENTRIES);
            }
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  if (url.origin === self.location.origin && url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      })
    );
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache genuinely successful pages — caching a transient 500 (or any
          // non-2xx) would otherwise pin future offline/fallback visits to that broken
          // response until it happens to be overwritten by a later successful one.
          if (response.ok) {
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, response.clone()));
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(STATIC_CACHE);
          return (await cache.match(request)) || (await cache.match('/offline.html'));
        })
    );
  }
});
