import { X } from "lucide-react";
import type { SubscriptionRow } from "../../Subscriptions";
import { Field, Segmented, TextInput, btnClass } from "../ui";

export function EditSubscriptionModal({
  editing,
  setEditing,
  savingId,
  onCancel,
  onSave,
}: {
  editing: SubscriptionRow;
  setEditing: (updater: SubscriptionRow | ((prev: SubscriptionRow | null) => SubscriptionRow | null)) => void;
  savingId: string | null;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-overlay p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="subscription-edit-title"
    >
      <div className="flex max-h-[min(92dvh,720px)] w-full flex-col overflow-hidden rounded-t-3xl border border-line bg-surface shadow-pop sm:max-w-lg sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-line px-6 py-4">
          <div>
            <h2 id="subscription-edit-title" className="text-lg font-semibold text-fg">
              Edit subscription
            </h2>
            <p className="mt-0.5 text-xs text-fg-subtle">Billing mode, pricing and access for this school</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-fg-subtle transition hover:bg-elev-2 hover:text-fg"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-6 py-5">
          <Field label="School name">
            <TextInput type="text" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
          </Field>

          <div>
            <p className="mb-1.5 text-[13px] font-medium text-fg">Subscription mode</p>
            <Segmented
              className="w-full [&>button]:flex-1"
              value={editing.billingMode}
              onChange={(mode) => setEditing((prev) => (prev ? { ...prev, billingMode: mode } : prev))}
              options={[
                { value: "PARENT_SUBSCRIPTION", label: "Parent subscription" },
                { value: "SCHOOL_PAID", label: "School paid" },
              ]}
            />
          </div>

          {editing.billingMode === "PARENT_SUBSCRIPTION" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Amount (₹ / year)">
                <TextInput
                  type="number"
                  min={0}
                  value={editing.parentSubscriptionAmount ?? ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      parentSubscriptionAmount: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                />
              </Field>
              <Field label="Free trial days">
                <TextInput
                  type="number"
                  min={0}
                  value={editing.parentSubscriptionTrialDays ?? 0}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      parentSubscriptionTrialDays: e.target.value === "" ? 0 : Number(e.target.value),
                    })
                  }
                />
              </Field>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-elev-2 p-4">
            <div>
              <p className="text-sm font-semibold text-fg">School status</p>
              <p className="mt-0.5 text-xs text-fg-subtle">
                {editing.isActive ? "Active — everyone can use the portal." : "Deactivated — portal access is locked."}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={editing.isActive}
              aria-label={editing.isActive ? "Active" : "Deactivated"}
              onClick={() => setEditing((prev) => (prev ? { ...prev, isActive: !prev.isActive } : prev))}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${editing.isActive ? "bg-emerald-600" : "bg-red-500"}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                  editing.isActive ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-line bg-elev-2 px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end sm:pb-4">
          <button type="button" onClick={onCancel} className={btnClass("secondary")}>
            Cancel
          </button>
          <button type="button" disabled={savingId === editing.id} onClick={onSave} className={btnClass("primary")}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
