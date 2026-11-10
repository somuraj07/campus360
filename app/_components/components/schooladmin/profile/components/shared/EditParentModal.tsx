import { createPortal } from "react-dom";
import { X } from "lucide-react";

export function EditParentModal({
  pFatherName,
  onPFatherNameChange,
  pFatherPhone,
  onPFatherPhoneChange,
  pMotherName,
  onPMotherNameChange,
  pMotherPhone,
  onPMotherPhoneChange,
  saving,
  onClose,
  onSave,
}: {
  pFatherName: string;
  onPFatherNameChange: (v: string) => void;
  pFatherPhone: string;
  onPFatherPhoneChange: (v: string) => void;
  pMotherName: string;
  onPMotherNameChange: (v: string) => void;
  pMotherPhone: string;
  onPMotherPhoneChange: (v: string) => void;
  saving: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-overlay p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-parent-sidebar-title"
    >
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-line bg-surface p-5 shadow-pop">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h4 id="edit-parent-sidebar-title" className="text-lg font-semibold text-fg">
            Edit parent details
          </h4>
          <button
            type="button"
            onClick={() => !saving && onClose()}
            className="rounded-lg p-1 text-fg-muted hover:bg-elev-3 hover:text-fg"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-3 rounded-lg border border-line bg-elev-1 px-3 py-2 text-xs text-fg-muted">
          Update only parent names and mobile numbers here.
        </p>
        <div className="space-y-3 text-sm">
          <div>
            <label className="mb-1 block text-xs font-medium text-fg-subtle">Father / guardian name</label>
            <input
              value={pFatherName}
              onChange={(e) => onPFatherNameChange(e.target.value)}
              className="w-full rounded-xl border border-line bg-well px-3 py-2 text-fg"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-fg-subtle">Guardian phone</label>
            <input
              value={pFatherPhone}
              onChange={(e) => onPFatherPhoneChange(e.target.value)}
              className="w-full rounded-xl border border-line bg-well px-3 py-2 text-fg"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-fg-subtle">Mother name</label>
            <input
              value={pMotherName}
              onChange={(e) => onPMotherNameChange(e.target.value)}
              className="w-full rounded-xl border border-line bg-well px-3 py-2 text-fg"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-fg-subtle">Mother phone</label>
            <input
              value={pMotherPhone}
              onChange={(e) => onPMotherPhoneChange(e.target.value)}
              className="w-full rounded-xl border border-line bg-well px-3 py-2 text-fg"
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => !saving && onClose()}
            disabled={saving}
            className="rounded-xl border border-line px-4 py-2 text-sm text-fg hover:bg-elev-2 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="rounded-xl bg-primary/90 px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
