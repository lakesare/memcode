console.log('this is my custom service worker');
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

self.addEventListener('install', () => {
  // The promise that skipWaiting() returns can be safely ignored.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // clearing cached responses and old precache manifests!
    caches.keys().then((cacheNames) => {
      return Promise.all([
        // Delete old API caches
        caches.delete('api'),
        caches.delete('api_v4'),
        // Delete old precaches from previous versions
        ...cacheNames.filter(cacheName => 
          cacheName.startsWith('workbox-precache-') && 
          !cacheName.includes(self.location.href.split('/').pop())
        ).map(cacheName => caches.delete(cacheName))
      ]);
    })
  );
});
// 
// workbox.precaching.precache([
//   { url: 'https://images6.alphacoders.com/744/thumb-1920-744566.jpg' }
// ]);

workbox.precaching.precache([
  { url: '/index.html', revision: new Date().getTime().toString() }
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
    cacheName: 'api_v5'
  })
);

workbox.routing.registerRoute(
  new RegExp('.*/api/PageApi\\.getUserPage.*'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'api_v5'
  })
);

workbox.routing.registerRoute(
  new RegExp('.*/api/CourseApi\\.getPublicCourses.*'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'api_v5'
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

