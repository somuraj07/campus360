import { Pencil } from "lucide-react";
import type { SubscriptionRow } from "../../Subscriptions";
import { ModeBadge, StatusPill } from "./subscriptionsColumns";
import { InitialsAvatar, btnClass } from "../ui";

export function SubscriptionMobileCard({
  row: r,
  onEdit,
}: {
  row: SubscriptionRow;
  onEdit: (r: SubscriptionRow) => void;
}) {
  const isParent = r.billingMode === "PARENT_SUBSCRIPTION";
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-elev-1">
      <div className="flex items-center gap-3 p-4">
        <InitialsAvatar name={r.name} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-fg">{r.name}</p>
          <p className="truncate text-xs text-fg-subtle">{r.location || "No location"}</p>
        </div>
        <button type="button" onClick={() => onEdit(r)} className={btnClass("secondary", "sm")}>
          <Pencil size={13} />
          Edit
        </button>
      </div>
      <div className="flex flex-wrap gap-2 px-4 pb-3">
        <ModeBadge mode={r.billingMode} />
        <StatusPill active={r.isActive} />
      </div>
      <dl className="grid grid-cols-3 divide-x divide-line-subtle border-t border-line-subtle text-center">
        <div className="px-2 py-3">
          <dt className="text-[11px] text-fg-subtle">Amount / yr</dt>
          <dd className="mt-0.5 text-sm font-semibold text-fg tabular-nums">
            {isParent
              ? typeof r.parentSubscriptionAmount === "number"
                ? `₹${r.parentSubscriptionAmount.toLocaleString("en-IN")}`
                : "Not set"
              : "Included"}
          </dd>
        </div>
        <div className="px-2 py-3">
          <dt className="text-[11px] text-fg-subtle">Trial</dt>
          <dd className="mt-0.5 text-sm font-semibold text-fg">{isParent ? `${r.parentSubscriptionTrialDays ?? 0} days` : "—"}</dd>
        </div>
        <div className="px-2 py-3">
          <dt className="text-[11px] text-fg-subtle">Created</dt>
          <dd className="mt-0.5 text-sm font-semibold text-fg tabular-nums">
            {new Date(r.createdAt).toLocaleDateString("en-IN")}
          </dd>
        </div>
      </dl>
    </article>
  );
}
