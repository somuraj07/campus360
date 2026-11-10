import type { TransactionItem } from "../../RefundModal";
import { isOfflinePaymentGateway } from "@/lib/fees/feePaymentGateway";

export function FeeTransactionsMobileList({
  transactions,
  onOpenStudent,
  onPrefetchStudent,
  onRefund,
}: {
  transactions: TransactionItem[];
  onOpenStudent: (studentId: string) => void;
  onPrefetchStudent: (studentId: string) => void;
  onRefund: (t: TransactionItem) => void;
}) {
  return (
    <div className="space-y-3 sm:hidden">
      {transactions.map((t) => (
        <div key={t.id} className="rounded-xl border border-line bg-well p-4">
          <button
            type="button"
            className="text-left text-base font-semibold text-fg underline-offset-2 hover:underline"
            onMouseEnter={() => onPrefetchStudent(t.student.id)}
            onClick={() => onOpenStudent(t.student.id)}
          >
            {t.student.user?.name || t.student.admissionNumber || "-"}
          </button>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-fg-muted">Date</span>
              <span className="text-right text-fg">
                {new Date(t.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-fg-muted">Class</span>
              <span className="text-right text-fg">
                {t.student.class
                  ? `${t.student.class.name}${t.student.class.section ? `-${t.student.class.section}` : ""}`
                  : "-"}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="text-fg-muted">Gateway</span>
              <div className="text-right text-fg-muted">
                <div>{t.gateway}</div>
                {t.hyperpgStatus ? (
                  <div className="text-xs text-fg-subtle">
                    {t.hyperpgStatus}
                    {typeof t.hyperpgStatusId === "number" ? ` (${t.hyperpgStatusId})` : ""}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-fg-muted">Reference / UTR</span>
              <span className="text-right text-fg-muted break-all">
                {t.transactionId || "-"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-fg-muted">Collected by</span>
              <span className="text-right text-fg-muted">
                {isOfflinePaymentGateway(t.gateway)
                  ? t.collectedByName || "—"
                  : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-fg-muted">Amount</span>
              <span className="text-emerald-700 dark:text-emerald-400">₹{t.amount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-fg-muted">Refunded</span>
              {t.refundable < t.amount ? (
                <span className="text-amber-700 dark:text-amber-400">
                  ₹{(t.amount - t.refundable).toLocaleString()}
                </span>
              ) : (
                <span className="text-fg-subtle">-</span>
              )}
            </div>
            <div className="pt-2">
              {t.refundable > 0 ? (
                <button
                  onClick={() => onRefund(t)}
                  className="w-full rounded-lg bg-amber-500/20 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-500/30"
                >
                  Refund
                </button>
              ) : (
                <span className="text-xs text-fg-subtle">Full refund</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
