import { X } from "lucide-react";
import { EDIT_GATEWAY_OPTIONS, isSuccessStatus, isSyntheticPaymentId } from "./feeTransactionsHelpers";
import type { PaymentRow } from "./feeTransactionsTypes";

export function EditPaymentDialog({
  editing,
  editAmount,
  onEditAmountChange,
  editRef,
  onEditRefChange,
  editGateway,
  onEditGatewayChange,
  editDate,
  onEditDateChange,
  saving,
  onClose,
  onSave,
}: {
  editing: PaymentRow;
  editAmount: string;
  onEditAmountChange: (v: string) => void;
  editRef: string;
  onEditRefChange: (v: string) => void;
  editGateway: string;
  onEditGatewayChange: (v: string) => void;
  editDate: string;
  onEditDateChange: (v: string) => void;
  saving: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-overlay p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-payment-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-5 shadow-pop">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h4 id="edit-payment-title" className="text-lg font-semibold text-fg">
            {isSyntheticPaymentId(editing.id) ? `Edit ${editing.feeTypeName || "fee"}` : "Edit transaction"}
          </h4>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-fg-muted hover:bg-elev-3 hover:text-fg"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3 text-sm">
          {isSyntheticPaymentId(editing.id) ? (
            <p className="rounded-lg border border-line bg-elev-1 px-3 py-2 text-xs text-fg-muted">
              This line is the amount stored on the student profile (not a separate payment
              record). Saving updates the student; use 0 to clear.
            </p>
          ) : null}
          {isSyntheticPaymentId(editing.id) || isSuccessStatus(editing.status) ? (
            <div>
              <label className="mb-1 block text-xs font-medium text-fg-subtle">Amount (₹)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={editAmount}
                onChange={(e) => onEditAmountChange(e.target.value)}
                className="w-full rounded-xl border border-line bg-well px-3 py-2 text-fg"
              />
            </div>
          ) : (
            <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
              Amount can only be edited for successful (SUCCESS) payments. You can still update
              reference, method, and date.
            </p>
          )}
          {!isSyntheticPaymentId(editing.id) ? (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-fg-subtle">Reference / UTR</label>
                <input
                  type="text"
                  value={editRef}
                  onChange={(e) => onEditRefChange(e.target.value)}
                  className="w-full rounded-xl border border-line bg-well px-3 py-2 text-fg"
                  placeholder="Transaction reference"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-fg-subtle">
                  Payment method (fee report column)
                </label>
                <select
                  value={editGateway}
                  onChange={(e) => onEditGatewayChange(e.target.value)}
                  className="w-full rounded-xl border border-line bg-well px-3 py-2 text-fg"
                >
                  {!EDIT_GATEWAY_OPTIONS.some((o) => o.value === editGateway) ? (
                    <option value={editGateway}>
                      Legacy / other: {editGateway || "—"} (choose a standard code below after this option)
                    </option>
                  ) : null}
                  {EDIT_GATEWAY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                {!EDIT_GATEWAY_OPTIONS.some((o) => o.value === (editing?.method || "").trim()) ? (
                  <p className="mt-1 text-[11px] text-amber-800 dark:text-amber-200">
                    This row uses a non-standard gateway code. Select{' '}
                    <span className="font-semibold">Online (UPI / QR)</span> or{' '}
                    <span className="font-semibold">UPI</span> for digital collections, then save — the fee Excel
                    report uses this field for the Cash vs Online columns.
                  </p>
                ) : null}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-fg-subtle">Date recorded</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => onEditDateChange(e.target.value)}
                  className="w-full rounded-xl border border-line bg-well px-3 py-2 text-fg"
                />
              </div>
            </>
          ) : null}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
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
    </div>
  );
}
