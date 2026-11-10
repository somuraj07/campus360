"use client";

import { Download, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { usePwaInstall } from "@/app/_components/hooks/usePwaInstall";

const DISMISS_KEY = "timelly-pwa-install-dismissed";

export default function InstallAppBanner() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(true);
  const { status, install, canInstall } = usePwaInstall();

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  const dismiss = useCallback(() => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }, []);

  const handleInstall = useCallback(async () => {
    const accepted = await install();
    if (accepted) {
      sessionStorage.setItem(DISMISS_KEY, "1");
      setDismissed(true);
    }
  }, [install]);

  if (
    pathname === "/download" ||
    pathname === "/qr" ||
    pathname === "/privacy-policy" ||
    pathname === "/terms" ||
    !canInstall ||
    dismissed
  ) {
    return null;
  }

  return (
    <div
      className="fixed bottom-20 left-3 right-3 z-[60] mx-auto max-w-lg rounded-2xl border border-primary/30 bg-surface p-4 shadow-pop shadow-black/40 lg:bottom-6 lg:left-auto lg:right-6"
      role="dialog"
      aria-label="Install RS Solutions app"
    >
      <div className="flex items-start gap-3">
        <img
          src="/pwa-192.png"
          alt=""
          className="h-12 w-12 shrink-0 rounded-xl border border-line object-cover"
          width={48}
          height={48}
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-fg">Install RS Solutions</p>
          <p className="mt-0.5 text-xs text-fg-muted leading-snug">
            Add to your home screen or desktop for quick access with the RS Solutions logo.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void handleInstall()}
              disabled={status === "installing"}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-on-primary hover:bg-primary-hover transition disabled:opacity-60"
            >
              <Download className="h-3.5 w-3.5" aria-hidden />
              {status === "installing" ? "Installing…" : "Install app"}
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="rounded-xl border border-line px-3 py-2 text-xs font-semibold text-fg-muted hover:bg-elev-2 transition"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-lg p-1 text-fg-subtle hover:text-fg hover:bg-elev-2 transition"
          aria-label="Dismiss install prompt"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
