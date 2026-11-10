import { ClipboardCheck } from "lucide-react";
import { Panel } from "@/app/_components/components/common/ui";

type Props = {
  present?: number;
  absent?: number;
  late?: number;
  total?: number;
  overallRate?: number;
  presentPct?: string;
  absentPct?: string;
  latePct?: string;
};

export const AttendanceCard = ({
  present = 0,
  absent = 0,
  late = 0,
  total = 0,
  overallRate = 0,
  presentPct = "0",
  absentPct = "0",
  latePct = "0",
}: Props) => {
  const segments = [
    { label: "Present", value: present, pct: presentPct, bar: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-400" },
    { label: "Late", value: late, pct: latePct, bar: "bg-amber-400", text: "text-amber-700 dark:text-amber-400" },
    { label: "Absent", value: absent, pct: absentPct, bar: "bg-rose-500", text: "text-rose-700 dark:text-rose-400" },
  ];

  return (
    <Panel icon={ClipboardCheck} title="Students Attendance Overview" description="Today's attendance summary" className="h-full">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Rate ring */}
        <div className="relative mx-auto h-36 w-36 shrink-0 sm:mx-0">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="3.2" className="stroke-elev-3" />
            {overallRate > 0 && (
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              strokeWidth="3.2"
              strokeLinecap="round"
              className="stroke-primary"
              strokeDasharray={`${(Math.min(100, overallRate) / 100) * 97.4} 97.4`}
            />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold tracking-tight text-fg tabular-nums">{overallRate}%</span>
            <span className="text-[11px] text-fg-subtle">Overall rate</span>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-elev-3">
            {segments.map((s) => (
              <div key={s.label} className={s.bar} style={{ width: `${Number(s.pct) || 0}%` }} />
            ))}
          </div>
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {segments.map((s) => (
              <div key={s.label} className="rounded-xl border border-line bg-surface p-3">
                <dt className="flex items-center gap-1.5 text-xs text-fg-subtle">
                  <span className={`h-2 w-2 rounded-full ${s.bar}`} />
                  {s.label}
                </dt>
                <dd className="mt-1 text-xl font-semibold text-fg tabular-nums">{s.value.toLocaleString("en-IN")}</dd>
                <dd className={`text-xs font-medium ${s.text}`}>{s.pct}%</dd>
              </div>
            ))}
            <div className="rounded-xl border border-line bg-surface p-3">
              <dt className="text-xs text-fg-subtle">Total</dt>
              <dd className="mt-1 text-xl font-semibold text-fg tabular-nums">{total.toLocaleString("en-IN")}</dd>
              <dd className="text-xs font-medium text-fg-subtle">Students</dd>
            </div>
          </dl>
        </div>
      </div>
    </Panel>
  );
};
