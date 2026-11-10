"use client";

import { Download } from "lucide-react";
import { SaPage, SaPageHeader, btnClass } from "../common/ui";
import AppointTeacher from "./teachersTab/AppointTeacher";
import TeachersList from "./teachersTab/TeachersList";
import EditTeacher from "./teachersTab/EditTeacher";
import { useTeachersTabState, TeacherAttendanceStatCards, DailyAttendanceCard } from "./shared/teachersTab";

const SchoolAdminTeacherTab = () => {
  const {
    schoolId,
    searchTerm,
    setSearchTerm,
    teachers,
    teachersLoading,
    teachersRevalidating,
    editingTeacher,
    setEditingTeacher,
    attendanceDate,
    setAttendanceDate,
    attendanceMap,
    attendanceLoading,
    saveAttendanceLoading,
    pdfLoading,
    refreshTeachers,
    filteredTeachers,
    safePage,
    totalPages,
    pagedTeachers,
    setPage,
    handleDelete,
    handleEditTeacher,
    handleSaveTeacher,
    setTeacherAttendance,
    markAllPresent,
    saveAttendance,
    presentCount,
    onLeaveCount,
    lateCount,
    absentCount,
    overallPct,
    downloadReportAsPdf,
  } = useTeachersTabState();

  return (
    <SaPage>
      <SaPageHeader
        eyebrow="Staff"
        title="Teachers"
        description={
          teachersRevalidating
            ? "Overview of teaching staff — updating…"
            : "Overview of teaching staff, attendance, and assignments"
        }
        actions={
          <button
            type="button"
            onClick={() => void downloadReportAsPdf()}
            disabled={pdfLoading || teachers.length === 0}
            className={btnClass("secondary")}
          >
            <Download size={16} /> {pdfLoading ? "Generating…" : "Download PDF"}
          </button>
        }
      />

      <TeacherAttendanceStatCards
        presentCount={presentCount}
        teachersCount={teachers.length}
        onLeaveCount={onLeaveCount}
        lateCount={lateCount}
        absentCount={absentCount}
      />

      <DailyAttendanceCard
        attendanceDate={attendanceDate}
        onAttendanceDateChange={setAttendanceDate}
        overallPct={overallPct}
        presentCount={presentCount}
        teachersCount={teachers.length}
        onMarkAllPresent={markAllPresent}
        teachersLoading={teachersLoading}
        teachers={teachers}
        attendanceMap={attendanceMap}
        attendanceLoading={attendanceLoading}
        onTeacherAttendanceChange={setTeacherAttendance}
        saveAttendanceLoading={saveAttendanceLoading}
        onSaveAttendance={() => void saveAttendance()}
      />

      {/* Main Table & Mobile Card Section */}
      <div className="grid gap-6">
      <div className="w-full min-w-0 overflow-hidden">
        <TeachersList
          teachersLoading={teachersLoading && teachers.length === 0}
          filteredTeachers={filteredTeachers}
          pagedTeachers={pagedTeachers}
          attendanceDate={attendanceDate}
          overallPct={overallPct}
          presentCount={presentCount}
          teachersCount={teachers.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          page={safePage}
          totalPages={totalPages}
          setPage={setPage}
          onDelete={handleDelete}
          onEditTeacher={handleEditTeacher}
        />
      </div>

      {editingTeacher && (
        <EditTeacher
          teacher={editingTeacher}
          onClose={() => setEditingTeacher(null)}
          onSave={(t) => {
            handleSaveTeacher(t);
            setEditingTeacher(null);
            refreshTeachers();
          }}
        />
      )}


      {/* ================= Teachers List ================= */}

      <div className="w-full min-w-0">
        <AppointTeacher
          schoolId={schoolId}
          onRosterChange={() => {
            refreshTeachers();
          }}
        />
      </div>
      </div>
    </SaPage>
  );
};
export default SchoolAdminTeacherTab;
