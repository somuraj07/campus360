"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SaPage, SaPageHeader, Field, SelectInput, Alert } from "../../common/ui";
import { CalendarDays } from "lucide-react";
import TimellyLoader from "../../common/TimellyLoader";
import TimetableGrid, { TimetablePayload } from "../../timetable/TimetableGrid";
import {
  loadTeacherAttendanceClasses,
  peekTeacherAttendanceClasses,
} from "@/lib/teacher/loadTeacherFastTabs";
import { fetchTimetableForClass } from "@/lib/api/timetable";

type ClassOption = {
  id: string;
  name?: string | null;
  section?: string | null;
};

const classLabel = (classRow?: ClassOption | null) =>
  classRow
    ? `${classRow.name ?? "Class"}${classRow.section ? ` - ${classRow.section}` : ""}`
    : "Select class";

export default function TeacherTimetableTab() {
  const initialClasses = peekTeacherAttendanceClasses();
  const [classes, setClasses] = useState<ClassOption[]>(() => initialClasses ?? []);
  const [selectedClassId, setSelectedClassId] = useState(() => initialClasses?.[0]?.id ?? "");
  const [timetable, setTimetable] = useState<TimetablePayload>(null);
  const [loading, setLoading] = useState(() => !initialClasses?.length);
  const [loadingTimetable, setLoadingTimetable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedClass = useMemo(
    () => classes.find((classRow) => classRow.id === selectedClassId) ?? null,
    [classes, selectedClassId]
  );

  const loadClasses = useCallback(async (revalidate = false) => {
    if (!revalidate) {
      const cached = peekTeacherAttendanceClasses();
      if (cached?.length) {
        setClasses(cached);
        setLoading(false);
        setSelectedClassId((prev) => prev || cached[0]?.id || "");
        void loadClasses(true);
        return;
      }
    }

    setLoading((prev) => (classes.length === 0 ? true : prev));
    setError(null);
    try {
      const loadedClasses = await loadTeacherAttendanceClasses({ revalidate: true });
      setClasses(loadedClasses);
      setSelectedClassId((prev) => prev || loadedClasses[0]?.id || "");
    } catch (err) {
      if (classes.length === 0) {
        setError(err instanceof Error ? err.message : "Failed to load classes");
      }
    } finally {
      setLoading(false);
    }
  }, [classes.length]);

  const loadTimetable = useCallback(async (classId: string) => {
    if (!classId) return;
    setLoadingTimetable(true);
    setError(null);
    try {
      const { ok, data } = await fetchTimetableForClass(classId);
      if (!ok) throw new Error(data.message || "Failed to load timetable");
      setTimetable(data.timetable ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load timetable");
      setTimetable(null);
    } finally {
      setLoadingTimetable(false);
    }
  }, []);

  useEffect(() => {
    void loadClasses(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedClassId) void loadTimetable(selectedClassId);
  }, [loadTimetable, selectedClassId]);

  if (loading && classes.length === 0) {
    return (
      <TimellyLoader title="Loading timetable" steps={["Classes", "Periods", "Schedule"]} />
    );
  }

  return (
    <SaPage>
      <SaPageHeader eyebrow="Teaching" title="Timetable" description="View class-wise periods, breaks, teachers, and rooms." />

      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-elev-1 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarDays size={16} />
          </span>
          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold text-fg">Class timetable</h2>
            <p className="mt-0.5 text-xs text-fg-subtle">
              {selectedClass ? `Showing timetable for ${classLabel(selectedClass)}.` : "Choose a class to view its timetable."}
            </p>
          </div>
        </div>
        <Field label="Class" className="w-full sm:w-64">
          <SelectInput value={selectedClassId} onChange={(event) => setSelectedClassId(event.target.value)}>
            {classes.map((classRow) => (
              <option key={classRow.id} value={classRow.id}>
                {classLabel(classRow)}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      {error ? <Alert tone="error">{error}</Alert> : null}
      {loadingTimetable ? (
        <TimellyLoader compact title="Loading schedule" steps={["Periods", "Teachers", "Rooms"]} />
      ) : (
        <TimetableGrid
          timetable={timetable}
          emptyMessage="No timetable has been published for this class yet."
        />
      )}
    </SaPage>
  );
}
