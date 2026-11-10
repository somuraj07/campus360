"use client";

import { BookOpen, CheckCircle2, TrendingUp } from "lucide-react";
import { KpiCard } from "../../common/ui";

type Props = {
  activeCount: number;
  totalSubmissions: number;
  avgCompletionPercent: number;
};

export default function HomeworkStats({ activeCount, totalSubmissions, avgCompletionPercent }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <KpiCard label="Active Assignments" value={activeCount} icon={BookOpen} hint="Currently assigned" />
      <KpiCard label="Total Submissions" value={totalSubmissions} icon={CheckCircle2} tone="sky" hint="Across all assignments" />
      <KpiCard label="Avg. Completion Rate" value={`${avgCompletionPercent}%`} icon={TrendingUp} tone="green" hint="Submitted vs assigned" />
    </div>
  );
}
