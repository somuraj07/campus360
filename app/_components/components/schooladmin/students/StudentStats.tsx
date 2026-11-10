"use client";

import { UserCheck, UserX, Users } from "lucide-react";
import StatCard from "../../common/statCard";

type Props = {
  showing: number;
  totalCount: number | null;
  activeCount: number | null;
  inactiveCount: number | null;
  statusFilter: "active" | "inactive" | "all";
};

export default function StudentStats({
  showing,
  totalCount,
  activeCount,
  inactiveCount,
  statusFilter,
}: Props) {
  const filterLabel =
    statusFilter === "inactive"
      ? "Inactive"
      : statusFilter === "all"
        ? "All"
        : "Active";

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-4">
      <StatCard className="bg-elev-1 p-4 sm:p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary border border-primary/20">
            {filterLabel}
          </span>
        </div>
        <h3 className="text-xs sm:text-sm font-medium text-fg-muted">Showing</h3>
        <p className="text-2xl sm:text-3xl font-bold text-fg mt-1">
          {showing.toLocaleString()}
          {totalCount != null ? (
            <span className="text-base font-medium text-fg-subtle">
              {" "}
              / {totalCount.toLocaleString()}
            </span>
          ) : null}
        </p>
        <p className="text-[11px] text-fg-muted mt-1">In current filter</p>
      </StatCard>

      <StatCard className="bg-elev-1 p-4 sm:p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <UserCheck className="w-5 h-5 text-primary" />
          </div>
        </div>
        <h3 className="text-xs sm:text-sm font-medium text-fg-muted">Active</h3>
        <p className="text-2xl sm:text-3xl font-bold text-fg mt-1">
          {activeCount != null ? activeCount.toLocaleString() : "—"}
        </p>
        <p className="text-[11px] text-fg-muted mt-1">Can access the portal</p>
      </StatCard>

      <StatCard className="bg-elev-1 p-4 sm:p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-xl bg-red-400/10">
            <UserX className="w-5 h-5 text-red-700 dark:text-red-300" />
          </div>
        </div>
        <h3 className="text-xs sm:text-sm font-medium text-fg-muted">Inactive</h3>
        <p className="text-2xl sm:text-3xl font-bold text-fg mt-1">
          {inactiveCount != null ? inactiveCount.toLocaleString() : "—"}
        </p>
        <p className="text-[11px] text-fg-muted mt-1">No portal access</p>
      </StatCard>
    </section>
  );
}
