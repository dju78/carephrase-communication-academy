"use client";

import { useEffect } from "react";

/** Registers the PWA service worker once on the client. */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registration failures are non-fatal; the app works without the SW.
      });
    }
  }, []);
  return null;
}
