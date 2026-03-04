
// ==========================================
// 🔥 REPACK PWA SERVICE WORKER (PRO VERSION)
// ==========================================

// 🔁 GANTI VERSI SETIAP UPDATE BESAR
const CACHE_VERSION = "repack-v7.7";
const CACHE_STATIC = `${CACHE_VERSION}-static`;
const CACHE_DYNAMIC = `${CACHE_VERSION}-dynamic`;

// File penting saja (JANGAN cache icon di sini)
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json"
];

// ==========================
// INSTALL
// ==========================
self.addEventListener("install", (event) => {
  console.log("Service Worker Installing...");
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// ==========================
// ACTIVATE
// ==========================
self.addEventListener("activate", (event) => {
  console.log("Service Worker Activated...");

  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!key.startsWith(CACHE_VERSION)) {
            console.log("Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  return self.clients.claim();
});

// ==========================
// FETCH
// ==========================
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // ❌ Lewati POST & API Google
  if (
    req.method !== "GET" ||
    req.url.includes("script.google.com") ||
    req.url.includes("api.ipify.org")
  ) {
    return;
  }

  // 🌐 Network First Strategy
  event.respondWith(
    fetch(req)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_DYNAMIC).then((cache) => {
          cache.put(req, clone);
        });
        return res;
      })
      .catch(() => {
        return caches.match(req);
      })
  );
});
