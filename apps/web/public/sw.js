const CACHE_NAME = "pdf2md-app-shell-v1";
const APP_SHELL_URLS = ["/", "/privacy/", "/pdfjs/pdf.min.mjs"];

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function shouldRuntimeCache(request, url) {
  if (request.method !== "GET" || !isSameOrigin(url)) return false;

  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/pdfjs/") ||
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "font" ||
    request.destination === "worker" ||
    request.destination === "image"
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.all(
        APP_SHELL_URLS.map(async (url) => {
          try {
            await cache.add(new Request(url, { cache: "reload" }));
          } catch {
            // A missed shell URL should not break first-load conversion.
          }
        }),
      );
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      ),
    ),
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (event.request.method !== "GET" || !isSameOrigin(url)) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(async () => {
          return (
            (await caches.match(event.request)) ||
            (await caches.match("/")) ||
            Response.error()
          );
        }),
    );
    return;
  }

  if (!shouldRuntimeCache(event.request, url)) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    }),
  );
});
