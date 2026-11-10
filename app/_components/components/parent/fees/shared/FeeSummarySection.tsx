import { CheckCircle, Clock, IndianRupee } from "lucide-react";
import type { ParentFeesPayload } from "@/lib/parent/loadParentPortal";
import { formatRupee } from "./parentFeesHelpers";

function SummaryStat({
  label,
  value,
  valueClass = "text-fg",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="bg-elev-1 rounded-xl p-3 sm:p-4 border border-line min-w-0">
      <p className="text-[10px] sm:text-xs text-fg-muted uppercase tracking-wider truncate">{label}</p>
      <p className={`text-lg sm:text-xl font-bold mt-1 truncate ${valueClass}`}>{value}</p>
    </div>
  );
}

export function FeeSummarySection({ fee, progress }: { fee: ParentFeesPayload; progress: number }) {
  return (
    <section className="glass-card rounded-2xl p-4 sm:p-6 space-y-4">
      <h3 className="text-base sm:text-lg font-semibold text-fg flex items-center gap-2">
        <IndianRupee className="w-5 h-5 text-primary shrink-0" />
        Fee Summary
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <SummaryStat label="Total Fee" value={formatRupee(fee.totalFee)} />
        <SummaryStat label="Final Fee" value={formatRupee(fee.finalFee)} valueClass="text-primary" />
        <SummaryStat label="Paid" value={formatRupee(fee.amountPaid)} valueClass="text-emerald-700 dark:text-emerald-400" />
        <SummaryStat label="Remaining" value={formatRupee(fee.remainingFee)} />
      </div>

      <div>
        <div className="flex justify-between text-xs sm:text-sm mb-2 gap-2">
          <span className="text-fg-muted">Payment progress</span>
          <span className="text-fg font-medium text-right">
            {formatRupee(fee.amountPaid)} / {formatRupee(fee.finalFee)}
          </span>
        </div>
        <div className="h-2.5 sm:h-3 bg-elev-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-primary to-emerald-500 rounded-full transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {fee.remainingFee <= 0 ? (
        <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
          <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-700 dark:text-emerald-400 shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-fg text-sm sm:text-base">All fees paid</p>
            <p className="text-xs sm:text-sm text-fg-muted">No outstanding balance on your account.</p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <Clock className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="font-medium text-fg text-sm sm:text-base">
              Outstanding: {formatRupee(fee.remainingFee)}
            </p>
            <p className="text-xs sm:text-sm text-fg-muted mt-1">
              Online payment is not enabled yet. Please pay at the school office — payments
              appear here once recorded by the admin.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
