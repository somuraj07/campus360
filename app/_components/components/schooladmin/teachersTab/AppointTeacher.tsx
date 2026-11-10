"use client";

import { GraduationCap, UserPlus } from "lucide-react";
import TimellyLoader from "../../common/TimellyLoader";
import { useAppointTeacherState } from "./shared";
import { AppointTeacherTable } from "./shared";
import { AppointTeacherMobileList } from "./shared";

type AppointTeacherProps = {
  schoolId?: string | null;
  /** After assign/remove class teacher, refresh the main teachers list / stats. */
  onRosterChange?: () => void;
};

/* ================= COMPONENT ================= */
export default function AppointTeacher({ schoolId, onRosterChange }: AppointTeacherProps) {
  const {
    classes,
    loading,
    selectedClassId,
    setSelectedClassId,
    selectedTeacherId,
    setSelectedTeacherId,
    assigning,
    removingId,
    editingClassId,
    appointments,
    classOptions,
    teacherOptions,
    handleAssign,
    handleEdit,
    handleRemove,
    cancelEdit,
  } = useAppointTeacherState({ schoolId, onRosterChange });

  return (
    <div className="w-full max-w-6xl mx-auto bg-elev-1 rounded-xl sm:rounded-2xl border border-line text-fg overflow-hidden">
      {/* HEADER */}
      <div className="p-4 sm:p-5 md:p-6">
        <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
          <GraduationCap className="text-primary w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
          Appoint Class Teacher
        </h2>
        <p className="text-xs sm:text-sm text-fg-muted mt-0.5 sm:mt-1">
          Assign one class teacher per class.
        </p>
      </div>

      {/* FORM */}
      <div className="border-t border-line p-4 sm:p-5 md:p-6 bg-surface">
        {loading && classes.length === 0 ? (
          <TimellyLoader
            compact
            bare
            title="Loading appointments"
            steps={["Classes", "Teachers", "Assignments"]}
          />
        ) : (
          <div className="flex flex-col gap-3 sm:gap-4">
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="flex-1 bg-well border border-line rounded-xl px-4 py-3"
            >
              <option value="" className="bg-surface text-fg">-- Select Class --</option>
              {classOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-surface text-fg" >
                  {opt.label}
                </option>
              ))}
            </select>

            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="flex-1 border border-line rounded-xl px-4 py-3  bg-well"
            >
              <option value="" className="bg-surface text-fg">-- Select Teacher --</option>
              {teacherOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-surface text-fg">
                  {opt.label}
                </option>
              ))}
            </select>

            <button
              onClick={handleAssign}
              disabled={!selectedClassId || !selectedTeacherId || assigning}
              className="w-full sm:w-auto px-6 py-3 rounded-lg sm:rounded-xl font-semibold flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-primary-hover disabled:opacity-40 text-sm sm:text-base"
            >
              <UserPlus size={18} />
              {assigning
                ? editingClassId
                  ? "Updating..."
                  : "Assigning..."
                : editingClassId
                ? "Update"
                : "Assign"}
            </button>
          </div>
        )}

        {editingClassId && (
          <button
            onClick={cancelEdit}
            className="mt-3 text-xs underline text-fg-muted"
          >
            Cancel edit
          </button>
        )}
      </div>

      <AppointTeacherTable
        appointments={appointments}
        removingId={removingId}
        onEdit={handleEdit}
        onRemove={handleRemove}
      />

      <AppointTeacherMobileList
        appointments={appointments}
        removingId={removingId}
        onEdit={handleEdit}
        onRemove={handleRemove}
      />
    </div>
  );
}
