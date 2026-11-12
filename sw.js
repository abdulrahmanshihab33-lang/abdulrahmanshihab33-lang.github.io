/* Gamify Agent service worker: offline app shell */
const VER='ga-v14-5';
const SHELL=['./','./index.html','./manifest.webmanifest','./config.js','./hog-192.png','./hog-512.png','./hog-maskable-512.png','./hog-apple-180.png','./hog-fav-32.png','./hog-intro.webm','./hog-poster.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VER).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VER).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin!==location.origin)return;               /* never cache AI API or CDN calls */
  if(u.pathname.endsWith('/config.js')){e.respondWith(fetch(r).then(x=>{const cp=x.clone();caches.open(VER).then(c=>c.put(r,cp));return x}).catch(()=>caches.match(r)));return}
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const cp=x.clone();caches.open(VER).then(c=>c.put('./index.html',cp));return x}).catch(()=>caches.match('./index.html')));return}
  e.respondWith(caches.match(r).then(h=>h||fetch(r).then(x=>{if(x.ok){const cp=x.clone();caches.open(VER).then(c=>c.put(r,cp))}return x})));
});
