const CACHE_NAME = 'khamar-pro-v1';

// ইনস্টল করার সময় পেজগুলো সেভ করবে
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(['./', './index.html', './medicines.js', './stock.js', './daily_report.js']);
        })
    );
});

// ইন্টারনেট থাকলে নেট থেকে আনবে, না থাকলে সেভ করা ফাইল দেখাবে
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
