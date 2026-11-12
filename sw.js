// Dojo de Fran: funciona sin conexión. La app se actualiza sola cuando hay internet.
const V="dojo-ef7f07d62c";
const SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./favicon-64.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  if(r.mode==="navigate"){
    // primero la red (para recibir mejoras), y si no hay conexión, la copia guardada
    e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put("./index.html",cp))}return res}).catch(()=>caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(r).then(h=>h||fetch(r)));
});
