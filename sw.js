// Choose a cache name
const cacheName = "cache-v1";
// List the files to precache
const precacheResources = [
  "./manifest.json",
  "./index.html",
  "./stylem.css",
  "./script.js",
  "./timetables/arsha.json",
  "./timetables/emily.json",
  "./timetables/georgy.json",
  "./timetables/justus.json",
  "./timetables/naveen.json",
  "./timetables/neha.json",
  "./timetables/rohan.json",
  "./images/avatars/arsha.webp",
  "./images/avatars/emily.webp",
  "./images/avatars/georgy.webp",
  "./images/avatars/justus.webp",
  "./images/avatars/naveen.webp",
  "./images/avatars/neha.webp",
  "./images/avatars/rohan.webp",
  "./images/backgrounds/bg4.png",
  "./images/backgrounds/bg5.png",
  "./images/logo/logo.png",
];

// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener("install", (event) => {
  console.log("Service worker install event!");
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(precacheResources))
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service worker activate event!");
});

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener("fetch", (event) => {
  console.log("Fetch intercepted for:", event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
