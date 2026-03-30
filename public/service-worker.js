const CACHE_NAME = 'fg-store-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/fallback.jpg',
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Bypass caching for API and Checkout/Cart
  if (url.pathname.startsWith('/api/') || 
      url.pathname.includes('checkout') || 
      url.pathname.includes('cart') ||
      url.pathname.includes('login') ||
      url.pathname.includes('account')) {
    return;
  }

  // Stale-While-Revalidate for other assets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback for failed fetches (e.g. offline)
        if (request.destination === 'image') {
          return caches.match('/fallback.jpg');
        }
      });
      return cachedResponse || fetchPromise;
    })
  );
});

// Message Event (Heartbeat)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'HEARTBEAT') {
    // console.log('Service Worker received heartbeat:', event.data.timestamp);
    // You could respond to keep the client informed if needed
    /*
    event.source.postMessage({
      type: 'HEARTBEAT_ACK',
      timestamp: Date.now()
    });
    */
  }
});
