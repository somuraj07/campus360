import { AlertTriangle } from "lucide-react";

export function ConditionalApprovalModal({
  conditionalMessage,
  onConditionalMessageChange,
  onCancel,
  onConfirm,
  confirmDisabled,
}: {
  conditionalMessage: string;
  onConditionalMessageChange: (v: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  confirmDisabled: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-overlay flex items-center justify-center z-50 p-4">
      <div className="bg-linear-to-br from-elev-2 to-elev-3 rounded-2xl p-6 w-full sm:w-[420px] space-y-4">
        <h3 className="text-fg text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="text-yellow-700 dark:text-yellow-400" /> Conditional Approval
        </h3>
        <p className="text-xs text-fg-subtle">Please specify the condition for approving this leave request. The teacher will be notified of this condition.
        </p>
        <textarea
          className="w-full h-28 rounded-xl bg-well border border-yellow-500/40 p-3 text-sm text-fg outline-none"
          placeholder="e.g. Must complete pending grading before leaving..."
          value={conditionalMessage}
          onChange={(e) => onConditionalMessageChange(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-elev-2 text-fg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={confirmDisabled}
            className="px-5 py-2 rounded-xl bg-yellow-500 text-black font-semibold disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
