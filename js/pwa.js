// PWA setup - manifest and service worker
export function createManifest(manifestLink) {
  const manifest = {
    name: 'WarungCOD',
    short_name: 'WarungCOD',
    description: 'Premium lightweight food ordering PWA for small warungs.',
    icons: [
      {
        src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"%3E%3Crect width="128" height="128" rx="32" fill="%23ff7a18"/%3E%3Ctext x="50%25" y="50%25" fill="white" font-family="Inter,system-ui,sans-serif" font-size="64" text-anchor="middle" dominant-baseline="middle"%3EW%3C/text%3E%3C/svg%3E',
        sizes: '128x128',
        type: 'image/svg+xml'
      }
    ],
    start_url: './index.html',
    display: 'standalone',
    background_color: '#090b12',
    theme_color: '#ff7a18'
  };

  const blob = new Blob([JSON.stringify(manifest)], {
    type: 'application/manifest+json'
  });
  manifestLink.href = URL.createObjectURL(blob);
}

export function registerServiceWorker() {
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    const swCode = `self.addEventListener('install', event => { event.waitUntil(caches.open('warungcod-shell-v1').then(cache => cache.addAll(['./', './index.html'])).then(() => self.skipWaiting())); }); self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); }); self.addEventListener('fetch', event => { if (event.request.method !== 'GET') return; event.respondWith(caches.match(event.request).then(cacheRes => cacheRes || fetch(event.request).then(fetchRes => { const resClone = fetchRes.clone(); caches.open('warungcod-shell-v1').then(cache => cache.put(event.request, resClone)); return fetchRes; }))); });`;
    const swBlob = new Blob([swCode], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(swBlob);
    navigator.serviceWorker
      .register(swUrl)
      .catch(() => console.warn('SW registration failed'));
  }
}
