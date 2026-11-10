"use client";

import { Download, CheckCircle2, Smartphone } from "lucide-react";
import Link from "next/link";
import { usePwaInstall } from "@/app/_components/hooks/usePwaInstall";

export default function DownloadPage() {
  const { status, install, canInstall, isIos } = usePwaInstall({ autoPrompt: true });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8 text-center shadow-pop ">
        <img
          src="/pwa-192.png"
          alt="RS Solutions"
          className="mx-auto h-20 w-20 rounded-2xl border border-line object-cover"
          width={80}
          height={80}
        />

        <h1 className="mt-5 text-2xl font-bold text-fg">Install RS Solutions</h1>
        <p className="mt-2 text-sm text-fg-muted leading-relaxed">
          Scan the QR code or open this page on your phone to add RS Solutions to your home screen.
        </p>

        <div className="mt-8">
          {status === "checking" && (
            <p className="text-sm text-fg-muted">Preparing install…</p>
          )}

          {status === "installing" && (
            <p className="text-sm text-primary">Opening install prompt…</p>
          )}

          {status === "installed" && (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-xl bg-primary/15 px-4 py-3 text-sm font-medium text-primary">
                <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden />
                RS Solutions is installed on this device
              </div>
              <Link
                href="/"
                className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary hover:bg-primary-hover transition"
              >
                Open RS Solutions
              </Link>
            </div>
          )}

          {status === "available" && canInstall && (
            <button
              type="button"
              onClick={() => void install()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary hover:bg-primary-hover transition"
            >
              <Download className="h-4 w-4" aria-hidden />
              Install app
            </button>
          )}

          {status === "unavailable" && isIos && (
            <div className="rounded-xl border border-line bg-elev-1 p-4 text-left">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-fg">
                <Smartphone className="h-4 w-4 text-primary" aria-hidden />
                Add to Home Screen
              </div>
              <ol className="list-decimal space-y-1 pl-5 text-xs text-fg-muted">
                <li>Tap the Share button in Safari</li>
                <li>Choose &quot;Add to Home Screen&quot;</li>
                <li>Tap Add</li>
              </ol>
            </div>
          )}

          {status === "unavailable" && !isIos && (
            <div className="space-y-3 text-sm text-fg-muted">
              <p>
                Open this page in Chrome on Android or use the browser menu and choose
                &quot;Install app&quot; or &quot;Add to Home screen&quot;.
              </p>
              <Link
                href="/"
                className="inline-flex w-full items-center justify-center rounded-xl border border-line px-4 py-3 font-semibold text-fg hover:bg-elev-2 transition"
              >
                Continue in browser
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
