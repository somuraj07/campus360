import { AlertTriangle } from "lucide-react";
import type { SchoolRow } from "../../Schools";
import { btnClass } from "../ui";

export function DeleteSchoolModal({
  modalSchool,
  confirmName,
  setConfirmName,
  deleteBusy,
  deleteError,
  onCancel,
  onConfirm,
}: {
  modalSchool: SchoolRow;
  confirmName: string;
  setConfirmName: (v: string) => void;
  deleteBusy: boolean;
  deleteError: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const matches = confirmName.trim() === modalSchool.name.trim();
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-overlay p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-school-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-line bg-surface shadow-pop">
        <div className="p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400">
            <AlertTriangle size={20} />
          </span>
          <h2 id="delete-school-title" className="mt-4 text-lg font-semibold text-fg">
            Delete school
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            This removes <span className="font-semibold text-fg">{modalSchool.name}</span> and related records:
            students, classes, fees, payments, news, homework, exams, admissions, and staff accounts that exist only
            for this school. This cannot be undone.
          </p>

          <label htmlFor="confirm-school-name" className="mt-5 block text-[13px] font-medium text-fg">
            Type the school name to confirm
          </label>
          <input
            id="confirm-school-name"
            type="text"
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            autoComplete="off"
            className="mt-1.5 h-11 w-full rounded-lg border border-line-strong bg-surface px-3.5 text-sm text-fg placeholder:text-fg-faint focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/15"
            placeholder={modalSchool.name}
            disabled={deleteBusy}
          />
          {deleteError && (
            <p className="mt-2 text-sm text-red-700 dark:text-red-400" role="alert">
              {deleteError}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-line bg-elev-2 px-6 py-4 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} disabled={deleteBusy} className={btnClass("secondary")}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={deleteBusy || !matches} className={btnClass("danger")}>
            {deleteBusy ? "Deleting…" : "Delete permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}
