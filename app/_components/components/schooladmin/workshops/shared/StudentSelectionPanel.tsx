import { ChevronRight, Loader2, Send, Users } from "lucide-react";
import type { HubEvent, HubStudent } from "./createHubTypes";

export function StudentSelectionPanel({
  selectedEvent,
  loadingStudents,
  students,
  selectedStudentIds,
  onToggleStudent,
  onSelectAll,
  onDeselectAll,
  assigning,
  assignProgress,
  canAssign,
  onAssign,
  selectedCount,
}: {
  selectedEvent: HubEvent | null;
  loadingStudents: boolean;
  students: HubStudent[];
  selectedStudentIds: Set<string>;
  onToggleStudent: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  assigning: boolean;
  assignProgress: { current: number; total: number };
  canAssign: unknown;
  onAssign: () => void;
  selectedCount: number;
}) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <span className="text-xs font-bold text-fg-subtle uppercase tracking-wider">
          4. Select Students ({selectedCount} selected)
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onSelectAll}
            className="text-xs font-medium text-primary hover:text-primary"
          >
            Select All
          </button>
          <span className="text-fg-faint">|</span>
          <button
            type="button"
            onClick={onDeselectAll}
            className="text-xs font-medium text-fg-muted hover:text-fg"
          >
            Deselect All
          </button>
        </div>
      </div>

      {!selectedEvent && (
        <div className="rounded-xl sm:rounded-2xl border border-dashed border-line-strong bg-elev-1 min-h-[220px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-fg-subtle text-center px-4">
            <ChevronRight className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-elev-1 flex items-center justify-center" />
            <span className="text-sm">Select a workshop to see enrolled students</span>
          </div>
        </div>
      )}

      {selectedEvent && loadingStudents && (
        <div className="rounded-xl sm:rounded-2xl border border-line bg-elev-1 min-h-[220px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-fg-muted">
            <Loader2 size={28} className="animate-spin" />
            <span className="text-sm">Loading students...</span>
          </div>
        </div>
      )}

      {selectedEvent && !loadingStudents && students.length === 0 && (
        <div className="rounded-xl sm:rounded-2xl border border-line bg-elev-1 min-h-[220px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-fg-subtle text-center px-4">
            <Users size={32} />
            <span className="text-sm">No students enrolled in this workshop yet</span>
          </div>
        </div>
      )}

      {selectedEvent && !loadingStudents && students.length > 0 && (
        <div className="space-y-4">
          <div className="rounded-xl sm:rounded-2xl border border-line bg-elev-1 max-h-[280px] sm:max-h-[320px] overflow-y-auto no-scrollbar">
            <div className="divide-y divide-line-subtle">
              {students.map((s) => {
                const isSelected = selectedStudentIds.has(s.id);
                return (
                  <label
                    key={s.id}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                      isSelected ? "bg-elev-1" : "hover:bg-elev-2"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleStudent(s.id)}
                      className="rounded border-line-strong bg-well text-primary focus:ring-primary/50"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-fg truncate">
                        {s.name || "Unknown"}
                      </div>
                      {s.class && (
                        <div className="text-xs text-fg-subtle truncate">
                          {s.class}
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {assigning && (
              <span className="text-sm text-fg-muted">
                Assigning {assignProgress.current} of {assignProgress.total}...
              </span>
            )}
            <button
              type="button"
              onClick={onAssign}
              disabled={!canAssign}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary shadow-card  hover:bg-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-hover w-full sm:w-auto"
            >
              {assigning ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Assign to {selectedCount} Student{selectedCount !== 1 ? "s" : ""}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
