"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { BookOpen, CalendarDays, Clock, Coffee, GraduationCap, UserRound } from "lucide-react";
import PageHeader from "../../common/PageHeader";
import ParentTimellyLoader from "../ParentTimellyLoader";
import type { TimetableEntry, TimetablePayload } from "../../timetable/TimetableGrid";
import { fetchMyTimetable } from "@/lib/api/timetable";

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DAY_LABELS: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

const timetableCache = new Map<string, TimetablePayload>();

function classLabel(timetable: TimetablePayload) {
  const classRow = timetable?.class;
  if (!classRow) return "Your child's class";
  return `${classRow.name ?? "Class"}${classRow.section ? ` - ${classRow.section}` : ""}`;
}

export default function ParentTimetableTab() {
  const { data: session } = useSession();
  const studentId = session?.user?.studentId ?? "current";
  const cached = timetableCache.get(studentId);
  const [timetable, setTimetable] = useState<TimetablePayload>(cached ?? null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  const loadTimetable = useCallback(async () => {
    if (timetableCache.has(studentId)) {
      setTimetable(timetableCache.get(studentId) ?? null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { ok, data } = await fetchMyTimetable();
      if (!ok) throw new Error(data.message || "Failed to load timetable");
      const nextTimetable = (data.timetable ?? null) as TimetablePayload;
      timetableCache.set(studentId, nextTimetable);
      setTimetable(nextTimetable);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load timetable");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    void loadTimetable();
  }, [loadTimetable]);

  const entriesByDay = useMemo(() => {
    const grouped = new Map<number, TimetableEntry[]>();
    for (const day of DAY_ORDER) grouped.set(day, []);
    for (const entry of timetable?.entries ?? []) {
      grouped.set(entry.dayOfWeek, [...(grouped.get(entry.dayOfWeek) ?? []), entry]);
    }
    for (const [day, entries] of grouped) {
      grouped.set(
        day,
        entries.sort((a, b) => a.slotOrder - b.slotOrder || a.startTime.localeCompare(b.startTime))
      );
    }
    return grouped;
  }, [timetable]);

  const totalPeriods = useMemo(
    () => (timetable?.entries ?? []).filter((entry) => entry.slotType !== "BREAK").length,
    [timetable]
  );
  const totalBreaks = useMemo(
    () => (timetable?.entries ?? []).filter((entry) => entry.slotType === "BREAK").length,
    [timetable]
  );
  const activeDays = useMemo(
    () => DAY_ORDER.filter((day) => (entriesByDay.get(day)?.length ?? 0) > 0),
    [entriesByDay]
  );

  if (loading) {
    return (
      <main className="min-h-screen p-4 sm:p-8 flex items-center justify-center">
        <ParentTimellyLoader preset="shell" className="w-full max-w-2xl" />
      </main>
    );
  }

  if (!timetable || (timetable.entries ?? []).length === 0) {
    return (
      <main className="min-h-screen space-y-5 text-fg">
        <PageHeader eyebrow="Your child" title="Timetable" subtitle="Your child's class timetable will appear here." />
        {error ? (
          <div className="rounded-2xl border border-red-400/25 bg-red-500/10 p-4 text-sm text-red-800 dark:text-red-100">
            {error}
          </div>
        ) : null}
        <div className="rounded-2xl border border-dashed border-line bg-elev-1 p-8 text-center">
          <CalendarDays className="mx-auto mb-3 h-10 w-10 text-primary" />
          <h3 className="text-lg font-semibold">No timetable published yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-fg-muted">
            Once the school publishes the timetable for {classLabel(timetable)}, it will show here automatically.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen space-y-5 pb-6 text-fg sm:space-y-6">
      <PageHeader
        eyebrow="Your child"
        title="Timetable"
        subtitle={`Showing only ${classLabel(timetable)} timetable for your child.`}
      />
      {error ? (
        <div className="rounded-2xl border border-red-400/25 bg-red-500/10 p-4 text-sm text-red-800 dark:text-red-100">
          {error}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-primary/15 bg-linear-to-br from-primary/15 via-white/5 to-cyan-300/10 p-5 shadow-card shadow-black/20 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-well px-3 py-1 text-xs font-semibold text-primary">
              <GraduationCap className="h-3.5 w-3.5" />
              {classLabel(timetable)}
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Weekly Class Timetable
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-fg-muted">
              Periods, breaks, teachers and timings are arranged day-wise for quick parent view.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center sm:min-w-[360px]">
            <div className="rounded-2xl border border-line bg-well p-3">
              <div className="text-xl font-bold text-fg">{activeDays.length}</div>
              <div className="text-[11px] uppercase tracking-wide text-fg-subtle">Days</div>
            </div>
            <div className="rounded-2xl border border-line bg-well p-3">
              <div className="text-xl font-bold text-primary">{totalPeriods}</div>
              <div className="text-[11px] uppercase tracking-wide text-fg-subtle">Periods</div>
            </div>
            <div className="rounded-2xl border border-line bg-well p-3">
              <div className="text-xl font-bold text-amber-800 dark:text-amber-200">{totalBreaks}</div>
              <div className="text-[11px] uppercase tracking-wide text-fg-subtle">Breaks</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {DAY_ORDER.map((day) => {
          const count = entriesByDay.get(day)?.length ?? 0;
          const hasClass = count > 0;
          return (
            <div
              key={day}
              className={`rounded-2xl border p-4 ${
                hasClass
                  ? "border-primary/20 bg-primary/10"
                  : "border-line bg-elev-1"
              }`}
            >
              <div className="text-sm font-semibold">{DAY_LABELS[day]}</div>
              <div className="mt-1 text-xs text-fg-subtle">
                {hasClass ? `${count} item${count === 1 ? "" : "s"}` : "No class"}
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {activeDays.map((day) => {
          const dayEntries = entriesByDay.get(day) ?? [];
          return (
            <div key={day} className="overflow-hidden rounded-2xl border border-line bg-well">
              <div className="flex items-center justify-between border-b border-line bg-elev-1 px-5 py-4">
                <div>
                  <h3 className="text-lg font-semibold">{DAY_LABELS[day]}</h3>
                  <p className="text-xs text-fg-subtle">{dayEntries.length} scheduled item{dayEntries.length === 1 ? "" : "s"}</p>
                </div>
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>

              <div className="space-y-3 p-4">
                {dayEntries.map((entry) => {
                  const isBreak = entry.slotType === "BREAK";
                  return (
                    <article
                      key={`${entry.dayOfWeek}-${entry.slotOrder}-${entry.startTime}`}
                      className={`rounded-2xl border p-4 ${
                        isBreak
                          ? "border-amber-300/20 bg-amber-300/10"
                          : "border-primary/15 bg-elev-1"
                      }`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${
                                isBreak ? "bg-amber-300/15 text-amber-800 dark:text-amber-100" : "bg-primary/15 text-primary"
                              }`}
                            >
                              {isBreak ? <Coffee className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                            </span>
                            <div className="min-w-0">
                              <h4 className="truncate text-base font-semibold">{entry.title}</h4>
                              <p className="text-xs text-fg-subtle">{isBreak ? "Break" : entry.subject || "Period"}</p>
                            </div>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-well px-3 py-1.5 text-xs text-fg-muted">
                          <Clock className="h-3.5 w-3.5" />
                          {entry.startTime} - {entry.endTime}
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2 text-xs text-fg-muted sm:grid-cols-2">
                        <div className="inline-flex items-center gap-2 rounded-xl bg-elev-1 px-3 py-2">
                          <UserRound className="h-3.5 w-3.5 text-fg-subtle" />
                          {entry.teacher?.name || "Teacher not assigned"}
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-xl bg-elev-1 px-3 py-2">
                          <GraduationCap className="h-3.5 w-3.5 text-fg-subtle" />
                          {entry.room || classLabel(timetable)}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
