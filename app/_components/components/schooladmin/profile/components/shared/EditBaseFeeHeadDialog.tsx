import { AlertCircle, Tag } from "lucide-react";

export type EditBaseHeadState = {
  classId: string;
  componentIndex: number;
  name: string;
  amount: string;
};

export function EditBaseFeeHeadDialog({
  editBaseHead,
  onEditBaseHeadChange,
  editBaseError,
  baseStructureMutating,
  onSubmit,
  onCancel,
}: {
  editBaseHead: EditBaseHeadState | null;
  onEditBaseHeadChange: (update: (p: EditBaseHeadState | null) => EditBaseHeadState | null) => void;
  editBaseError: string;
  baseStructureMutating: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}) {
  if (!editBaseHead) return null;
  return (
    <div className="fixed inset-0 z-[125] flex items-center justify-center p-4 bg-overlay ">
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-line bg-surface shadow-pop">
        <div className="p-6">
          <h2 className="mb-2 text-2xl font-bold text-fg">Edit class fee head</h2>
          <p className="mb-6 text-sm text-fg-muted">
            This updates the class fee structure. Every student in this class gets recalculated totals from the
            updated heads (plus extras and discounts).
          </p>
          <form onSubmit={onSubmit} className="space-y-5">
            {editBaseError ? (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p>{editBaseError}</p>
              </div>
            ) : null}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-fg-muted">Fee name</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Tag className="h-5 w-5 text-fg-subtle" />
                </div>
                <input
                  type="text"
                  value={editBaseHead.name}
                  onChange={(e) =>
                    onEditBaseHeadChange((prev) => (prev ? { ...prev, name: e.target.value } : null))
                  }
                  className="w-full rounded-xl border border-line bg-well py-3 pl-10 pr-4 text-fg outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-fg-muted">Amount (₹)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={editBaseHead.amount}
                onChange={(e) =>
                  onEditBaseHeadChange((prev) => (prev ? { ...prev, amount: e.target.value } : null))
                }
                className="w-full rounded-xl border border-line bg-well px-4 py-3 text-fg outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => !baseStructureMutating && onCancel()}
                className="flex-1 rounded-xl border border-line py-3 text-sm font-semibold text-fg hover:bg-elev-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={baseStructureMutating}
                className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {baseStructureMutating ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
