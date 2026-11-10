import { Pencil, Trash2 } from "lucide-react";
import { DEFAULT_AVATAR, type AppointmentRow } from "./appointTeacherTypes";

export function AppointTeacherMobileList({
  appointments,
  removingId,
  onEdit,
  onRemove,
}: {
  appointments: AppointmentRow[];
  removingId: string | null;
  onEdit: (item: AppointmentRow) => void;
  onRemove: (classId: string) => void;
}) {
  return (
    <div className="md:hidden border-t border-line p-4 space-y-3">
      {appointments.length === 0 ? (
        <div className="rounded-xl border border-line bg-elev-1 p-6 text-center text-fg-subtle text-sm">
          No class teachers appointed yet. Select a class and teacher above to assign.
        </div>
      ) : (
        appointments.map((item) => (
          <div
            key={item.classId}
            className="rounded-xl border border-line bg-elev-1 p-4 space-y-3"
          >
            <div className="flex items-start gap-3">
              <img
                src={item.avatar} alt={item.teacherName}
                className="h-9 w-9 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-fg">
                  {item.className}
                </div>
                <div className="mt-1 text-xs text-fg-muted">
                  {item.teacherEmail}
                </div>
              </div>
            </div>

            <div className="mt-3 text-sm text-fg">
              {item.teacherName}
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button onClick={() => onEdit(item)}>
                <Pencil
                  size={16}
                  className="text-primary hover:text-primary"
                />
              </button>

              <button
                disabled={removingId === item.classId}
                onClick={() => onRemove(item.classId)}
              >
                <Trash2 size={16} className="text-red-700 dark:text-red-400" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
