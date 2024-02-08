const VERSION = '2.1';

const APP_STATIC_RESOURCES = [
	'manifest.json',
	'images/512.png',
	'.',
	'index.html',
	'color-scheme.js',
	'resources.js',
	'game.js',
	'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
	'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js',
	'https://cdn.jsdelivr.net/npm/js-md5@0.8.3/src/md5.min.js',
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(VERSION);
			cache.addAll(APP_STATIC_RESOURCES);
		})(),
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			const names = await caches.keys();
			await Promise.all(
				names.map(name => {
					if (name !== VERSION)
						return caches.delete(name);
				}),
			);
			//await clients.claim();
		})(),
	);
});

self.addEventListener('fetch', (event) => {
	//console.log(`fetch ${event.request.url}`);
	event.respondWith(
		(async () => {
			const cache = await caches.open(VERSION);
			const cachedResponse = await cache.match(event.request);
			if (cachedResponse)
				return cachedResponse;
			const fetchedResponse = await fetch(event.request);
			//console.log(`response ${fetchedResponse.url}`);
			return fetchedResponse;
		})(),
	);
});
