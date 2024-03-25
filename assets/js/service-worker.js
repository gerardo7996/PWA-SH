const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/assets/logo.png', 
  '/app/pages',
  '/src/icon/user.png'
];

self.addEventListener('install', function(event) {
  console.log('Service Worker installed');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});


self.addEventListener('activate', function(event) {
  console.log('Service Worker activated');
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          console.log(response);
          return response; // Retorna la respuesta almacenada en caché si está disponible
        }

        // Si la solicitud no está en caché, solicita la vista HTML al servidor
        return fetch(event.request)
          .then(function(response) {
            console.log(response);
            // Abre la caché y almacena la nueva respuesta
            return caches.open('vistas-cache')
              .then(function(cache) {
                cache.put(event.request, response.clone());
                return response; // Retorna la respuesta al cliente
              });
          });
      })
  );
});