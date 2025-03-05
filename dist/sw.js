cacheName = "quiz"
const assets = [
    "./index.html",
    "./js/main.js",
    "./css/main.css",
    "./Html_Questions.json"
]

// installation
self.addEventListener("install", (installedEvent) => {
    installedEvent.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(assets);
        }).catch((error) => console.error("cache Error:", error)))
})

this.addEventListener("activate", (activatedEvent) => {
    activatedEvent.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((k) => k !== cacheName).map((k) => caches.delete(k))
            );

        })
    );

})

// self.addEventListener("fetch", (fetchedEvent) => {
//     fetchedEvent.respondWith(
//         caches.match(fetchedEvent.request).then(res => res)
//     )
// })

self.addEventListener("fetch", (fetchedEvent) => {
    fetchedEvent.respondWith(
        caches.match(fetchedEvent.request).then((cachedResponse) => {
            return cachedResponse || fetch(fetchedEvent.request)
        }).catch(() => console.error("Fetch error:", fetchedEvent.request.url))
    )
})