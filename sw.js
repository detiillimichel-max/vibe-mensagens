// ================================================
//  VIBE MENSAGENS — Service Worker (à prova de falhas)
//  GitHub Pages: detiillimichel-max.github.io/vibe-mensagens
// ================================================

const CACHE_NAME = 'vibe-v1';

const ARQUIVOS = [
  '/vibe-mensagens/',
  '/vibe-mensagens/index.html',
  '/vibe-mensagens/css/style.css',
  '/vibe-mensagens/js/script.js',
  '/vibe-mensagens/app/ehub_logic.js',
  '/vibe-mensagens/app/nostalgia.js',
  '/vibe-mensagens/app/jogos.js',
  '/vibe-mensagens/icons/icon-192.png'
];

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return Promise.allSettled(
        ARQUIVOS.map(function(url) {
          return cache.add(url).catch(function() {
            console.warn('[SW] Não cacheou (ok):', url);
          });
        })
      );
    }).catch(function(err) {
      console.warn('[SW] Erro no install (não bloqueia):', err);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    }).then(function() {
      return self.clients.claim();
    }).catch(function(err) {
      console.warn('[SW] Erro no activate (não bloqueia):', err);
    })
  );
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  var url = event.request.url;

  if (
    url.includes('firebaseio.com') ||
    url.includes('googleapis.com') ||
    url.includes('gstatic.com') ||
    url.includes('cdnjs.cloudflare.com') ||
    url.includes('ui-avatars.com') ||
    url.startsWith('chrome-extension')
  ) return;

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      var networkFetch = fetch(event.request).then(function(response) {
        if (response && response.status === 200 && response.type !== 'opaque') {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(function() { return null; });

      return cached || networkFetch.then(function(res) {
        if (res) return res;
        if (event.request.destination === 'document') {
          return caches.match('/vibe-mensagens/index.html');
        }
      });
    }).catch(function() {
      if (event.request.destination === 'document') {
        return caches.match('/vibe-mensagens/index.html');
      }
    })
  );
});

self.addEventListener('push', function(event) {
  var titulo = 'Vibe Mensagens';
  var corpo  = 'Você tem uma nova mensagem! 💬';
  var icone  = '/vibe-mensagens/icons/icon-192.png';
  var url    = '/vibe-mensagens/';

  try {
    if (event.data) {
      var dados = event.data.json();
      titulo = dados.title || titulo;
      corpo  = dados.body  || corpo;
      icone  = dados.icon  || icone;
      url    = dados.url   || url;
    }
  } catch(e) {
    try { corpo = event.data.text(); } catch(e2) {}
  }

  event.waitUntil(
    self.registration.showNotification(titulo, {
      body:     corpo,
      icon:     icone,
      badge:    icone,
      vibrate:  [300, 100, 300, 100, 300],
      tag:      'vibe-msg',
      renotify: true,
      data:     { url: url }
    }).catch(function(err) {
      console.warn('[SW] Erro ao mostrar notificação:', err);
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  var destino = '/vibe-mensagens/';
  try { destino = event.notification.data.url || destino; } catch(e) {}

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(lista) {
      for (var i = 0; i < lista.length; i++) {
        var c = lista[i];
        if (c.url.includes('/vibe-mensagens') && 'focus' in c) {
          return c.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(destino);
    }).catch(function(err) {
      console.warn('[SW] Erro no clique:', err);
    })
  );
});

self.addEventListener('pushsubscriptionchange', function(event) {
  event.waitUntil(
    self.registration.pushManager.subscribe({ userVisibleOnly: true })
      .then(function(sub) { console.log('[SW] Subscription renovada:', sub); })
      .catch(function(err) { console.warn('[SW] Não renovou subscription:', err); })
  );
});
