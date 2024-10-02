// Copyright 2023 Awesomium team LLC (MrKuBu). All Rights Reserved.

const staticCacheName = 'static-awt-cache-v2';
const dynamicCacheName = 'dynamic-awt-cache-v2';

const staticAssets = [
    './',
    './index.html',
    './files/fonts/MrKuBu.eot',
    './files/fonts/MrKuBu.svg',
    './files/fonts/MrKuBu.ttf',
    './files/fonts/MrKuBu.woff',
    './files/fonts/fa-brands-400.eot',
    './files/fonts/fa-brands-400.svg',
    './files/fonts/fa-brands-400.ttf',
    './files/fonts/fa-brands-400.woff',
    './files/fonts/fa-regular-400.eot',
    './files/fonts/fa-regular-400.svg',
    './files/fonts/fa-regular-400.ttf',
    './files/fonts/fa-regular-400.woff',
    './files/fonts/fa-solid-900.eot',
    './files/fonts/fa-solid-900.svg',
    './files/fonts/fa-solid-900.ttf',
    './files/fonts/fa-solid-900.woff',
    './files/Icons/android-chrome-144x144.png',
    './files/Icons/android-chrome-192x192.png',
    './files/css/styles.css',
    './files/css/font-awesome.css',
    './files/js/mrkubu_app.js',
    './files/js/pixi.js',
    './files/js/script.js',
    './files/img/mrkubu.webp',
    './files/img/mrkubu_upd1.web'
];

self.addEventListener('install', async event => {
    const cache = await caches.open(staticCacheName);
    await cache.addAll(staticAssets);
});

self.addEventListener('activate', async event => {
    const cachesKeys = await caches.keys();
    const checkKeys = cachesKeys.map(async key => {
        if (![staticCacheName, dynamicCacheName].includes(key)) {
            await caches.delete(key);
        }
    });
    await Promise.all(checkKeys);
});

self.addEventListener('fetch', event => {
    event.respondWith(checkCache(event.request));
});

async function checkCache(req) {
    const cachedResponse = await caches.match(req);
    return cachedResponse || checkOnline(req);
}


async function checkOnline(req) {
    const cache = await caches.open(dynamicCacheName);
    try {
        const res = await fetch(req);
        await cache.put(req, res.clone());
        return res;
    } catch (error) {
        const cachedRes = await cache.match(req);
        if (cachedRes) {
            return cachedRes;
        } else if (req.url.indexOf('.html') !== -1) {
            return caches.match('./index.html');
        } else {
            return caches.match('./index.html');
        }
    }
}
