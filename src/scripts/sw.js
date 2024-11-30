import 'regenerator-runtime';
import CONFIG from './globals/config';

const CACHE_NAME = CONFIG.CACHE_NAME;

const assetsToCache = [
  './',
  './icons/icon-32x32.png',
  './icons/icon-64x64.png',
  './icons/icon-128x128.png',
  './icons/icon-256x256.png',
  './icons/icon-512x512.png',
  './heros/hero-image_4.jpg',
  './index.html',
  './favicon.png',
  './app.bundle.js',
  './app.webmanifest',
  './sw.bundle.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET' || request.url.startsWith('chrome-extension')) {
    return;
  }

  if (url.origin === 'https://restaurant-api.dicoding.dev') {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            fetch(request)
              .then((networkResponse) => {
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(request, networkResponse);
                  });
              })
              .catch(console.log);

            return response;
          }

          return fetch(request)
            .then((networkResponse) => {
              const clonedResponse = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, clonedResponse);
                });
              return networkResponse;
            })
            .catch(() => {
              return new Response(
                JSON.stringify({
                  message: 'No cached data available',
                  restaurants: [],
                }),
                {
                  status: 200,
                  headers: { 'Content-Type': 'application/json' },
                }
              );
            });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(request)
          .then((fetchResponse) => {
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              });
            return fetchResponse;
          })
          .catch(() => {
            if (request.mode === 'navigate') {
              return caches.match('./');
            }
            return null;
          });
      })
  );
});