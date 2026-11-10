"use client";

import {
  CheckCircle2,
  Calendar,
  CircleDot,
  Copy,
  Download,
  Save,
} from "lucide-react";
import { SaPage, SaPageHeader } from "../../common/ui";
import TimellyLoader from "../../common/TimellyLoader";
import SearchInput from "../../common/SearchInput";
import SelectInput from "../../common/SelectInput";
import InlinePanelTable from "../../common/InlinePanelTable";
import AttendanceButton from "./AttendanceButton";
import SuccessPopups from "../../common/SuccessPopUps";
import { formatLongDate } from "./shared";
import { useAttendanceState } from "./shared";
import { useAttendanceColumns } from "./shared";
import { AttendanceStatCards } from "./shared";
import { AttendanceMobileList } from "./shared";

export default function TeacherAttendanceTab() {
  const {
    selectedClass,
    setSelectedClass,
    selectedDate,
    setSelectedDate,
    liveMode,
    setLiveMode,
    students,
    setStudents,
    classOptions,
    loadingClasses,
    savingAttendance,
    copyingFromYesterday,
    showSuccess,
    setShowSuccess,
    stats,
    selectedClassLabel,
    handleCopyFromYesterday,
    handleExportReport,
    handleSaveAttendance,
  } = useAttendanceState();

  const { columns } = useAttendanceColumns({ setStudents });

  return (
    <SaPage>
      <SaPageHeader eyebrow="Teaching" title="Attendance Management" description="Mark and manage student attendance" />

      {loadingClasses && classOptions.length === 0 && (
        <TimellyLoader title="Loading classes" steps={["Classes", "Students", "Attendance"]} />
      )}

      <AttendanceStatCards stats={stats} />

      <section className="space-y-5 rounded-2xl border border-line bg-elev-1 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.1fr] gap-3 sm:gap-4 items-end">
          <SelectInput
            label="Select Class"
            value={selectedClass}
            onChange={setSelectedClass}
            options={
              loadingClasses
                ? [{ label: "Loading classes...", value: "", disabled: true }]
                : classOptions.length
                ? classOptions
                : [{ label: "No classes available", value: "", disabled: true }]
            }
            disabled={loadingClasses || classOptions.length === 0}
          />
          <SearchInput
            label="Select Date"
            value={selectedDate}
            onChange={setSelectedDate}
            placeholder="YYYY-MM-DD"
            type="date"
            icon={Calendar}
            iconPosition="right"
            iconClickable
            iconAriaLabel="Open calendar"
            inputClassName="appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
            variant="glass"
          />
          <div className="flex sm:col-span-2 lg:col-span-1">
            <AttendanceButton
              variant={liveMode ? "success" : "neutral"}
              className="w-full px-4 sm:px-6 py-2.5 text-sm"
              leftIcon={
                <CircleDot
                  size={16}
                  className={liveMode ? "text-on-primary" : "text-fg-muted"}
                />
              }
              onClick={() => setLiveMode((prev) => !prev)}
            >
              {liveMode ? "Live Mode Active" : "Start Live Attendance"}
            </AttendanceButton>
          </div>
        </div>

        <div className="h-px bg-elev-2" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <AttendanceButton
            variant="primary"
            leftIcon={<CheckCircle2 size={16} />}
            className="w-full"
            onClick={() =>
              setStudents((prev) => prev.map((s) => ({ ...s, status: "present" })))
            }
            disabled={students.length === 0}
          >
            Mark All Present
          </AttendanceButton>
          <AttendanceButton
            variant="ghost"
            leftIcon={<Copy size={16} />}
            className="w-full"
            onClick={() => void handleCopyFromYesterday()}
            disabled={!selectedClass || students.length === 0 || copyingFromYesterday}
          >
            {copyingFromYesterday ? "Copying…" : "Copy from Yesterday"}
          </AttendanceButton>
          <AttendanceButton
            variant="ghost"
            leftIcon={<Download size={16} />}
            className="w-full"
            onClick={handleExportReport}
            disabled={students.length === 0}
          >
            Export Report
          </AttendanceButton>
        </div>
      </section>

      <section className="rounded-xl sm:rounded-2xl border border-line bg-elev-1 overflow-hidden">
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-fg">Mark Attendance</h3>
          <p className="text-sm text-fg-muted mt-1">
            {selectedClassLabel || "No class selected"} -{" "}
            {formatLongDate(selectedDate)}
          </p>
        </div>

        <div className="hidden md:block max-h-[420px] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <InlinePanelTable columns={columns} data={students} rowKey={(row) => row.id} />
        </div>

        <AttendanceMobileList students={students} setStudents={setStudents} />

        <div className="hidden md:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-line px-6 py-4">
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-fg-subtle">Present</p>
              <p className="text-lg font-semibold text-primary">{stats.present}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-fg-subtle">Absent</p>
              <p className="text-lg font-semibold text-red-700 dark:text-red-400">{stats.absent}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-fg-subtle">Late</p>
              <p className="text-lg font-semibold text-amber-700 dark:text-amber-300">{stats.late}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-fg-subtle">Rate</p>
              <p className="text-lg font-semibold text-fg">{stats.rate}%</p>
            </div>
          </div>

          <AttendanceButton
            variant="primary"
            className="px-6"
            leftIcon={<Save size={16} />}
            onClick={() => void handleSaveAttendance()}
          >
            {savingAttendance ? "Saving..." : "Save Attendance"}
          </AttendanceButton>
        </div>

        <div className="md:hidden border-t border-line px-4 py-4 space-y-4">
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl border border-line bg-elev-1 px-3 py-2 text-center">
              <p className="text-[10px] uppercase tracking-wider text-primary">Present</p>
              <p className="text-lg font-semibold text-primary">{stats.present}</p>
            </div>
            <div className="rounded-xl border border-line bg-elev-1 px-3 py-2 text-center">
              <p className="text-[10px] uppercase tracking-wider text-red-700 dark:text-red-300">Absent</p>
              <p className="text-lg font-semibold text-red-700 dark:text-red-400">{stats.absent}</p>
            </div>
            <div className="rounded-xl border border-line bg-elev-1 px-3 py-2 text-center">
              <p className="text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-300">Late</p>
              <p className="text-lg font-semibold text-amber-700 dark:text-amber-300">{stats.late}</p>
            </div>
          </div>

          <AttendanceButton
            variant="primary"
            className="w-full justify-center"
            leftIcon={<Save size={16} />}
            onClick={() => void handleSaveAttendance()}
          >
            {savingAttendance ? "Saving..." : "Save Attendance"}
          </AttendanceButton>
        </div>
      </section>

      <SuccessPopups
        open={showSuccess}
        title="Attendance Created Successfully"
        description="Attendance saved for the selected class."
        onClose={() => setShowSuccess(false)}
      />
    </SaPage>
  );
}
