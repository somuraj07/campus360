"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCcw, Users, GraduationCap, UserCheck, IndianRupee, BadgePercent, Clock3, CalendarDays, type LucideIcon } from "lucide-react";
import { SaPage, SaPageHeader, KpiCard, KpiGrid, Alert, btnClass } from "../common/ui";
import TimellyLoader from "../common/TimellyLoader";
import { fetchChairmanDashboard } from "@/lib/api/chairmanDashboard";

type ChairmanSummary = {
  schoolName: string;
  totalStudents: number;
  activeStudents: number;
  totalClasses: number;
  totalTeachers: number;
  grossFees: number;
  netFees: number;
  totalDiscount: number;
  remainingFees: number;
  todayCollection: number;
  collectionDate?: string;
  totalCollection: number;
  previousYearTotalFee?: number;
  previousYearCollected?: number;
  previousYearDue?: number;
  pendingDiscounts: number;
  approvedDiscounts: number;
  rejectedDiscounts: number;
};

const money = (value: number) => `₹${Math.round(value || 0).toLocaleString("en-IN")}`;
const todayYmd = () => new Date().toISOString().slice(0, 10);
const clampPct = (value: number) => Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
const DASHBOARD_SESSION_KEY = "chairman:dashboard:v3";
const DASHBOARD_SESSION_TTL_MS = 5 * 60_000;

function readCachedSummary(date: string): ChairmanSummary | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const store = JSON.parse(sessionStorage.getItem(DASHBOARD_SESSION_KEY) ?? "{}") as Record<
      string,
      { ts: number; summary: ChairmanSummary }
    >;
    const hit = store[date];
    if (!hit || Date.now() - hit.ts > DASHBOARD_SESSION_TTL_MS) return null;
    return hit.summary;
  } catch {
    return null;
  }
}

function writeCachedSummary(date: string, summary: ChairmanSummary): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    const store = JSON.parse(sessionStorage.getItem(DASHBOARD_SESSION_KEY) ?? "{}") as Record<
      string,
      { ts: number; summary: ChairmanSummary }
    >;
    store[date] = { ts: Date.now(), summary };
    sessionStorage.setItem(DASHBOARD_SESSION_KEY, JSON.stringify(store));
  } catch {
    /* ignore quota */
  }
}

export function warmChairmanDashboard(date = todayYmd()): void {
  if (readCachedSummary(date)) return;
  void fetchChairmanDashboard(date)
    .then(({ ok, data }) => {
      if (!ok) return null;
      return data.summary as ChairmanSummary | null;
    })
    .then((summary) => {
      if (summary) writeCachedSummary(date, summary);
    })
    .catch(() => {});
}

const CARD_TONE = { lime: "navy", cyan: "sky", amber: "gold", violet: "navy", rose: "red" } as const;

function Card({
  title,
  value,
  subtitle,
  tone = "lime",
  icon,
}: {
  title: string;
  value: string;
  subtitle?: string;
  tone?: keyof typeof CARD_TONE;
  icon: LucideIcon;
}) {
  return <KpiCard label={title} value={value} hint={subtitle} icon={icon} tone={CARD_TONE[tone]} />;
}

