const CACHE_NAME = 'healthcheckpro-v1';
const urlsToCache = [
    '/',
    '/assets/css/main.css',
    '/assets/css/responsive.css',
    '/assets/js/main.js',
    '/assets/js/accessibility.js'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});
