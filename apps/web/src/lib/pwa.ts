type RegisterableServiceWorker = Pick<ServiceWorkerContainer, "register">;

interface RegisterServiceWorkerOptions {
  nodeEnv?: string;
  location?: Pick<Location, "hostname" | "protocol">;
  serviceWorker?: RegisterableServiceWorker;
  onError?: (error: unknown) => void;
}

const SERVICE_WORKER_URL = "/sw.js";

function getBrowserServiceWorker(): RegisterableServiceWorker | undefined {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return undefined;
  }

  return navigator.serviceWorker;
}

function getBrowserLocation(): Pick<Location, "hostname" | "protocol"> | undefined {
  if (typeof window === "undefined") return undefined;
  return window.location;
}

function isSecureContext(location: Pick<Location, "hostname" | "protocol">) {
  return location.protocol === "https:" || location.hostname === "localhost";
}

export async function registerPdf2mdServiceWorker(
  options: RegisterServiceWorkerOptions = {},
): Promise<boolean> {
  const nodeEnv = options.nodeEnv ?? process.env.NODE_ENV;
  const location = options.location ?? getBrowserLocation();
  const serviceWorker = options.serviceWorker ?? getBrowserServiceWorker();

  if (nodeEnv !== "production" || !location || !serviceWorker || !isSecureContext(location)) {
    return false;
  }

  try {
    await serviceWorker.register(SERVICE_WORKER_URL, { scope: "/" });
    return true;
  } catch (error) {
    options.onError?.(error);
    return false;
  }
}
