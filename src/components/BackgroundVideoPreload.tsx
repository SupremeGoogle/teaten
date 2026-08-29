"use client";

import { useEffect } from "react";

const STORAGE_KEY = "teaten-location-video-preloaded";

type IdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (
      callback: () => void,
      options?: { timeout: number },
    ) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

/** Downloads a future page's video only after the current page is fully loaded. */
export default function BackgroundVideoPreload({ src }: { src?: string }) {
  useEffect(() => {
    if (!src || window.location.pathname === "/location") return;

    try {
      if (sessionStorage.getItem(STORAGE_KEY) === src) return;
    } catch {
      // Storage can be disabled; the HTTP cache still prevents duplicate downloads.
    }

    const controller = new AbortController();
    const idleWindow = window as IdleWindow;
    let idleHandle: number | undefined;
    let timeoutHandle: number | undefined;

    const download = async () => {
      try {
        // An open-ended range mirrors the request made by a media element while
        // still forcing the complete file to be consumed and cached.
        const response = await fetch(src, {
          cache: "force-cache",
          headers: { Range: "bytes=0-" },
          signal: controller.signal,
        });

        if (!response.ok) return;

        if (response.body) {
          const reader = response.body.getReader();
          while (!(await reader.read()).done) {
            // Reading every chunk completes the background download without
            // retaining the whole video in JavaScript memory.
          }
        } else {
          await response.blob();
        }

        try {
          sessionStorage.setItem(STORAGE_KEY, src);
        } catch {
          // The completed response remains available through the HTTP cache.
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          // A failed prefetch must never affect the page itself.
        }
      }
    };

    const scheduleDownload = () => {
      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(download, { timeout: 4000 });
      } else {
        timeoutHandle = window.setTimeout(download, 0);
      }
    };

    if (document.readyState === "complete") {
      scheduleDownload();
    } else {
      window.addEventListener("load", scheduleDownload, { once: true });
    }

    return () => {
      window.removeEventListener("load", scheduleDownload);
      if (idleHandle !== undefined) idleWindow.cancelIdleCallback?.(idleHandle);
      if (timeoutHandle !== undefined) window.clearTimeout(timeoutHandle);
      controller.abort();
    };
  }, [src]);

  return null;
}
