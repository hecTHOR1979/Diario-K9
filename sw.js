// GasNow Service Worker
const CACHE_NAME = 'gasnow-v7';
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/provinces.js',
  './js/api.js',
  './js/map.js',
  './js/calculator.js',
  './js/favorites.js',
  './js/app.js',
  './manifest.json',
  './logo.jpg',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // No cachear llamadas dinámicas a las APIs oficiales
  if (
    event.request.url.includes('minetur.gob.es') ||
    event.request.url.includes('economie.gouv.fr') ||
    event.request.url.includes('apiaberta.pt') ||
    event.request.url.includes('eurooilwatch.com')
  ) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
