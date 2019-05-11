console.log('this is my custom service worker');
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

self.addEventListener('install', function(event) {
  // The promise that skipWaiting() returns can be safely ignored.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // clearing cached responses!
    caches.delete('api')
  );
});

workbox.precaching.precache([
  { url: '/index.html', revision: 'v2' }
]);
workbox.routing.registerNavigationRoute(
  '/index.html',
  {
    blacklist: [
      // aaaaaa for fucking OAuth, don't remove bitch
      new RegExp('/api/.*')
    ]
  }
);

workbox.routing.registerRoute(
  new RegExp('.*/api/courseCategories/withGroups'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'api_v2'
  })
);

workbox.routing.registerRoute(
  new RegExp('.*/api/courses/public.*'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'api_v2'
  })
);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

