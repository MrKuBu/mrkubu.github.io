// Copyright 2022 Awesomium team LLC (MrKuBu). All Rights Reserved.

const staticCacheName = 'static-awt-cache-v1';
const dynamicCacheName = 'dynamic-awt-cache-v1';

const staticAssets = [
    './',
    './index.html',
    './files/fonts/MrKuBu.eot',
    './files/fonts/MrKuBu.svg',
    './files/fonts/MrKuBu.ttf',
    './files/fonts/MrKuBu.woff',
    './files/Icons/android-chrome-144x144.png',
    './files/Icons/android-chrome-192x192.png',
    './files/css/style.css',
    './files/js/mrkubu_app.js'
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
