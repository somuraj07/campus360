import { BookOpen, Calendar, Hourglass, Wallet } from "lucide-react";
import type { StudentDetail } from "./types";
import type { AdminStudentFeeBreakdownResult } from "@/lib/fees/computeAdminStudentFeeBreakdown";
import { KpiCard, KpiGrid } from "../../../common/ui";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export function ProfileStatCards({
  detail,
  feeBreakdown,
}: {
  detail: StudentDetail;
  feeBreakdown: AdminStudentFeeBreakdownResult | null;
}) {
  const due = feeBreakdown?.remainingFee ?? detail.fee?.remainingFee ?? 0;
  const paid = feeBreakdown?.amountPaid ?? detail.fee?.amountPaid ?? 0;

  const trends = detail.attendanceTrends;
  const present = trends.reduce((a, t) => a + t.present, 0);
  const totalDays = trends.reduce((a, t) => a + t.total, 0);
  const attendancePct = totalDays > 0 ? Math.round((present / totalDays) * 100) : null;

  const scores = detail.academicPerformance;
  const avgScore = scores.length ? Math.round(scores.reduce((a, s) => a + s.score, 0) / scores.length) : null;

  return (
    <KpiGrid>
      <KpiCard
        label="Attendance"
        value={attendancePct === null ? "—" : `${attendancePct}%`}
        icon={Calendar}
        tone="green"
        hint={totalDays > 0 ? `${present}/${totalDays} days this year` : "No attendance recorded"}
      />
      <KpiCard
        label="Average Score"
        value={avgScore === null ? "—" : `${avgScore}%`}
        icon={BookOpen}
        tone="sky"
        hint={scores.length ? `Across ${scores.length} subject${scores.length === 1 ? "" : "s"}` : "No marks recorded"}
      />
      <KpiCard label="Fees Paid" value={inr(paid)} icon={Wallet} hint="This academic year" />
      <KpiCard
        label="Fees Due"
        value={inr(Math.max(0, due))}
        icon={Hourglass}
        tone={due > 0 ? "gold" : "green"}
        hint={due > 0 ? "Pending" : "All cleared"}
      />
    </KpiGrid>
  );
}
