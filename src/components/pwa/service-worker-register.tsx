"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    let live = true;
    let updateSignaled = false;
    const signalUpdate = () => {
      if (live && !updateSignaled) {
        updateSignaled = true;
        window.dispatchEvent(new Event("hamlist:pwa-update"));
      }
    };
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).then((registration) => {
      if (registration.waiting && navigator.serviceWorker.controller) signalUpdate();
      registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        installing?.addEventListener("statechange", () => {
          if (installing.state === "installed" && navigator.serviceWorker.controller) signalUpdate();
        });
      });
    }).catch((error: unknown) => {
      console.warn("HamList service worker registration failed.", error);
    });
    return () => { live = false; };
  }, []);

  return null;
}
