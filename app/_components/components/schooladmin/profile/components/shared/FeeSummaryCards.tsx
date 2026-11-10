import { formatRupee } from "@/lib/formatRupee";
import { DISCOUNT_HEAD_OVERALL_KEY } from "../ModifyFeeModal";
import type { DiscountApprovalSummary } from "./feesBreakdownHelpers";

type ApprovalUi = {
  label: string;
  chip: string;
  border: string;
  bg: string;
  text: string;
  dot: string;
} | null;

export function FeeSummaryCards({
  displayTotalAmount,
  displayPreDiscountTotal,
  raisedDiscountAmount,
  discountAmount,
  approvalUi,
  approvalState,
  discountFeeHeadLabel,
  discountFeeHeadKey,
  discountRemarks,
  displayAmountPaid,
  paidPercentage,
  displayRemainingAmount,
  previousYearRemainingAmount,
}: {
  displayTotalAmount: number;
  displayPreDiscountTotal: number;
  raisedDiscountAmount: number | null;
  discountAmount: number;
  approvalUi: ApprovalUi;
  approvalState: DiscountApprovalSummary[];
  discountFeeHeadLabel?: string | null;
  discountFeeHeadKey?: string | null;
  discountRemarks?: string | null;
  displayAmountPaid: number;
  paidPercentage: number;
  displayRemainingAmount: number;
  previousYearRemainingAmount: number;
}) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-xl border border-line bg-surface p-4">
        <p className="text-[13px] font-medium text-fg-subtle">Current Year Fees</p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-fg tabular-nums">₹{formatRupee(displayTotalAmount)}</p>
        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1 font-semibold">
          Pre-discount: ₹{formatRupee(displayPreDiscountTotal)}
        </p>
        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1 font-semibold">
          {raisedDiscountAmount != null ? "Raised discount" : "Discount"}: ₹
          {formatRupee(raisedDiscountAmount ?? discountAmount)}
        </p>
        {approvalUi ? (
          <p className={`text-[11px] mt-1 font-semibold ${approvalUi.text}`}>
            Status: {approvalUi.label}
          </p>
        ) : null}
        {approvalUi ? (
          <div className={`mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${approvalUi.border} ${approvalUi.bg} ${approvalUi.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${approvalUi.dot}`} />
            <span>{approvalUi.chip}</span>
            {raisedDiscountAmount ? (
              <span>₹{formatRupee(raisedDiscountAmount)}</span>
            ) : null}
          </div>
        ) : null}
        {approvalState.length > 1 ? (
          <div className="mt-2 space-y-1 rounded-lg border border-line bg-well px-2.5 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">Raised discount history</p>
            {approvalState.map((approval, index) => {
              const statusStyle =
                approval.status === "PENDING"
                  ? "text-sky-800 dark:text-sky-200"
                  : approval.status === "REJECTED"
                    ? "text-red-800 dark:text-red-200"
                    : "text-primary";
              return (
                <div key={approval.id} className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="min-w-0 truncate text-amber-800 dark:text-amber-100">
                    #{index + 1} {approval.discountFeeHeadLabel || "Discount"}
                  </span>
                  <span className={`shrink-0 font-semibold ${statusStyle}`}>
                    {approval.status} · ₹{formatRupee(approval.discountFixedAmount ?? 0)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : null}
        {(discountFeeHeadLabel?.trim() ||
          discountRemarks?.trim() ||
          discountFeeHeadKey?.trim()) ? (
          <div className="mt-2 rounded-lg border border-amber-500/25 bg-well px-2.5 py-2 text-left space-y-1">
            {discountFeeHeadLabel?.trim() ? (
              <p className="text-[11px] text-amber-800 dark:text-amber-200">
                <span className="font-semibold text-amber-700 dark:text-amber-300">Discount head: </span>
                {discountFeeHeadLabel}
              </p>
            ) : discountFeeHeadKey?.trim() ? (
              <p className="text-[11px] text-amber-800 dark:text-amber-200">
                <span className="font-semibold text-amber-700 dark:text-amber-300">Discount head: </span>
                {discountFeeHeadKey.trim() === DISCOUNT_HEAD_OVERALL_KEY
                  ? "Overall / consolidated"
                  : discountFeeHeadKey}
              </p>
            ) : null}
            {discountRemarks?.trim() ? (
              <p className="text-[11px] text-amber-800 dark:text-amber-200 leading-snug">
                <span className="font-semibold text-amber-700 dark:text-amber-300">Remarks: </span>
                {discountRemarks}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-line bg-surface p-4">
        <p className="text-[13px] font-medium text-fg-subtle">Current Year Paid</p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-fg tabular-nums">₹{formatRupee(displayAmountPaid)}</p>
        <p className="text-xs text-primary mt-1 font-semibold">{Math.round(paidPercentage)}% Paid</p>
      </div>

      <div className="rounded-xl border border-line bg-surface p-4">
        <p className="text-[13px] font-medium text-fg-subtle">Current Year Due</p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-fg tabular-nums">₹{formatRupee(displayRemainingAmount)}</p>
        <p className="text-xs text-red-700 dark:text-red-400 mt-1 font-semibold">
          {Math.round(100 - paidPercentage)}% Pending
        </p>
      </div>

      <div className="rounded-xl border border-line bg-surface p-4">
        <p className="text-[13px] font-medium text-fg-subtle">Previous Year Due</p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-fg tabular-nums">₹{formatRupee(previousYearRemainingAmount)}</p>
        <p className="text-xs text-orange-700 dark:text-orange-300 mt-1 font-semibold">Kept separate from current fees</p>
      </div>
    </div>
  );
}