export default function ChairmanDashboard() {
  const [collectionDate, setCollectionDate] = useState(todayYmd());
  const [summary, setSummary] = useState<ChairmanSummary | null>(() => readCachedSummary(todayYmd()));
  const [loading, setLoading] = useState(() => readCachedSummary(todayYmd()) == null);
  const [error, setError] = useState("");

  const load = useCallback(async (opts?: { force?: boolean }) => {
    const cached = readCachedSummary(collectionDate);
    if (!opts?.force && cached) {
      setSummary(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    setError("");
    try {
      const { ok, data } = await fetchChairmanDashboard(collectionDate);
      if (!ok) throw new Error(data.message || "Failed to load dashboard");
      const nextSummary = (data.summary as ChairmanSummary | undefined) ?? null;
      setSummary(nextSummary);
      if (nextSummary) writeCachedSummary(collectionDate, nextSummary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [collectionDate]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <TimellyLoader
        title="Loading chairman dashboard"
        steps={["Collections", "Fee summary", "School metrics"]}
        compact
      />
    );
  }

  if (error || !summary) {
    return (
      <div className="space-y-4">
        <Alert tone="error">{error || "Dashboard unavailable"}</Alert>
        <button type="button" onClick={() => void load()} className={btnClass("primary")}>
          Retry
        </button>
      </div>
    );
  }

  const netPercent = clampPct(summary.grossFees > 0 ? (summary.netFees / summary.grossFees) * 100 : 0);
  const discountPercent = clampPct(summary.grossFees > 0 ? (summary.totalDiscount / summary.grossFees) * 100 : 0);
  const collectedPercent = clampPct(summary.netFees > 0 ? (summary.totalCollection / summary.netFees) * 100 : 0);
  const remainingPercent = clampPct(summary.netFees > 0 ? (summary.remainingFees / summary.netFees) * 100 : 0);
  const discountTotal = summary.pendingDiscounts + summary.approvedDiscounts + summary.rejectedDiscounts;
  const approvedPct = clampPct(discountTotal > 0 ? (summary.approvedDiscounts / discountTotal) * 100 : 0);
  const rejectedPct = clampPct(discountTotal > 0 ? (summary.rejectedDiscounts / discountTotal) * 100 : 0);
  const pendingPct = clampPct(discountTotal > 0 ? (summary.pendingDiscounts / discountTotal) * 100 : 0);
  const collectionRing = `conic-gradient(rgb(74 222 128) 0 ${collectedPercent}%, rgb(251 191 36) ${collectedPercent}% ${Math.min(100, collectedPercent + remainingPercent)}%, var(--elev-2) ${Math.min(100, collectedPercent + remainingPercent)}% 100%)`;

  return (
    <SaPage>
      <SaPageHeader
        eyebrow="Chairman"
        title="Dashboard"
        description={summary.schoolName}
        actions={
          <>
            <label className="relative block">
              <span className="sr-only">Collection date</span>
              <CalendarDays size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-faint" />
              <input
                type="date"
                value={collectionDate}
                onChange={(event) => setCollectionDate(event.target.value || todayYmd())}
                className="h-10 rounded-lg border border-line-strong bg-surface pl-9 pr-3 text-sm text-fg focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                aria-label="Select collection date"
              />
            </label>
            <button type="button" onClick={() => void load({ force: true })} className={btnClass("secondary")} title="Refresh">
              <RefreshCcw size={16} />
              Refresh
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Card title="Day Collection" value={money(summary.todayCollection)} subtitle={collectionDate} tone="lime" icon={IndianRupee} />
        <Card title="Total Collection" value={money(summary.totalCollection)} subtitle="All successful fee collections" tone="cyan" icon={IndianRupee} />
        <Card title="Current Year Total" value={money(summary.grossFees)} subtitle="Excludes previous-year pending" tone="violet" icon={IndianRupee} />
        <Card title="Total Discount" value={money(summary.totalDiscount)} subtitle="Current-year base minus final" tone="amber" icon={BadgePercent} />
        <Card title="Previous Year Due" value={money(summary.previousYearDue ?? 0)} subtitle="Shown separately from total fees" tone="rose" icon={IndianRupee} />
      </div>

      <KpiGrid>
        <Card title="Active Students" value={String(summary.activeStudents)} subtitle="Active students only" tone="cyan" icon={Users} />
        <Card title="Classes" value={String(summary.totalClasses)} subtitle="Total classes in school" tone="violet" icon={GraduationCap} />
        <Card title="Teachers" value={String(summary.totalTeachers)} subtitle="Teacher accounts" tone="lime" icon={UserCheck} />
        <Card title="Pending Discounts" value={String(summary.pendingDiscounts)} subtitle={`${summary.approvedDiscounts} approved, ${summary.rejectedDiscounts} rejected`} tone="rose" icon={Clock3} />
      </KpiGrid>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl border border-line bg-elev-1 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-fg">Money Flow Map</h2>
              <p className="text-xs text-fg-subtle">Current-year fees flowing into discounts, collections and pending dues</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {Math.round(netPercent)}% collectable
            </span>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-line bg-well p-4">
              <div className="mb-3 flex items-center justify-between text-xs text-fg-subtle">
                <span>Current-year fee pool</span>
                <span>{money(summary.grossFees)}</span>
              </div>
              <div className="flex h-7 overflow-hidden rounded-full bg-elev-2">
                <div
                  className="bg-primary/80"
                  style={{ width: `${netPercent}%` }}
                  title={`Net collectable ${money(summary.netFees)}`}
                />
                <div
                  className="bg-amber-400/80"
                  style={{ width: `${discountPercent}%` }}
                  title={`Discount ${money(summary.totalDiscount)}`}
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-primary/10 px-3 py-2 text-primary">
                  Net collectable <span className="font-semibold">{money(summary.netFees)}</span>
                </div>
                <div className="rounded-xl bg-amber-400/10 px-3 py-2 text-amber-800 dark:text-amber-200">
                  Discounts <span className="font-semibold">{money(summary.totalDiscount)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: "Collected", value: summary.totalCollection, pct: collectedPercent, color: "text-primary", bg: "bg-primary/10" },
                { label: "Current Due", value: summary.remainingFees, pct: remainingPercent, color: "text-amber-800 dark:text-amber-200", bg: "bg-amber-400/10" },
                { label: "Today", value: summary.todayCollection, pct: summary.totalCollection > 0 ? clampPct((summary.todayCollection / summary.totalCollection) * 100) : 0, color: "text-sky-800 dark:text-sky-200", bg: "bg-sky-400/10" },
              ].map((item) => (
                <div key={item.label} className={`rounded-2xl ${item.bg} p-3`}>
                  <p className="text-xs text-fg-subtle">{item.label}</p>
                  <p className={`mt-1 text-lg font-semibold ${item.color}`}>{money(item.value)}</p>
                  <p className="mt-1 text-[11px] text-fg-subtle">{Math.round(item.pct)}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-elev-1 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-semibold text-fg">Collection Health</h2>
              <p className="text-xs text-fg-subtle">How much of net fees has already come in</p>
            </div>
            <span className="rounded-full bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-800 dark:text-sky-200">
              {Math.round(collectedPercent)}% collected
            </span>
          </div>

          <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row">
            <div className="relative h-44 w-44 shrink-0 rounded-full p-3" style={{ background: collectionRing }}>
              <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-elev-2 text-center">
                <p className="text-3xl font-semibold text-fg">{Math.round(collectedPercent)}%</p>
                <p className="text-xs text-fg-subtle">collected</p>
              </div>
            </div>
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-well px-4 py-3">
                <span className="flex items-center gap-2 text-sm text-fg-muted"><i className="h-2.5 w-2.5 rounded-full bg-primary" />Collected</span>
                <span className="font-semibold text-primary">{money(summary.totalCollection)}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-well px-4 py-3">
                <span className="flex items-center gap-2 text-sm text-fg-muted"><i className="h-2.5 w-2.5 rounded-full bg-amber-400" />Remaining</span>
                <span className="font-semibold text-amber-800 dark:text-amber-200">{money(summary.remainingFees)}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-well px-4 py-3">
                <span className="flex items-center gap-2 text-sm text-fg-muted"><i className="h-2.5 w-2.5 rounded-full bg-elev-3" />Net target</span>
                <span className="font-semibold text-fg">{money(summary.netFees)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="relative overflow-hidden rounded-2xl border border-line bg-elev-1 p-5">
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-fg">Fees Overview</h2>
              <p className="text-xs text-fg-subtle">Current-year gross to net breakdown</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {summary.grossFees > 0 ? `${Math.round((summary.netFees / summary.grossFees) * 1000) / 10}% net` : "0% net"}
            </span>
          </div>
          <div className="relative mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-well px-4 py-3">
              <p className="flex items-center gap-3 text-sm text-fg-muted"><span className="h-2.5 w-2.5 rounded-full bg-primary" />Current Year Total</p>
              <p className="font-semibold text-primary">{money(summary.grossFees)}</p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-well px-4 py-3">
              <p className="flex items-center gap-3 text-sm text-fg-muted"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" />Discount Given</p>
              <p className="font-semibold text-amber-800 dark:text-amber-200">-{money(summary.totalDiscount)}</p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-well px-4 py-3">
              <p className="flex items-center gap-3 text-sm text-fg-muted"><span className="h-2.5 w-2.5 rounded-full bg-sky-400" />Collectable Net</p>
              <p className="font-semibold text-sky-800 dark:text-sky-200">{money(summary.netFees)}</p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-well px-4 py-3">
              <p className="flex items-center gap-3 text-sm text-fg-muted"><span className="h-2.5 w-2.5 rounded-full bg-orange-400" />Previous Year Due</p>
              <p className="font-semibold text-orange-800 dark:text-orange-200">{money(summary.previousYearDue ?? 0)}</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-line bg-elev-1 p-5">
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-semibold text-fg">Pending Discount Approvals</h2>
              <p className="mt-1 text-sm text-fg-subtle">Chairman review queue</p>
            </div>
            <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-200">
              {summary.pendingDiscounts} pending
            </span>
          </div>
          <div className="relative mt-5 rounded-2xl bg-well p-4">
            <p className="text-4xl font-semibold text-amber-800 dark:text-amber-200">{summary.pendingDiscounts}</p>
            <p className="mt-2 text-sm text-fg-subtle">
              {summary.approvedDiscounts} approved, {summary.rejectedDiscounts} rejected
            </p>
            <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-elev-2">
              <div className="bg-primary/80" style={{ width: `${approvedPct}%` }} title="Approved discounts" />
              <div className="bg-red-400/80" style={{ width: `${rejectedPct}%` }} title="Rejected discounts" />
              <div className="bg-amber-400/80" style={{ width: `${pendingPct}%` }} title="Pending discounts" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] text-fg-subtle">
              <span className="rounded-lg bg-primary/10 py-1 text-primary">{summary.approvedDiscounts} ok</span>
              <span className="rounded-lg bg-red-400/10 py-1 text-red-800 dark:text-red-200">{summary.rejectedDiscounts} no</span>
              <span className="rounded-lg bg-amber-400/10 py-1 text-amber-800 dark:text-amber-200">{summary.pendingDiscounts} wait</span>
            </div>
          </div>
        </div>
      </div>
    </SaPage>
  );
}
