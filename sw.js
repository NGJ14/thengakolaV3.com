// Choose a cache name
const cacheName = "cache-v2";

// List the files to precache
const precacheResources = [
  "./index.html",
  "./stylem.css",
  "./script.js",
  "./profile.html",
  "./profileStyle.css",
  "./profile.js",
  "./timetables/arsha.json",
  "./timetables/emily.json",
  "./timetables/georgy.json",
  "./timetables/justus.json",
  "./timetables/naveen.json",
  "./timetables/neha.json",
  "./timetables/rohan.json",
  "./images/backgrounds/bg4.png",
  "./images/backgrounds/bg5.png",
  "./images/logo/logo.png",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
];

// When sw is installing, open the cache and add the precache resources to it
self.addEventListener("install", (event) => {
  console.log("Service worker install event!");
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(precacheResources))
  );
});

// When activating sw, delete all caches except current
self.addEventListener("activate", (event) => {
  console.log("Service worker activate event!");
  event.waitUntil(
    (async function () {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((tmpCacheName) => cacheName != tmpCacheName)
          .map((tmpCacheName) => caches.delete(tmpCacheName))
      );
    })()
  );
});

// TODO: switch to https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
// Get from cache if exists but also get from network and replace cache item
self.addEventListener("fetch", (event) => {
  let url = new URL(event.request.url);
  url.searchParams.delete("name");

  console.log("Fetch intercepted for:", url.toString());

  event.respondWith(
    (async function () {
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match(url);
      const networkResponsePromise = fetch(url);
      event.waitUntil(
        (async function () {
          try {
            const networkResponse = await networkResponsePromise;
            await cache.put(url, networkResponse.clone());
          } catch (e) {
            console.log("offline, no fetch");
          }
        })()
      );
      return cachedResponse || networkResponse;
    })()
  );
});
