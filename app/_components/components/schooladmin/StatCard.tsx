import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  iconClassName?: string;
  label: string;
  value: string | number;
}

/** Compact KPI tile matching `KpiCard` in common/ui (icon accepts any node). */
export default function StatCard({ icon, iconClassName, label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-elev-1 p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-fg-subtle">{label}</p>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 ${iconClassName ?? "text-primary"}`}
        >
          {icon}
        </span>
      </div>
      <p className="mt-2 text-[28px] font-semibold leading-none tracking-tight text-fg tabular-nums">{value}</p>
    </div>
  );
}
