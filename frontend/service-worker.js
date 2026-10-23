import { precacheAndRoute, createHandlerBoundToURL, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import offlineStorage from './services/offline/storage.js';

console.log('this is my custom service worker');

precacheAndRoute([
  ...self.__WB_MANIFEST,
  // [claude comment] fixed at build time - the browser re-runs this file whenever it restarts the worker, and the precache looks /index.html up by this revision
  { url: '/index.html', revision: process.env.SW_BUILD_ID }
]);

cleanupOutdatedCaches();

self.addEventListener('install', () => {
  // The promise that skipWaiting() returns can be safely ignored.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Delete old API caches
    Promise.all([
      caches.delete('api'),
      caches.delete('api_v4')
    ])
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

// [claude comment] images saved by the offline download (<OfflineModal/>) come from its cache, all other images go to the network as before
registerRoute(
  ({ request }) => request.destination === 'image',
  async ({ request }) => {
    const cachedResponse = await caches.match(request, { cacheName: offlineStorage.imagesCacheName, ignoreVary: true });
    // [claude comment] an opaque response hides its status, so it may be a saved error page - it's only used when the network fails
    if (cachedResponse && cachedResponse.type !== 'opaque') {
      return cachedResponse;
    } else {
      try {
        return await fetch(request);
      } catch (error) {
        if (cachedResponse) {
          return cachedResponse;
        } else {
          throw error;
        }
      }
    }
  }
);

// [claude comment] the katex version is pinned in backend/html.js, so its files never change
registerRoute(
  /^https:\/\/cdn\.jsdelivr\.net\/npm\/katex@/,
  new CacheFirst({
    cacheName: 'katex',
    plugins: [new CacheableResponsePlugin({ statuses: [200] })]
  })
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

// [claude comment] books shared to the installed app from another Android app arrive here (see share_target in site.webmanifest); they wait in this cache until /pdfs uploads them with the user's login
registerRoute(
  ({ url }) => url.pathname === '/pdfs/share-target',
  async ({ request }) => {
    const formData = await request.formData();
    const cache = await caches.open('shared-books');
    await Promise.all(formData.getAll('file').filter((file) => file && file.name).map((file, index) =>
      cache.put(`/shared-books/${Date.now()}-${index}`, new Response(file, { headers: { 'Content-Type': file.type, 'X-File-Name': encodeURIComponent(file.name) } }))
    ));
    return Response.redirect('/pdfs?shared=1', 303);
  },
  'POST'
);
