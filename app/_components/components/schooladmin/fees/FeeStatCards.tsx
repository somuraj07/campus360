"use client";

import { AlertTriangle, CalendarClock, Hourglass, IndianRupee, Percent, Wallet } from "lucide-react";
import type { FeeSummary } from "./types";
import { formatRupee } from "@/lib/formatRupee";
import { KpiCard } from "../../common/ui";

interface FeeStatCardsProps {
  stats: FeeSummary | null;
}

export default function FeeStatCards({ stats }: FeeStatCardsProps) {
  const totalFee = stats?.totalFee ?? 0;
  const totalDiscount = stats?.totalDiscount ?? 0;
  const collected = stats?.totalCollected ?? 0;
  const due = stats?.totalDue ?? 0;
  const previousYearDue = stats?.previousYearDue ?? 0;
  const unplaced = stats?.unplacedPayments ?? 0;
  const unplacedStudents = stats?.unplacedStudents ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <KpiCard
        label="Current year total"
        value={`₹${formatRupee(totalFee)}`}
        icon={IndianRupee}
        hint="Excludes previous-year pending"
      />
      <KpiCard
        label="Total collected"
        value={`₹${formatRupee(collected)}`}
        icon={Wallet}
        tone="green"
        hint={
          unplaced > 0 ? (
            <span className="text-amber-700 dark:text-amber-300">
              + ₹{formatRupee(unplaced)} paid on fees {unplacedStudents} student{unplacedStudents === 1 ? "" : "s"} no
              longer owe
            </span>
          ) : (
            "Recorded fee payments"
          )
        }
      />
      <KpiCard label="Total due" value={`₹${formatRupee(due)}`} icon={Hourglass} tone="gold" hint="Current-year outstanding" />
      <KpiCard
        label="Total discount"
        value={`₹${formatRupee(totalDiscount)}`}
        icon={Percent}
        tone="sky"
        hint="Sum of (base − final) per student"
      />
      <KpiCard
        label="Previous year due"
        value={`₹${formatRupee(previousYearDue)}`}
        icon={CalendarClock}
        tone="gold"
        hint="Shown separately from total fees"
      />
      <KpiCard label="Critical" value={stats?.pending ?? 0} icon={AlertTriangle} tone="red" hint="Students with balance due" />
    </div>
  );
}
