import { highlightCode } from "$lib/highlightCode";
import type { TocEntry } from "$lib/types";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "@serwist/broadcast-update",
  toc: [
    {
      title: "@serwist/broadcast-update",
      id: "serwist-broadcast-update",
      children: [
        {
          title: "Introduction",
          id: "introduction",
        },
        {
          title: "How are updates determined?",
          id: "how-are-updates-determined",
        },
        {
          title: "Message format",
          id: "message-format",
        },
        {
          title: "Basic usage",
          id: "basic-usage",
          children: [
            {
              title: "Customize headers to check",
              id: "customize-headers-to-check",
            },
          ],
        },
        {
          title: "Advanced usage",
          id: "advanced-usage",
        },
      ],
    },
  ] satisfies TocEntry[],
  code: {
    messageFormat: highlightCode(
      locals.highlighter,
      {
        "event.data": {
          code: `import type { BroadcastMessage } from "@serwist/broadcast-update";

const data = {
  type: "CACHE_UPDATED",
  meta: "serwist-broadcast-update",
  // The two payload values vary depending on the actual update:
  payload: {
    cacheName: "the-cache-name",
    updatedURL: "https://example.com/",
  },
} satisfies BroadcastMessage;`,
          lang: "typescript",
        },
      },
      { idPrefix: "message-format" },
    ),
    basicUsage: {
      setup: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `import { registerRoute } from "@serwist/routing";
import { StaleWhileRevalidate } from "@serwist/strategies";
import { BroadcastUpdatePlugin } from "@serwist/broadcast-update";

registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new StaleWhileRevalidate({
    plugins: [new BroadcastUpdatePlugin()],
  }),
);`,
            lang: "typescript",
          },
        },
        {
          idPrefix: "basic-usage",
        },
      ),
      eventListener: highlightCode(
        locals.highlighter,
        {
          "message.ts": {
            code: `import { CACHE_UPDATED_MESSAGE_META } from "@serwist/broadcast-update";

navigator.serviceWorker.addEventListener("message", async (event) => {
  // Optional: ensure the message came from \`@serwist/broadcast-update\`
  if (event.data.meta === CACHE_UPDATED_MESSAGE_META) {
    const { cacheName, updatedURL } = event.data.payload;

    // Do something with cacheName and updatedURL.
    // For example, get the cached content and update
    // the content on the page.
    const cache = await caches.open(cacheName);
    const updatedResponse = await cache.match(updatedURL);
    if (updatedResponse) {
      const updatedText = await updatedResponse.text();
    }
  }
});`,
            lang: "typescript",
          },
        },
        {
          idPrefix: "basic-usage-event-listener",
        },
      ),
      customizeHeaders: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `import { registerRoute } from "@serwist/routing";
import { BroadcastUpdatePlugin, defaultHeadersToCheck } from "@serwist/broadcast-update";
import { StaleWhileRevalidate } from "@serwist/strategies";

registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new StaleWhileRevalidate({
    plugins: [
      new BroadcastUpdatePlugin({
        headersToCheck: [...defaultHeadersToCheck, "X-My-Custom-Header"],
      }),
    ],
  }),
);`,
            lang: "typescript",
          },
        },
        { idPrefix: "basic-usage-customize-headers" },
      ),
    },
    advancedUsage: {
      notifyIfUpdated: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `import { BroadcastCacheUpdate, defaultHeadersToCheck } from "@serwist/broadcast-update";

declare const self: ServiceWorkerGlobalScope;

const broadcastUpdate = new BroadcastCacheUpdate({
  headersToCheck: [...defaultHeadersToCheck, "X-My-Custom-Header"],
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cacheName = "api-cache";
      const request = new Request("https://example.com/api");
      
      const cache = await caches.open(cacheName);
      const oldResponse = await cache.match(request);

      // Is the cached response stale?
      const shouldRevalidate = true;

      if (!shouldRevalidate && oldResponse) {
        return oldResponse;
      }

      const newResponse = await fetch(request);

      broadcastUpdate.notifyIfUpdated({
        cacheName,
        oldResponse,
        newResponse,
        request,
        event,
      });

      return newResponse;
    })(),
  );
});`,
            lang: "typescript",
          },
        },
        {
          idPrefix: "advanced-usage",
        },
      ),
    },
  },
});
