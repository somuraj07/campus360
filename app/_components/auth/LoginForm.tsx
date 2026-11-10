"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import {
  markSuperAdminBrowserSession,
  clearSuperAdminBrowserSession,
  setSuperAdminLoginInProgress,
  clearSuperAdminLoginInProgress,
} from "@/lib/auth/superAdminBrowserSession";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

function getEmailFromUrl(): string {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  return params.get("email") ?? "";
}

export default function LoginForm() {
  const searchParams = useSearchParams();
  const emailFromParams = searchParams?.get("email") ?? "";
  const emailParam = useMemo(() => emailFromParams || getEmailFromUrl(), [emailFromParams]);
  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState("");
  const isSwitchAccount = Boolean(emailParam?.trim());

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuperAdminLoginInProgress();

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        if (result.error.includes("deactivated") || result.error.includes("password not set")) {
          setError("This account is deactivated or has no password set. Please contact your administrator.");
        } else {
          setError(isSwitchAccount ? "Incorrect password" : "Invalid email or password");
        }
        return;
      }

      // Set marker immediately so SuperAdminSessionGuard does not sign out during session refresh.
      markSuperAdminBrowserSession();

      const session = await getSession();
      if (session?.user?.role !== "SUPERADMIN") {
        clearSuperAdminBrowserSession();
      }
    } finally {
      clearSuperAdminLoginInProgress();
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md">
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-pop">
        {/* Header - logo from public folder (root path) */}
        <div className="px-8 pt-8 pb-2 flex flex-col items-start text-left">
          <span aria-hidden className="mb-5 block h-1 w-10 rounded-full bg-accent" />
          <h1 className="text-2xl font-semibold tracking-tight text-fg mb-1.5">
            {isSwitchAccount ? "Switch Account" : "Welcome Back"}
          </h1>
          <p className="text-fg-muted text-sm">
            {isSwitchAccount
              ? "Enter your password to continue"
              : "Sign in to access your dashboard"}
          </p>
          {isSwitchAccount && email && (
            <p className="text-primary text-sm font-medium mt-2 truncate max-w-full">
              {email}
            </p>
          )}
        </div>

        {/* Form */}
        <div className="p-8 pt-6">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">{error}</p>
            )}

            {!isSwitchAccount && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-fg-muted uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-fg-subtle group-focus-within:text-primary pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your school email"
                    className="w-full pl-11 pr-4 py-3.5 bg-surface border border-line-strong rounded-lg text-fg placeholder:text-fg-faint focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-sm transition"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex justify-between ml-1">
                <label className="text-xs font-semibold text-fg-muted uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-fg-subtle group-focus-within:text-primary pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSwitchAccount ? "Enter password" : "••••••••"}
                  autoFocus={isSwitchAccount}
                  className="w-full pl-11 pr-12 py-3.5 bg-surface border border-line-strong rounded-lg text-fg placeholder:text-fg-faint focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-sm transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-fg-subtle hover:text-fg transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || (isSwitchAccount && !email)}
              className="group w-full py-3.5 bg-primary hover:bg-primary-hover text-on-primary font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="h-5 w-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
              ) : (
                <>
                  {isSwitchAccount ? "Continue" : "Sign In"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            {isSwitchAccount && (
              <a
                href="/admin/login"
                className="block text-center text-sm text-fg-subtle hover:text-fg-muted transition-colors"
              >
                Use a different account
              </a>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-elev-2 border-t border-line text-center">
          <p className="text-fg-subtle text-xs">
            Don&apos;t have an account?{" "}
            <a href="#" className="text-primary font-medium hover:underline">
              School Administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
