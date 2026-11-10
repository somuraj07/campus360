"use client";

type Props = {
  studentName: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteModal({
  studentName,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay px-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 text-fg shadow-pop">
        <h3 className="text-lg font-semibold">Delete Student</h3>
        <p className="mt-2 text-sm text-fg-muted">
          Are you sure you want to delete {studentName}? This action cannot be
          undone.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-xl border border-line bg-elev-1 px-4 py-2 text-sm font-semibold text-fg-muted hover:bg-elev-3"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
