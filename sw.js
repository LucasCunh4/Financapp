const CACHE_NAME = 'minhas-financas-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/icons/android/android-launchericon-192-192.png', // Caminho atualizado
    '/icons/android/android-launchericon-512-512.png'  // Caminho atualizado
];

// Evento de Instalação: Salva os arquivos no cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento de Fetch: Intercepta as requisições
// Se o arquivo estiver no cache, entrega a versão do cache.
// Se não, busca na rede.
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response; // Retorna do cache
                }
                return fetch(event.request); // Busca na rede
            })
    );
});
