"use strict";

const CACHE_NAME = "iron-purple-v10-coach-fix";
const APP_VERSION = "2026-08-21-coach-2";
const APP_ASSETS = ["./", "./index.html", "./professor/index.html", `./style.css?v=${APP_VERSION}`, `./app.js?v=${APP_VERSION}`, "./manifest.json", "./icon.svg", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];
const EXERCISE_IMAGE_SOURCES = [
  { origin: "https://cdn.jsdelivr.net", path: "/gh/yuhonas/free-exercise-db@main/exercises/" },
  { origin: "https://raw.githubusercontent.com", path: "/yuhonas/free-exercise-db/main/exercises/" }
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestURL = new URL(event.request.url);
  const isExerciseImage = EXERCISE_IMAGE_SOURCES.some((source) => requestURL.origin === source.origin && requestURL.pathname.startsWith(source.path));
  if (requestURL.origin !== self.location.origin && !isExerciseImage) return;

  if (isExerciseImage) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok || response.type === "opaque") {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        });
      })
    );
    return;
  }

  if (event.request.mode === "navigate") {
    const professorPath = new URL("./professor/", self.location.href).pathname;
    const navigationCacheKey = requestURL.pathname.startsWith(professorPath) ? "./professor/index.html" : "./index.html";
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(navigationCacheKey, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match(navigationCacheKey)))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
