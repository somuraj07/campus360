"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, GraduationCap, Search, ShieldCheck, Users } from "lucide-react";
import type { LoginAuditCategory, LoginAuditPage } from "@/lib/school/loginAudit";
import LoginAuditEarlier from "./LoginAuditEarlier";
import { SaPage, SaPageHeader, Segmented, Panel, Alert, EmptyState, LoadingBlock, btnClass } from "../common/ui";

const CATEGORY_LABEL: Record<LoginAuditCategory, string> = {
  TEACHER: "Teacher",
  PARENT_STUDENT: "Parent / Student",
  STAFF: "Admin / Chairman",
};

const CATEGORY_BADGE: Record<LoginAuditCategory, string> = {
  TEACHER: "bg-sky-400/15 text-sky-700 dark:text-sky-300",
  PARENT_STUDENT: "bg-primary/15 text-primary",
  STAFF: "bg-amber-400/15 text-amber-700 dark:text-amber-300",
};

const PAGE_SIZE = 50;

/** India-time calendar date (YYYY-MM-DD) of a moment, default now. */
function todayIst(at = Date.now()): string {
  return new Date(at + 330 * 60 * 1000).toISOString().slice(0, 10);
}

function daysBefore(ymd: string, days: number): string {
  const d = new Date(`${ymd}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

const timeFormat = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const dayFormat = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "numeric",
  month: "short",
  year: "numeric",
});

type QuickRange = "7" | "30" | "ALL";

const QUICK_RANGES: Array<{ key: QuickRange; label: string }> = [
  { key: "7", label: "Last 7 days" },
  { key: "30", label: "Last 30 days" },
  { key: "ALL", label: "All time" },
];

const inputClass =
  "h-10 w-full rounded-lg border border-line-strong bg-surface px-3 text-sm text-fg placeholder:text-fg-faint focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10";

type View = "RECENT" | "EARLIER";

const VIEWS: Array<{ key: View; label: string }> = [
  { key: "RECENT", label: "Recent sign-ins" },
  { key: "EARLIER", label: "Earlier parent logins" },
];

/** School admin: recorded sign-ins, plus parent logins from before recording started. */
export default function LoginAuditTab() {
  const [view, setView] = useState<View>("RECENT");
  return (
    <SaPage>
      <SaPageHeader
        eyebrow="Security"
        title="Login Audit"
        description="Who signed in to your school's portals, and when."
        actions={<Segmented value={view} onChange={setView} options={VIEWS.map(({ key, label }) => ({ value: key, label }))} />}
      />
      {view === "RECENT" ? <RecentSignIns /> : <LoginAuditEarlier />}
    </SaPage>
  );
}

/** Who signed in to the school's portals, with filters. */
function RecentSignIns() {
  const [category, setCategory] = useState<"ALL" | LoginAuditCategory>("ALL");
  const [to, setTo] = useState(todayIst);
  const [from, setFrom] = useState(() => daysBefore(todayIst(), 6));
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [classId, setClassId] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<LoginAuditPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wait for typing to pause before searching.
  useEffect(() => {
    const t = setTimeout(() => setQ(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => setPage(1), [category, from, to, q, classId]);

  const showClassFilter = category === "ALL" || category === "PARENT_STUDENT";
  const effectiveClassId = showClassFilter ? classId : "";

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const params = new URLSearchParams({ category, from, to, page: String(page), pageSize: String(PAGE_SIZE) });
        if (q) params.set("q", q);
        if (effectiveClassId) params.set("classId", effectiveClassId);
        const res = await fetch(`/api/school/login-audit?${params}`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error((json as { message?: string })?.message || "Failed to load login audit");
        setData(json as LoginAuditPage);
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setError((e as Error).message || "Failed to load login audit");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [category, from, to, q, effectiveClassId, page]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;
  const firstRow = data && data.total > 0 ? (data.page - 1) * data.pageSize + 1 : 0;
  const lastRow = data ? Math.min(data.total, data.page * data.pageSize) : 0;

  const recordingSince = data?.recordingSince ?? null;
  // "All time" starts at the school's first recorded sign-in; nothing older was ever stored.
  const recordingStartDay = recordingSince ? todayIst(Date.parse(recordingSince)) : todayIst();

  function rangeFrom(key: QuickRange, today: string): string {
    if (key === "7") return daysBefore(today, 6);
    if (key === "30") return daysBefore(today, 29);
    return recordingStartDay < today ? recordingStartDay : today;
  }

  function applyQuickRange(key: QuickRange) {
    const today = todayIst();
    setTo(today);
    setFrom(rangeFrom(key, today));
  }

  const activeRange = QUICK_RANGES.find(({ key }) => {
    const today = todayIst();
    return to === today && from === rangeFrom(key, today);
  })?.key;

  const cards = useMemo(
    () => [
      { key: "TEACHER" as const, label: "Teachers", icon: GraduationCap, tone: "text-sky-700 dark:text-sky-300 bg-sky-400/15" },
      { key: "PARENT_STUDENT" as const, label: "Parents / Students", icon: Users, tone: "text-primary bg-primary/15" },
      { key: "STAFF" as const, label: "Admin / Chairman", icon: ShieldCheck, tone: "text-amber-700 dark:text-amber-300 bg-amber-400/15" },
    ],
    []
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map(({ key, label, icon: Icon, tone }) => {
          const s = data?.summary[key];
          const active = category === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(active ? "ALL" : key)}
              aria-pressed={active}
              className={`rounded-2xl border bg-elev-1 p-5 text-left transition-colors ${
                active ? "border-primary ring-4 ring-primary/10" : "border-line hover:border-line-strong"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-fg-subtle">{label}</p>
                  <p className="mt-0.5 text-2xl font-semibold tracking-tight text-fg tabular-nums">
                    {s ? s.people : "–"}
                    <span className="text-xs font-medium text-fg-subtle ml-1.5">
                      {s ? `${s.people === 1 ? "person" : "people"} · ${s.logins} sign-in${s.logins === 1 ? "" : "s"}` : ""}
                    </span>
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-line bg-elev-1 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <label className="block lg:col-span-2">
            <span className="text-[13px] font-medium text-fg">Search</span>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-subtle pointer-events-none" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, email or admission no."
                className={`${inputClass} pl-9`}
              />
            </div>
          </label>
          <label className="block">
            <span className="text-[13px] font-medium text-fg">Who</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              className={`${inputClass} mt-1`}
            >
              <option value="ALL">Everyone</option>
              <option value="TEACHER">Teachers</option>
              <option value="PARENT_STUDENT">Parents / Students</option>
              <option value="STAFF">Admin / Chairman</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[13px] font-medium text-fg">From</span>
            <input type="date" value={from} max={to} onChange={(e) => e.target.value && setFrom(e.target.value)} className={`${inputClass} mt-1`} />
          </label>
          <label className="block">
            <span className="text-[13px] font-medium text-fg">To</span>
            <input type="date" value={to} min={from} onChange={(e) => e.target.value && setTo(e.target.value)} className={`${inputClass} mt-1`} />
          </label>
          <div className="sm:col-span-2 lg:col-span-3 flex flex-wrap items-end gap-2">
            {QUICK_RANGES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => applyQuickRange(key)}
                disabled={key === "ALL" && !data}
                aria-pressed={activeRange === key}
                className={btnClass(activeRange === key ? "primary" : "secondary", "sm")}
              >
                {label}
              </button>
            ))}
          </div>
          {showClassFilter && (
            <label className="block sm:col-span-2 lg:col-span-2">
              <span className="text-[13px] font-medium text-fg">Class (parents / students)</span>
              <select value={classId} onChange={(e) => setClassId(e.target.value)} className={`${inputClass} mt-1`}>
                <option value="">All classes</option>
                {data?.classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        <p className="text-xs text-fg-subtle mt-3">
          Parents and students use the same login, so their sign-ins are listed together under the student.
          The counts above cover the selected dates.
        </p>
        {data && (
          <p className="text-xs text-fg-subtle mt-1">
            {recordingSince
              ? `Sign-ins are recorded from ${dayFormat.format(new Date(recordingSince))}; parent logins from before then are under Earlier parent logins.`
              : "Sign-in recording has just started, so nothing has been recorded yet; parent logins from before then are under Earlier parent logins."}
          </p>
        )}
      </div>

      <Panel
        title="Sign-ins"
        description={data ? `${data.total} sign-in${data.total === 1 ? "" : "s"} in this range` : undefined}
        bodyClassName="p-0"
      >
        {error ? (
          <div className="p-5">
            <Alert tone="error">{error}</Alert>
          </div>
        ) : !data ? (
          <LoadingBlock label="Loading login audit…" />
        ) : data.entries.length === 0 ? (
          <EmptyState title="No sign-ins match these filters" description="Try a wider date range or a different group." />
        ) : (
          <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
            <table className="hidden md:table w-full text-sm">
              <thead className="border-b border-line bg-well text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
                <tr className="text-left">
                  <th className="px-5 py-3">Signed in</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Who</th>
                  <th className="px-5 py-3">Details</th>
                  <th className="px-5 py-3">Device</th>
                </tr>
              </thead>
              <tbody>
                {data.entries.map((e) => (
                  <tr key={e.id} className="border-b border-line-subtle align-top transition-colors last:border-0 hover:bg-elev-2">
                    <td className="px-5 py-3 text-fg-muted whitespace-nowrap">{timeFormat.format(new Date(e.at))}</td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-fg">{e.name}</p>
                      {e.fatherName && <p className="text-xs text-fg-subtle mt-0.5">Father: {e.fatherName}</p>}
                    </td>
                    <td className="px-5 py-3">
                      {e.category && (
                        <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${CATEGORY_BADGE[e.category]}`}>
                          {e.role === "CHAIRMAN" ? "Chairman" : CATEGORY_LABEL[e.category]}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-fg-muted">
                      {e.admissionNumber ? `${e.className ?? "No class"} • ${e.admissionNumber}` : e.email ?? "–"}
                    </td>
                    <td className="px-5 py-3 text-fg-muted">
                      <p>{e.device}</p>
                      {e.ipAddress && <p className="text-xs text-fg-faint mt-0.5">IP {e.ipAddress}</p>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul className="md:hidden divide-y divide-line-subtle">
              {data.entries.map((e) => (
                <li key={e.id} className="p-4 space-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-fg text-sm min-w-0 break-words">{e.name}</p>
                    {e.category && (
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${CATEGORY_BADGE[e.category]}`}>
                        {e.role === "CHAIRMAN" ? "Chairman" : CATEGORY_LABEL[e.category]}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-fg-muted break-words">
                    {e.admissionNumber ? `${e.className ?? "No class"} • ${e.admissionNumber}` : e.email ?? "–"}
                  </p>
                  <p className="text-xs text-fg-subtle">
                    {timeFormat.format(new Date(e.at))} · {e.device}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data && data.total > 0 && (
          <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-line text-xs text-fg-muted">
            <span>
              {firstRow}–{lastRow} of {data.total}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className={btnClass("secondary", "sm")}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>
                Page {data.page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className={btnClass("secondary", "sm")}
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}
