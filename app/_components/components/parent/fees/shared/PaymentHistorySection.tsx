import { CreditCard, Download, Loader2 } from "lucide-react";
import type { ParentFeesPayload } from "@/lib/parent/loadParentPortal";
import { formatPaymentMethod, formatRupee } from "./parentFeesHelpers";

type Transaction =
  | ({ type: "payment" } & ParentFeesPayload["payments"][number])
  | ({ type: "refund" } & ParentFeesPayload["refunds"][number]);

export function PaymentHistorySection({
  transactions,
  generatingPdfId,
  onDownloadInvoice,
}: {
  transactions: Transaction[];
  generatingPdfId: string | null;
  onDownloadInvoice: (payment: ParentFeesPayload["payments"][number]) => void;
}) {
  return (
    <section className="glass-card rounded-2xl p-4 sm:p-6 space-y-4">
      <h3 className="text-base sm:text-lg font-semibold text-fg flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-primary shrink-0" />
        Payment & refund history
      </h3>

      {transactions.length === 0 ? (
        <p className="text-sm text-fg-subtle py-8 text-center">No payments or refunds recorded yet.</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((t) =>
            t.type === "payment" ? (
              <div
                key={`pay-${t.id}`}
                className="rounded-xl border border-line bg-elev-1 p-3 sm:p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-base sm:text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                      +{formatRupee(t.amount)}
                    </p>
                    <p className="text-xs sm:text-sm text-fg-muted mt-0.5">
                      {new Date(t.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-[11px] sm:text-xs text-fg-subtle mt-1 break-all">
                      {formatPaymentMethod(t.gateway)}
                      {t.transactionId ? ` · ${t.transactionId}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <span
                      className={`text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full ${
                        t.status === "SUCCESS"
                          ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                          : "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      {t.status}
                    </span>
                    {t.status === "SUCCESS" && (
                      <button
                        type="button"
                        onClick={() => onDownloadInvoice(t)}
                        disabled={generatingPdfId === t.id}
                        className="p-1.5 sm:p-2 rounded-lg bg-elev-1 hover:bg-elev-3 text-fg-muted hover:text-fg transition-colors"
                        title="Download receipt"
                      >
                        {generatingPdfId === t.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {t.allocations && t.allocations.length > 0 && (
                  <div className="pt-2 border-t border-line-subtle">
                    <p className="text-[10px] sm:text-xs text-fg-subtle uppercase tracking-wider mb-2">
                      Applied to fee heads
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {t.allocations.map((a, i) => (
                        <span
                          key={`${t.id}-${i}`}
                          className="text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full bg-elev-1 border border-line text-fg-muted"
                        >
                          {a.label}: {formatRupee(a.amount)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                key={`ref-${t.id}`}
                className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 sm:p-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-base font-semibold text-amber-700 dark:text-amber-400">
                    -{formatRupee(t.amount)} (Refund)
                  </p>
                  <p className="text-xs sm:text-sm text-fg-muted mt-0.5">
                    {new Date(t.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
                <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 shrink-0">
                  Refunded
                </span>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}
