"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  School,
  Users,
  GraduationCap,
  Gauge,
  Plus,
  UserCheck,
  ArrowRight,
  Receipt,
  Trophy,
  Settings2,
  CreditCard,
} from "lucide-react";
import { formatNumber as fmtNum, formatAmount } from "../../utils/format";
import { BirthdayCard } from "../common/BirthdayCard";
import {
  fetchSuperadminDashboard,
  type SuperadminDashboardData,
} from "@/lib/api/superadminDashboard";
import {
  SaPage,
  SaPageHeader,
  KpiGrid,
  KpiCard,
  Panel,
  InitialsAvatar,
  ShareBar,
  EmptyState,
  LoadingBlock,
  Alert,
  btnClass,
} from "./shared/ui";

export type { SuperadminDashboardData };

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

const QUICK_LINKS = [
  { href: "/superadmin?tab=addschool", label: "Add a school", desc: "Onboard a new institution", icon: Plus },
  { href: "/superadmin?tab=addchairman", label: "Add a chairman", desc: "Create a chairman login", icon: UserCheck },
  { href: "/superadmin?tab=subscriptions", label: "Subscriptions", desc: "Billing mode & access", icon: Settings2 },
  { href: "/superadmin?tab=transactions", label: "Fees transactions", desc: "Turnover per school", icon: CreditCard },
];

export default function Dashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<SuperadminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [birthdaySchoolId, setBirthdaySchoolId] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    fetchSuperadminDashboard()
      .then(({ ok, status, data: payload }) => {
        if (!ok) {
          throw new Error(payload.message || (status === 403 ? "Forbidden" : "Failed to load"));
        }
        if (!cancelled) setData(payload);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error loading dashboard");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = data?.stats ?? { totalSchools: 0, totalStudents: 0, totalTeachers: 0 };
  const schools = useMemo(() => data?.schools ?? [], [data]);
  const feeTransactions = data?.feeTransactions ?? [];
  const topSchools = useMemo(
    () => [...schools].sort((a, b) => b.studentCount - a.studentCount).slice(0, 6),
    [schools]
  );
  const maxStudents = topSchools[0]?.studentCount ?? 0;
  const avgStudents = stats.totalSchools > 0 ? Math.round(stats.totalStudents / stats.totalSchools) : 0;
  const ratio = stats.totalTeachers > 0 ? Math.round(stats.totalStudents / stats.totalTeachers) : 0;
  const firstName = (session?.user?.name ?? "").split(" ")[0];

  return (
    <SaPage>
      <SaPageHeader
        eyebrow={new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        title={`${greeting()}${firstName ? `, ${firstName}` : ""}`}
        description="Here's how every school on the platform is doing today."
        actions={
          <>
            <Link href="/superadmin?tab=addchairman" className={btnClass("secondary")}>
              <UserCheck size={16} />
              Add chairman
            </Link>
            <Link href="/superadmin?tab=addschool" className={btnClass("primary")}>
              <Plus size={16} />
              Add school
            </Link>
          </>
        }
      />

      {error && <Alert tone="error">{error}</Alert>}

      {loading ? (
        <Panel>
          <LoadingBlock label="Loading dashboard…" />
        </Panel>
      ) : (
        <>
          <KpiGrid>
            <KpiCard label="Total schools" value={fmtNum(stats.totalSchools)} icon={School} hint="Active institutions" />
            <KpiCard label="Total students" value={fmtNum(stats.totalStudents)} icon={Users} tone="sky" hint="Across all schools" />
            <KpiCard
              label="Total teachers"
              value={fmtNum(stats.totalTeachers)}
              icon={GraduationCap}
              tone="gold"
              hint={ratio ? `≈ ${ratio} students per teacher` : "Across all schools"}
            />
            <KpiCard label="Avg. school size" value={fmtNum(avgStudents)} icon={Gauge} tone="green" hint="Students per school" />
          </KpiGrid>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
            <Panel
              className="xl:col-span-3"
              icon={Trophy}
              title="Top schools by students"
              description="Largest institutions on the platform"
              actions={
                <Link href="/superadmin?tab=schools" className={btnClass("ghost", "sm")}>
                  View all <ArrowRight size={14} />
                </Link>
              }
              bodyClassName="p-0"
            >
              {topSchools.length === 0 ? (
                <EmptyState
                  icon={School}
                  title="No schools yet"
                  description="Schools you onboard will appear here."
                  action={
                    <Link href="/superadmin?tab=addschool" className={btnClass("primary", "sm")}>
                      <Plus size={14} /> Add school
                    </Link>
                  }
                />
              ) : (
                <ul className="divide-y divide-line-subtle">
                  {topSchools.map((s, i) => (
                    <li key={s.id} className="flex items-center gap-4 px-5 py-3.5">
                      <span className="w-5 text-center text-xs font-semibold text-fg-faint tabular-nums">{i + 1}</span>
                      <InitialsAvatar name={s.name} src={s.photoUrl} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="truncate text-sm font-semibold text-fg">{s.name}</p>
                          <p className="shrink-0 text-sm font-semibold text-fg tabular-nums">
                            {fmtNum(s.studentCount)}
                            <span className="ml-1 text-xs font-normal text-fg-subtle">students</span>
                          </p>
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <ShareBar value={s.studentCount} max={maxStudents} />
                          <span className="hidden shrink-0 text-[11px] text-fg-subtle sm:block">
                            {fmtNum(s.teacherCount)} teachers · {fmtNum(s.classCount)} classes
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel
              className="xl:col-span-2"
              icon={Receipt}
              title="Recent fee transactions"
              description="Latest payments across schools"
              actions={
                <Link href="/superadmin?tab=transactions" className={btnClass("ghost", "sm")}>
                  View all <ArrowRight size={14} />
                </Link>
              }
              bodyClassName="p-0"
            >
              {feeTransactions.length === 0 ? (
                <EmptyState icon={Receipt} title="No transactions yet" description="Fee payments will show up here." />
              ) : (
                <ul className="divide-y divide-line-subtle">
                  {feeTransactions.slice(0, 8).map((t) => (
                    <li key={t.id} className="flex items-center justify-between gap-3 px-5 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-fg">{t.schoolName}</p>
                        <p className="truncate text-xs text-fg-subtle">
                          {t.studentName ? `${t.studentName} · ` : ""}
                          {new Date(t.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-sm font-semibold text-emerald-700 tabular-nums dark:text-emerald-300">
                        +{formatAmount(t.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
            <Panel className="xl:col-span-2" title="Quick actions" description="Common platform tasks">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                {QUICK_LINKS.map(({ href, label, desc, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group flex items-center gap-3 rounded-xl border border-line p-3.5 transition hover:border-primary/40 hover:bg-elev-2"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-fg">{label}</span>
                      <span className="block truncate text-xs text-fg-subtle">{desc}</span>
                    </span>
                    <ArrowRight size={16} className="shrink-0 text-fg-faint transition group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </Panel>

            <div className="xl:col-span-3">
              {schools.length > 0 ? (
                <BirthdayCard
                  schoolId={birthdaySchoolId || schools[0].id}
                  action={
                    <select
                      aria-label="School"
                      value={birthdaySchoolId || schools[0].id}
                      onChange={(e) => setBirthdaySchoolId(e.target.value)}
                      className="h-8 max-w-[13rem] rounded-lg border border-line-strong bg-surface px-2 text-xs text-fg"
                    >
                      {schools.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  }
                />
              ) : null}
            </div>
          </div>
        </>
      )}
    </SaPage>
  );
}
