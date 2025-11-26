// Custom Service Worker for PWA Demo
// This demonstrates SW lifecycle events with detailed console logging

const CACHE_NAME = 'pwa-demo-v1';
const RUNTIME_CACHE = 'pwa-demo-runtime';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/data/example.json'
];

// Install event - cache initial assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install event triggered');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching initial assets:', PRECACHE_ASSETS);
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete, skipping waiting');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate event triggered');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete old caches
              return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
            })
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activation complete, claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Cache-first strategy for our domain
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[Service Worker] Cache HIT:', url.pathname);
            return cachedResponse;
          }

          console.log('[Service Worker] Cache MISS, fetching:', url.pathname);

          return fetch(request)
            .then((response) => {
              // Don't cache non-successful responses
              if (!response || response.status !== 200) {
                return response;
              }

              // Clone the response
              const responseToCache = response.clone();

              caches.open(RUNTIME_CACHE)
                .then((cache) => {
                  console.log('[Service Worker] Caching new resource:', url.pathname);
                  cache.put(request, responseToCache);
                });

              return response;
            })
            .catch((error) => {
              console.error('[Service Worker] Fetch failed for:', url.pathname, error);

              // Return a custom offline page if available
              return caches.match('/index.html');
            });
        })
    );
  }
});

// Background Sync event - for demo purposes
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync event triggered:', event.tag);

  if (event.tag === 'sync-notes') {
    event.waitUntil(
      // Simulate sync operation
      new Promise((resolve) => {
        console.log('[Service Worker] Executing background sync for notes...');
        setTimeout(() => {
          console.log('[Service Worker] Background sync completed successfully');
          resolve();
        }, 1000);
      })
    );
  }
});

// Message event - for communication with the app
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    const urlsToCache = event.data.urls || [];
    event.waitUntil(
      caches.open(RUNTIME_CACHE)
        .then((cache) => {
          console.log('[Service Worker] Manually caching URLs:', urlsToCache);
          return cache.addAll(urlsToCache);
        })
    );
  }
});

console.log('[Service Worker] Script loaded and ready');
