"use client";

import { BookOpen, CheckCircle2, IndianRupee, Trophy } from "lucide-react";
import { formatAmount } from "../../../utils/format";
import { Badge, KpiCard, KpiGrid } from "../../common/ui";

type Props = {
  attendancePct: number;
  presentDays: number;
  totalAttendanceDays: number;
  homeworkSubmitted: number;
  homeworkTotal: number;
  averageMarksPct: number;
  gradeLabel: string;
  feePendingAmount: number;
};

export default function ParentHomeStats({
  attendancePct,
  presentDays,
  totalAttendanceDays,
  homeworkSubmitted,
  homeworkTotal,
  averageMarksPct,
  gradeLabel,
  feePendingAmount,
}: Props) {
  const homeworkPending = Math.max(homeworkTotal - homeworkSubmitted, 0);
  const hintRow = (text: string, badge: React.ReactNode) => (
    <span className="flex flex-wrap items-center justify-between gap-2">
      <span>{text}</span>
      {badge}
    </span>
  );

  return (
    <KpiGrid>
      <KpiCard
        label="Attendance"
        value={`${attendancePct.toFixed(1)}%`}
        icon={CheckCircle2}
        tone="green"
        hint={hintRow(
          `${presentDays}/${totalAttendanceDays} days present`,
          <Badge tone={attendancePct >= 90 ? "green" : "gold"}>{attendancePct >= 90 ? "Excellent" : "Needs focus"}</Badge>
        )}
      />
      <KpiCard
        label="Homework"
        value={`${homeworkSubmitted}/${homeworkTotal}`}
        icon={BookOpen}
        tone="sky"
        hint={hintRow("Tasks completed", <Badge tone={homeworkPending > 0 ? "gold" : "green"}>{homeworkPending} pending</Badge>)}
      />
      <KpiCard label="Overall Marks" value={gradeLabel} icon={Trophy} tone="gold" hint={`${averageMarksPct.toFixed(1)}% average`} />
      <KpiCard
        label="Fee Status"
        value={formatAmount(feePendingAmount, feePendingAmount >= 100000)}
        icon={IndianRupee}
        tone={feePendingAmount > 0 ? "red" : "green"}
        hint={hintRow("Pending amount", <Badge tone={feePendingAmount > 0 ? "red" : "green"}>{feePendingAmount > 0 ? "Due soon" : "Cleared"}</Badge>)}
      />
    </KpiGrid>
  );
}
