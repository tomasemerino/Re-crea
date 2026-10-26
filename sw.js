/* Re-crea · service worker
   Permite instalar el sitio como app y abrirlo aunque la conexión falle un momento.
   Estrategia "red primero": siempre intenta traer la versión nueva y solo usa la copia guardada si no hay internet.
   Así, cuando actualicen el sitio, la gente ve los cambios sin quedarse con versiones viejas. */
const CACHE = 'recrea-v3-1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(claves => Promise.all(claves.filter(c => c !== CACHE).map(c => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req)
      .then(res => {
        const copia = res.clone();
        caches.open(CACHE).then(c => c.put(req, copia));
        return res;
      })
      .catch(() => caches.match(req))
  );
});
