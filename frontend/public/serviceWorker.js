const cacheName = "B-Twon Bites";

self.addEventListener("install", e => {
  e.waitUntil(
    (async function() {
      try {
        const values = await Promise.all([
          getMatchingFiles(
            "./assets/icons",
            /href\s*=\s*['"]([^'"]*\.(jpg|jpeg|png))['"]/gi
          ),
          getMatchingFiles(
            "./assets/images",
            /href\s*=\s*['"]([^'"]*\.(jpg|jpeg|png))['"]/gi
          ),
          getMatchingFiles(
            "./assets/images/pizza",
            /href\s*=\s*['"]([^'"]*\.(jpg|jpeg|png))['"]/gi
          ),
          getMatchingFiles(
            "./assets/images/chicken",
            /href\s*=\s*['"]([^'"]*\.(jpg|jpeg|png))['"]/gi
          ),
          getMatchingFiles(
            "./assets/images/chips",
            /href\s*=\s*['"]([^'"]*\.(jpg|jpeg|png))['"]/gi
          ),
          getMatchingFiles(
            "./assets/images/dikuku",
            /href\s*=\s*['"]([^'"]*\.(jpg|jpeg|png))['"]/gi
          ),
          getMatchingFiles(
            "./assets/images/magwinya",
            /href\s*=\s*['"]([^'"]*\.(jpg|jpeg|png))['"]/gi
          ),
          getMatchingFiles("./assets", /href\s*=\s*['"]([^'"]*\.(css|js))['"]/gi),
          getMatchingFiles("/", /href\s*=\s*['"]([^'"]*\.(json))['"]/gi)
        ]);

        let cacheItems = ["/"];
        cacheItems = cacheItems.concat(...values);
        let uniqueRequests = [...new Set(cacheItems)];

        const cache = await caches.open(cacheName);
        await cache.addAll(uniqueRequests);
      } catch (err) {
        console.error(err);
      }
    })()
  );

  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("Service worker is active!");
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
  console.log("Service worker ready to fetch data.");
});

async function getMatchingFiles(directory, regex) {
  try {
    const response = await fetch(directory);
    if (!response.ok) {
      throw new Error("Failed to fetch directory");
    }
    const html = await response.text();
    const fileMatches = html.match(regex);

    if (!fileMatches || fileMatches.length === 0) {
      return [];
    }
    return fileMatches.map(match => match.replace(/.*href="(.*)"/i, "$1"));
  } catch (err) {
    console.error(err);
    return [];
  }
}
