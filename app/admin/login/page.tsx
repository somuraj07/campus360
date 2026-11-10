"use client";

import { useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/_components/constants/routes";
import LoginForm from "@/app/_components/auth/LoginForm";
import { shouldForceSuperAdminRelogin } from "@/lib/auth/superAdminBrowserSession";
import AuthShell from "@/app/_components/auth/AuthShell";
export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    const role = session.user.role;

    // Stale cookie: SuperAdminSessionGuard will sign out; stay on login until then.
    if (role === "SUPERADMIN" && shouldForceSuperAdminRelogin()) {
      return;
    }

    switch (role) {      case "SUPERADMIN":
        router.replace(ROUTES.SUPERADMIN);
        break;
      case "SCHOOLADMIN":
        router.replace(ROUTES.SCHOOLADMIN);
        break;
      case "CHAIRMAN":
        router.replace(ROUTES.CHAIRMAN);
        break;
      case "TEACHER":
        router.replace(ROUTES.TEACHER);
        break;
      case "STUDENT":
        router.replace(ROUTES.PARENT);
        break;
      default:
        router.replace(ROUTES.UNAUTHORIZED);
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-elev-2 border border-line-strong">
              <div className="w-12 h-12 border-4 border-line border-t-primary rounded-full animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-fg mb-2">Loading</h2>
          <p className="text-fg-muted">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <AuthShell>
      <Suspense fallback={<div className="text-fg-muted">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
