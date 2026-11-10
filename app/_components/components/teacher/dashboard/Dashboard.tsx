"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TeacherDashboardContent } from "./dashboardComponents/TeacherDashboardSections";
import { TeacherDashboardData } from "./dashboardComponents/types";
import TimellyLoader from "../../common/TimellyLoader";
import { SaPage, SaPageHeader, btnClass } from "../../common/ui";
import { BookOpen, MessageSquare } from "lucide-react";
import {
  loadTeacherDashboard,
  peekTeacherDashboard,
} from "@/lib/teacher/loadTeacherFastTabs";

export default function TeacherDashboard() {
  const router = useRouter();
  const initial = peekTeacherDashboard();
  const [data, setData] = useState<TeacherDashboardData | null>(() => initial);
  const [loading, setLoading] = useState(() => !initial);
  const [error, setError] = useState<string | null>(null);

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }

  const load = useCallback(async (revalidate = false) => {
    if (!revalidate) {
      const cached = peekTeacherDashboard();
      if (cached) {
        setData(cached);
        setLoading(false);
        void load(true);
        return;
      }
      setLoading(true);
    }

    try {
      const payload = await loadTeacherDashboard({ revalidate: true });
      setData(payload);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load dashboard";
      setData((current) => {
        if (!current) setError(message);
        return current;
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(false);
  }, [load]);

  if (loading && !data) {
    return (
      <main className="flex-1 px-3 sm:px-4">
        <TimellyLoader title="Loading dashboard" steps={["Profile", "Classes", "Updates"]} />
      </main>
    );
  }

  if (error && !data) {
    return (
      <main className="flex-1 overflow-y-auto px-3 sm:px-4">
        <div className="py-6 sm:p-6 text-center text-red-700 dark:text-red-400">{error}</div>
      </main>
    );
  }

  const stats = data?.stats ?? { totalClasses: 0, pendingChats: 0 };

  return (
    <SaPage>
      <SaPageHeader
        eyebrow={new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        title={`${getGreeting()}, ${data?.profile?.name ?? "Teacher"}`}
        description={`You teach ${stats.totalClasses} class${stats.totalClasses === 1 ? "" : "es"} and have ${
          stats.pendingChats
        } new parent message${stats.pendingChats === 1 ? "" : "s"}.`}
        actions={
          <>
            <button type="button" onClick={() => router.push("/teacher?tab=chat")} className={btnClass("secondary")}>
              <MessageSquare size={16} />
              Messages
            </button>
            <button type="button" onClick={() => router.push("/teacher?tab=classes")} className={btnClass("primary")}>
              <BookOpen size={16} />
              My classes
            </button>
          </>
        }
      />

      {data && (
        <TeacherDashboardContent
          data={data}
          onManageClasses={() => router.push("/teacher?tab=classes")}
          onOpenChat={() => router.push("/teacher?tab=chat")}
        />
      )}
    </SaPage>
  );
}
