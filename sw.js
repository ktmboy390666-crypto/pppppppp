const CACHE_NAME = 'khamar-app-v1';
const urlsToCache = [
    './',
    './index.html',
    './medicines.js',
    './stock.js',
    './daily_report.js',
    './notifications.js'
];

// ইনস্টল করার সময় ফাইলগুলো ক্যাশে (Cache) সেভ করবে
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// ইন্টারনেট না থাকলে ক্যাশ থেকে ফাইল দেখাবে
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});
