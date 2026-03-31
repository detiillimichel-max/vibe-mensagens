// VIBE OIO ONE - SERVICE WORKER 🔔
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => self.clients.claim());

// ✅ Notificação push
self.addEventListener('push', e => {
    const data = e.data ? e.data.json() : {};
    e.waitUntil(
        self.registration.showNotification(data.titulo || 'Vibe OIO ONE', {
            body: data.corpo || 'Nova mensagem!',
            icon: 'https://ui-avatars.com/api/?name=OIO&background=1a73e8&color=fff',
            badge: 'https://ui-avatars.com/api/?name=OIO&background=1a73e8&color=fff',
            vibrate: [300, 100, 300, 100, 300],
            tag: 'vibe-msg',
            renotify: true
        })
    );
});

// ✅ Clique na notificação abre o app
self.addEventListener('notificationclick', e => {
    e.notification.close();
    e.waitUntil(
        clients.matchAll({ type: 'window' }).then(lista => {
            if (lista.length > 0) lista[0].focus();
            else clients.openWindow('/');
        })
    );
});
