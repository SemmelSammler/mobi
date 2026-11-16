// Service Worker: App-Hülle vorab cachen, danach „Cache zuerst, im Hintergrund auffrischen“.
// WICHTIG: Bei jeder Änderung an Dateien VERSION erhöhen, sonst sehen installierte Apps alte Stände.
const VERSION = 'mobi-v6.2.0';
const SHELL = [
  '/',
  '/css/app.css',
  '/fonts/instrument-sans.woff2',
  '/js/app.js', '/js/ui.js', '/js/store.js', '/js/routine.js', '/js/training.js',
  '/js/figure.js', '/js/rig.js', '/js/figs.js', '/js/musclemap.js',
  '/js/data/index.js', '/js/data/mobility.js', '/js/data/muscles.js', '/js/data/programs.js',
  '/js/data/gym-ober.js', '/js/data/gym-unter.js', '/js/data/gym-arme.js',
  '/js/views/heute.js', '/js/views/training.js', '/js/views/workout.js', '/js/views/player.js',
  '/js/views/uebungen.js', '/js/views/verlauf.js', '/js/views/profil.js',
  '/manifest.webmanifest',
  '/icons/favicon.svg', '/icons/icon-192.png', '/icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION)
      .then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // Fremde Adressen (z. B. YouTube) nicht anfassen

  // Navigation: Netz zuerst (frische Version), Cache als Offline-Fallback.
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put('/', copy));
          }
          return res;
        })
        .catch(() => caches.match('/'))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetched = fetch(e.request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => cached || caches.match('/'));
      return cached || fetched;
    })
  );
});
