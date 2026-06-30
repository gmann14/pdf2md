import { describe, expect, it, vi } from "vitest";
import { registerPdf2mdServiceWorker } from "./pwa";

describe("registerPdf2mdServiceWorker", () => {
  it("skips registration outside production", async () => {
    // Dev-mode conversion debugging must not be affected by stale service
    // worker caches, especially because the dev E2E gate exercises PDF.js.
    const register = vi.fn();

    await expect(
      registerPdf2mdServiceWorker({
        nodeEnv: "development",
        location: { protocol: "https:", hostname: "pdf2md.example" },
        serviceWorker: { register },
      }),
    ).resolves.toBe(false);

    expect(register).not.toHaveBeenCalled();
  });

  it("skips insecure non-local origins", async () => {
    // Browser service workers require secure contexts; keeping this guard in
    // code avoids noisy registration failures on local static previews.
    const register = vi.fn();

    await expect(
      registerPdf2mdServiceWorker({
        nodeEnv: "production",
        location: { protocol: "http:", hostname: "preview.example" },
        serviceWorker: { register },
      }),
    ).resolves.toBe(false);

    expect(register).not.toHaveBeenCalled();
  });

  it("registers the scoped app-shell service worker in production", async () => {
    // Offline support is intentionally limited to our same-origin shell and
    // PDF.js assets; this verifies the root-scoped worker is the only runtime
    // hook installed by the app.
    const register = vi.fn(() =>
      Promise.resolve({} as ServiceWorkerRegistration),
    );

    await expect(
      registerPdf2mdServiceWorker({
        nodeEnv: "production",
        location: { protocol: "https:", hostname: "pdf2md.example" },
        serviceWorker: { register },
      }),
    ).resolves.toBe(true);

    expect(register).toHaveBeenCalledWith("/sw.js", { scope: "/" });
  });

  it("swallows registration failures after reporting them to the caller", async () => {
    // A browser that rejects service worker registration should not block the
    // converter UI; the PWA layer is progressive enhancement only.
    const error = new Error("registration rejected");
    const onError = vi.fn();

    await expect(
      registerPdf2mdServiceWorker({
        nodeEnv: "production",
        location: { protocol: "https:", hostname: "pdf2md.example" },
        serviceWorker: { register: vi.fn(() => Promise.reject(error)) },
        onError,
      }),
    ).resolves.toBe(false);

    expect(onError).toHaveBeenCalledWith(error);
  });
});
