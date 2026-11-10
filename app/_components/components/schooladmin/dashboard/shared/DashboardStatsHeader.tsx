import Link from "next/link";
import { Users, GraduationCap, UserCheck, Wallet, UserPlus, Megaphone } from "lucide-react";
import { StatCard } from "../../dashboard/components/StatCard";
import type { SchoolDashboardPayload } from "@/lib/school/loadSchoolDashboard";
import { SaPageHeader, btnClass } from "@/app/_components/components/common/ui";

const formatChange = (n: number) => (n >= 0 ? `+${n} this month` : `${n} this month`);

/** Greeting + headline KPIs. (Day collection now has its own card below the KPIs.) */
export function DashboardStatsHeader({
  userName,
  data,
  isInitialLoading,
}: {
  userName: string;
  data: SchoolDashboardPayload | null;
  isInitialLoading: boolean;
  selectedCollectionTo?: string;
  onDateChange?: (dateYmd: string) => void;
  collectionCash?: unknown;
  collectionOnline?: unknown;
  collectionLoading?: boolean;
}) {
  const loading = isInitialLoading;
  return (
    <div className="space-y-5">
      <SaPageHeader
        eyebrow={new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        title={`Welcome back, ${userName}!`}
        description="Here's what's happening in your school today."
        actions={
          <>
            <Link href="/schooladmin?tab=circulars" className={btnClass("secondary")}>
              <Megaphone size={16} />
              Circulars
            </Link>
            <Link href="/schooladmin?tab=add-user" className={btnClass("primary")}>
              <UserPlus size={16} />
              Add User
            </Link>
          </>
        }
      />
      <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 ${loading ? "animate-pulse" : ""}`}>
        <StatCard
          label="Total Classes"
          value={loading ? "…" : String(data?.stats.totalClasses ?? "—")}
          trend={loading ? "Loading" : data ? formatChange(data.stats.totalClassesChange) : "—"}
          Icon={Users}
        />
        <StatCard
          label="Total Students"
          value={loading ? "…" : data ? data.stats.totalStudents.toLocaleString("en-IN") : "—"}
          trend={loading ? "Loading" : data ? formatChange(data.stats.totalStudentsChange) : "—"}
          Icon={GraduationCap}
        />
        <StatCard
          label="Total Teachers"
          value={loading ? "…" : String(data?.stats.totalTeachers ?? "—")}
          trend={loading ? "Loading" : data ? formatChange(data.stats.totalTeachersChange) : "—"}
          Icon={UserCheck}
        />
        <StatCard
          label="Fees Collected"
          value={loading ? "…" : data?.stats.feesCollected ?? "—"}
          trend={loading ? "Loading" : data ? `${data.stats.feesCollectedPct}% collected` : "—"}
          trendColor="text-emerald-700 dark:text-emerald-400"
          Icon={Wallet}
        />
      </div>
    </div>
  );
}
