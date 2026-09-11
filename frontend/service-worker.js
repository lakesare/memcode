import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

console.log('this is my custom service worker');

precacheAndRoute([
  ...self.__WB_MANIFEST,
  { url: '/index.html', revision: new Date().getTime().toString() }
]);

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

registerRoute(new NavigationRoute(
  createHandlerBoundToURL('/index.html'),
  {
    denylist: [
      // aaaaaa for fucking OAuth, don't remove bitch
      new RegExp('/api/.*')
    ]
  }
));

registerRoute(
  new RegExp('.*/api/courseCategories/withGroups'),
  new StaleWhileRevalidate({ cacheName: 'api_v5' })
);

registerRoute(
  new RegExp('.*/api/PageApi\\.getUserPage.*'),
  new StaleWhileRevalidate({ cacheName: 'api_v5' })
);

registerRoute(
  new RegExp('.*/api/CourseApi\\.getPublicCourses.*'),
  new StaleWhileRevalidate({ cacheName: 'api_v5' })
);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new StaleWhileRevalidate({ cacheName: 'google-fonts-stylesheets' })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);
