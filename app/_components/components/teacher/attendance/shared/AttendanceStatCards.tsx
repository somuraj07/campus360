import { CheckCircle2, Clock, Users, XCircle } from "lucide-react";
import { KpiCard, KpiGrid } from "../../../common/ui";

export function AttendanceStatCards({
  stats,
}: {
  stats: { present: number; absent: number; late: number; total: number };
}) {
  return (
    <KpiGrid>
      <KpiCard label="Present" value={stats.present} icon={CheckCircle2} tone="green" hint="Marked present" />
      <KpiCard label="Absent" value={stats.absent} icon={XCircle} tone="red" hint="Marked absent" />
      <KpiCard label="Late" value={stats.late} icon={Clock} tone="gold" hint="Arrived late" />
      <KpiCard label="Total Students" value={stats.total} icon={Users} hint="In this class" />
    </KpiGrid>
  );
}
