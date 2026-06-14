// CarePhrase Communication Academy — service worker.
// Caches the static app shell for an offline fallback. Deliberately does NOT
// cache dashboard, module, or API responses (user/sensitive data).

const CACHE = "carephrase-shell-v1";
const SHELL = [
  "/offline.html",
  "/logo-mark.png",
  "/icon-192.png",
  "/icon-512.png",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Only handle same-origin requests; let Supabase/OpenAI/etc. pass straight through.
  if (url.origin !== self.location.origin) return;

  // Never touch API or user-data routes — always go to the network, never cache.
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/dashboard") ||
    url.pathname.startsWith("/modules")
  ) {
    return;
  }

  // Page navigations: network-first, fall back to the offline page when offline.
  // Responses are not cached (avoids storing any authed/user content).
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match("/offline.html")));
    return;
  }

  // Static app-shell assets: cache-first with a background refresh.
  const isShellAsset =
    url.pathname.startsWith("/_next/static/") ||
    SHELL.includes(url.pathname) ||
    /\.(png|jpe?g|svg|ico|webmanifest|css|js|woff2?)$/.test(url.pathname);

  if (isShellAsset) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
  }
});
