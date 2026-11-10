import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  trendColor?: string;
  Icon: LucideIcon;
}

/** KPI tile used on the school dashboard and the Teachers tab. */
export const StatCard = ({ label, value, trend, trendColor = "text-fg-subtle", Icon }: StatCardProps) => (
  <div className="min-w-0 flex-1 rounded-2xl border border-line bg-elev-1 p-5">
    <div className="flex items-start justify-between gap-3">
      <p className="truncate text-[13px] font-medium text-fg-subtle">{label}</p>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon size={18} />
      </span>
    </div>
    <p className="mt-2 truncate text-[28px] font-semibold leading-none tracking-tight text-fg tabular-nums">{value}</p>
    <p className={`mt-2.5 truncate text-xs font-medium ${trendColor}`}>{trend}</p>
  </div>
);
