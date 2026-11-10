import { Pencil, ToggleLeft, ToggleRight } from "lucide-react";
import { Column } from "../../../../types/superadmin";
import type { BillingMode, SubscriptionRow } from "../../Subscriptions";

export function ModeBadge({ mode }: { mode: BillingMode }) {
  return mode === "SCHOOL_PAID" ? (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent-fg">
      <ToggleRight className="h-3.5 w-3.5 shrink-0" />
      School Paid
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-700 dark:text-sky-300">
      <ToggleLeft className="h-3.5 w-3.5 shrink-0" />
      Parent Sub
    </span>
  );
}

export function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
        active
          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "bg-red-500/10 text-red-700 dark:text-red-300"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {active ? "Active" : "Deactivated"}
    </span>
  );
}

export function buildSubscriptionsColumns({
  onEdit,
}: {
  onEdit: (r: SubscriptionRow) => void;
}): Column<SubscriptionRow>[] {
  return [
    {
      header: "School",
      render: (r) => (
        <div className="flex flex-col min-w-0">
          <span className="text-fg font-medium wrap-break-word">{r.name}</span>
          <span className="text-xs text-fg-subtle">{r.location || "—"}</span>
        </div>
      ),
    },
    {
      header: "Created",
      align: "center",
      render: (r) => (
        <span className="text-xs text-fg-muted whitespace-nowrap">
          {new Date(r.createdAt).toLocaleDateString("en-IN")}
        </span>
      ),
    },
    {
      header: "Mode",
      align: "center",
      render: (r) => (
        <div className="flex justify-center">
          <ModeBadge mode={r.billingMode} />
        </div>
      ),
    },
    {
      header: "Amount (₹ / year)",
      align: "center",
      render: (r) =>
        r.billingMode === "PARENT_SUBSCRIPTION" ? (
          <span className="text-fg text-sm whitespace-nowrap">
            {typeof r.parentSubscriptionAmount === "number"
              ? `₹${r.parentSubscriptionAmount.toLocaleString("en-IN")}`
              : "—"}
          </span>
        ) : (
          <span className="text-fg-subtle text-xs">Included</span>
        ),
    },
    {
      header: "Trial",
      align: "center",
      render: (r) =>
        r.billingMode === "PARENT_SUBSCRIPTION" ? (
          <span className="text-fg tabular-nums">{r.parentSubscriptionTrialDays ?? 0}d</span>
        ) : (
          <span className="text-fg-subtle text-xs">—</span>
        ),
    },
    {
      header: "Status",
      align: "center",
      render: (r) => (
        <div className="flex justify-center">
          <StatusPill active={r.isActive} />
        </div>
      ),
    },
    {
      header: "",
      align: "center",
      render: (r) => (
        <button
          type="button"
          onClick={() => onEdit(r)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-line bg-elev-1 text-xs text-fg hover:bg-elev-3 whitespace-nowrap"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </button>
      ),
    },
  ];
}
