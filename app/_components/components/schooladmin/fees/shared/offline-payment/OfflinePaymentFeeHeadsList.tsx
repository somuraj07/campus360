import type { SelectedHead } from "./useOfflinePaymentFormState";

export function OfflinePaymentFeeHeadsList({
  headOptions,
  selectedHeads,
  dueByKey,
  studentId,
  getHeadKey,
  onToggleHead,
}: {
  headOptions: Array<{ key: string; label: string; head: SelectedHead }>;
  selectedHeads: SelectedHead[];
  dueByKey: Map<string, number>;
  studentId: string;
  getHeadKey: (head: SelectedHead) => string;
  onToggleHead: (head: SelectedHead) => void;
}) {
  return (
    <div className="rounded-xl border border-line overflow-hidden">
      <div className="px-4 py-3 bg-elev-1 border-b border-line">
        <p className="text-sm font-semibold">Fee Heads</p>
        <p className="text-xs text-fg-muted">Select which fees to reduce</p>
      </div>
      <div className="p-4 max-h-44 overflow-y-auto space-y-2">
        {headOptions.length === 0 ? (
          <p className="text-sm text-fg-subtle">Select class and student to load fee heads</p>
        ) : (
          headOptions.map((h) => {
            const checked = selectedHeads.some((x) => getHeadKey(x) === h.key);
            return (
              <label
                key={h.key}
                className="flex items-center justify-between gap-3 text-sm px-3 py-2 rounded-lg bg-elev-1 hover:bg-elev-3 border border-line-subtle cursor-pointer"
              >
                <span className="min-w-0">
                  <span className="block text-fg truncate">{h.label}</span>
                  <span className="block text-xs text-fg-subtle mt-0.5">
                    Due: ₹{(dueByKey.get(h.key) ?? 0).toFixed(0).toLocaleString()}
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleHead(h.head)}
                  className="rounded border-line-strong w-4 h-4 accent-primary"
                  disabled={!studentId}
                />
              </label>
            );
          })
        )}
      </div>
    </div>
  );
}
