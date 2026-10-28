/* HamList PWA baseline: cache only public static assets, never user or API data. */
const CACHE_PREFIX = 'hamlist-static-';
const CACHE_NAME = `${CACHE_PREFIX}v1`;
const PRECACHE_URLS = [
  '/offline.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/fonts/vazirmatn-variable.woff2'
];
const MAX_STATIC_CHUNKS = 80;

async function trimStaticCache(cache) {
  const chunkKeys = (await cache.keys()).filter((request) => new URL(request.url).pathname.startsWith('/_next/static/'));
  const removeCount = Math.max(0, chunkKeys.length - MAX_STATIC_CHUNKS);
  await Promise.all(chunkKeys.slice(0, removeCount).map((request) => cache.delete(request)));
}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'HAMLIST_SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(async () => {
      const cachedFallback = await caches.match('/offline.html');
      return cachedFallback || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }));
    return;
  }

  const publicStatic = url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/') || url.pathname.startsWith('/fonts/') || url.pathname === '/manifest.webmanifest';
  if (!publicStatic) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') {
        await cache.put(request, response.clone());
        if (url.pathname.startsWith('/_next/static/')) await trimStaticCache(cache);
      }
      return response;
    } catch {
      return cached || Response.error();
    }
  })());
});
