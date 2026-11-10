import Link from "next/link";
import BrandLogo from "../components/common/TimellyLogo";
import { ThemeToggleButton } from "../components/common/ThemeToggle";

/**
 * Split-screen frame for sign-in pages: navy brand panel (desktop) + form column.
 */
export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh bg-canvas lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-sidebar text-white lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        {/* Fine academic grid + gold arc ornament */}
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]">
          <defs>
            <pattern id="auth-grid" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M36 0H0V36" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -right-40 h-[34rem] w-[34rem] rounded-full border-[56px] border-accent/15"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full border border-accent/30"
        />

        <div className="relative">
          <BrandLogo isbrandLogoWhite size="auth" />
        </div>

        <div className="relative max-w-md">
          <span className="mb-6 block h-1 w-14 rounded-full bg-accent" />
          <p className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            School ERP &amp; Management Software
          </p>
        </div>

        <p className="relative text-xs text-white/50">© {new Date().getFullYear()} RS Solutions</p>
      </aside>

      {/* Form column */}
      <main className="relative flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <span className="lg:hidden">
            <BrandLogo isbrandLogoWhite={false} />
          </span>
          <ThemeToggleButton className="ml-auto" />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">{children}</div>

        <p className="text-center text-xs text-fg-subtle">
          <Link href="/terms" className="hover:text-fg hover:underline">Terms</Link>
          <span className="mx-2">·</span>
          <Link href="/privacy-policy" className="hover:text-fg hover:underline">Privacy</Link>
          <span className="mx-2">·</span>
          <Link href="/support" className="hover:text-fg hover:underline">Support</Link>
        </p>
      </main>
    </div>
  );
}
