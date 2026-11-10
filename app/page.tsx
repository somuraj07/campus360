"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ROUTES } from "@/app/_components/constants/routes";
import { shouldForceSuperAdminRelogin } from "@/lib/auth/superAdminBrowserSession";
import Spinner from "./_components/components/common/Spinner";
import LoginForm from "./_components/auth/LoginForm";
import AuthShell from "./_components/auth/AuthShell";

export default function Home() {
  const router = useRouter();
  const { status, data: session } = useSession();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Only redirect if we have a confirmed authenticated status with a valid role
    // Never redirect to /unauthorized from home page
    if (status === "authenticated" && session?.user?.role && !hasRedirected) {
      if (session.user.role === "SUPERADMIN" && shouldForceSuperAdminRelogin()) {
        return;
      }

      const roleRoutes: Record<string, string> = {
        SUPERADMIN: ROUTES.SUPERADMIN,
        SCHOOLADMIN: ROUTES.SCHOOLADMIN,
        CHAIRMAN: ROUTES.CHAIRMAN,
        STUDENT: ROUTES.PARENT,
        TEACHER: ROUTES.TEACHER,
      };
      
      const destination = roleRoutes[session.user.role];
      
      // Only redirect if we have a valid destination
      // If role doesn't match, stay on home page (don't redirect to unauthorized)
      if (destination) {
        setHasRedirected(true);
        router.replace(destination);
      }
    }
  }, [status, session?.user?.role, router, hasRedirected]);

  // Always show login form for unauthenticated users
  // Show loading only while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-elev-2 border border-line-strong">
              <Spinner/>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-fg mb-2">Loading</h2>
          <p className="text-fg-muted">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If authenticated but redirecting, show loading
  if (status === "authenticated" && session?.user?.role && hasRedirected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-elev-2 border border-line-strong">
              <Spinner/>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-fg mb-2">Redirecting</h2>
          <p className="text-fg-muted">Taking you to your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show login form for everyone else (unauthenticated or authenticated without valid role)
  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  );
}
