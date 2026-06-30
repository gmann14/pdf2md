"use client";

import { useEffect } from "react";
import { registerPdf2mdServiceWorker } from "@/lib/pwa";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    void registerPdf2mdServiceWorker();
  }, []);

  return null;
}
