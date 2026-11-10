"use client";

import { SaPage, SaPageHeader, Panel, Field, SelectInput, Alert } from "../common/ui";
import { CalendarDays } from "lucide-react";
import TimellyLoader from "../common/TimellyLoader";
import TimetableGrid from "../timetable/TimetableGrid";
import { useTimetableState, TimetableEntriesGrid, classLabel, DAYS } from "./shared/timetable";

export default function SchoolAdminTimetableTab() {
  const {
    classes,
    teachers,
    selectedClassId,
    setSelectedClassId,
    selectedDay,
    setSelectedDay,
    loading,
    loadingTimetable,
    saving,
    error,
    success,
    selectedClass,
    selectedDayLabel,
    previewTimetable,
    selectedDayEntries,
    entryCountByDay,
    addEntry,
    updateEntry,
    removeEntry,
    handleSave,
  } = useTimetableState();

  if (loading) {
    return (
      <TimellyLoader
        title="Loading timetable"
        steps={["Classes", "Teachers", "Schedules"]}
      />
    );
  }

  return (
    <SaPage>
      <SaPageHeader
        eyebrow="Academics"
        title="Timetable"
        description="Select a class, choose a day, then customize that day's periods and breaks in the grid."
      />

      <Panel
        title="Class & Day"
        description={`Choose the day you want to customize for ${classLabel(selectedClass)}.`}
        icon={CalendarDays}
        actions={
          <Field label="Class" className="w-full sm:w-64">
            <SelectInput value={selectedClassId} onChange={(event) => setSelectedClassId(event.target.value)}>
              {classes.map((classRow) => (
                <option key={classRow.id} value={classRow.id}>
                  {classLabel(classRow)}
                </option>
              ))}
            </SelectInput>
          </Field>
        }
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {DAYS.map((day) => {
            const count = entryCountByDay.get(day.value) ?? 0;
            const isActive = selectedDay === day.value;
            return (
              <button
                key={day.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setSelectedDay(day.value)}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  isActive
                    ? "border-primary bg-primary text-on-primary shadow-sm"
                    : "border-line bg-surface text-fg hover:bg-elev-2"
                }`}
              >
                <span className="block text-sm font-semibold">{day.label}</span>
                <span className={`text-xs ${isActive ? "text-on-primary/80" : "text-fg-subtle"}`}>
                  {count} period{count === 1 ? "" : "s"}
                </span>
              </button>
            );
          })}
        </div>
      </Panel>

      {error ? <Alert tone="error">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}
      {loadingTimetable ? <Alert tone="info">Loading selected class timetable...</Alert> : null}

      <TimetableEntriesGrid
        selectedDayLabel={selectedDayLabel}
        selectedDayEntries={selectedDayEntries}
        selectedClass={selectedClass}
        teachers={teachers}
        saving={saving}
        selectedClassId={selectedClassId}
        onAddEntry={() => addEntry()}
        onUpdateEntry={updateEntry}
        onRemoveEntry={removeEntry}
        onSave={() => void handleSave()}
      />

      <TimetableGrid timetable={previewTimetable} emptyMessage="Add valid rows to preview the timetable." />
    </SaPage>
  );
}
