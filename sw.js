const CACHE_NAME = 'vibe-v1';

// Instalação e Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['./', './index.html', './manifest.json']);
    })
  );
  self.skipWaiting();
});

// Ativação
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// ESCUTAR NOTIFICAÇÕES (O que falta para tocar no bloqueio)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'Nova Mensagem', body: 'Você recebeu um oi no Vibe!' };
  
  const options = {
    body: data.body,
    icon: './assets/icon-192x192.png', // Verifique se o caminho do seu ícone está certo
    badge: './assets/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: { url: './' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Abrir o app ao clicar na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
