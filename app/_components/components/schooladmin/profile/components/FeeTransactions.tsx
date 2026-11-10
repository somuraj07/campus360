import { Receipt, Printer, Pencil, Trash2 } from "lucide-react";
import FeePaymentReceiptTemplate from "../../../pdf/FeePaymentReceiptTemplate";
import { formatReceiptTransactionDate } from "@/lib/fees/receiptDates";
import { isOfflinePaymentGateway } from "@/lib/fees/feePaymentGateway";
import type { FeeTransactionsProps as Props } from "./shared";
import { formatPaymentMethod, isSyntheticPaymentId } from "./shared";
import { useFeeTransactionsState } from "./shared";
import { EditPaymentDialog } from "./shared";

export const FeeTransactions = (props: Props) => {
  const { studentId = "", feesRecordingDisabled = false, transactionsLoading = false } = props;
  const {
    receiptRef,
    receiptData,
    printingId,
    editing,
    editAmount,
    setEditAmount,
    editRef,
    setEditRef,
    editGateway,
    setEditGateway,
    editDate,
    setEditDate,
    saving,
    deletingId,
    selectedReceiptIds,
    transactionRows,
    hasFee,
    totalPaid,
    total,
    hasAny,
    openEdit,
    closeEdit,
    saveEdit,
    confirmDelete,
    handlePrintReceipt,
    toggleReceiptSelection,
    printSelectedReceipts,
  } = useFeeTransactionsState(props);

  return (
    <div
      id="student-profile-fees-section"
      className="bg-elev-1 border border-line rounded-2xl p-5 sm:p-6 min-w-0 w-full scroll-mt-28 sm:scroll-mt-24"
    >
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="flex items-center gap-2.5 text-[15px] font-semibold text-fg">
          <Receipt className="w-5 h-5 text-primary flex-shrink-0" /> Fee Details & Transactions
        </h3>
        <div className="flex flex-col items-start sm:items-end gap-2">
          <button
            type="button"
            onClick={printSelectedReceipts}
            disabled={selectedReceiptIds.length === 0 || printingId === "bulk"}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line-strong bg-surface px-3 text-xs font-semibold text-fg transition-colors hover:bg-elev-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5 shrink-0" />
            {printingId === "bulk" ? "Printing..." : `Print Selected (${selectedReceiptIds.length})`}
          </button>
          {hasFee && (
          <div className="text-left sm:text-right">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">FEES PAID / TOTAL</p>
            <p className="text-xl sm:text-2xl font-bold text-fg">
              ₹{totalPaid.toLocaleString("en-IN")}{" "}
              <span className="text-fg-subtle">/ ₹{total.toLocaleString("en-IN")}</span>
            </p>
          </div>
          )}
        </div>
      </div>

      {!transactionsLoading && !hasAny ? (
        <div className="py-8 text-center text-fg-subtle text-sm">No fee records</div>
      ) : transactionsLoading && transactionRows.length === 0 ? (
        <div className="py-8 text-center text-fg-muted text-sm">Loading transaction history…</div>
      ) : (
        <div className="w-full overflow-x-auto overflow-y-hidden overscroll-x-contain">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-well text-[11px] font-semibold uppercase tracking-wider text-fg-subtle border-b border-line">
                <th className="pb-3 pr-2 w-8 font-medium" aria-label="Select" />
                <th className="pb-3 px-2 font-medium whitespace-nowrap">Date</th>
                <th className="pb-3 px-2 font-medium min-w-0">Fee type</th>
                <th className="pb-3 px-2 font-medium whitespace-nowrap">Method</th>
                <th className="pb-3 px-2 font-medium min-w-0 hidden md:table-cell">Collected by</th>
                <th className="pb-3 px-2 font-medium min-w-0 hidden lg:table-cell">UTR / Ref</th>
                <th className="pb-3 px-2 font-medium whitespace-nowrap">Status</th>
                <th className="pb-3 px-2 font-medium text-right whitespace-nowrap">Amount</th>
                <th className="pb-3 pl-2 font-medium text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactionRows.map((row) => {
                const payment = row.sourcePayment;
                const synthetic = isSyntheticPaymentId(row.paymentId);
                const canEditRow = Boolean(studentId.trim()) && !feesRecordingDisabled;
                return (
                  <tr
                    key={row.rowKey}
                    className="border-b border-line-subtle last:border-0 hover:bg-elev-2 transition-colors"
                  >
                    <td className="py-3 pr-1 align-top">
                      <input
                        type="checkbox"
                        checked={selectedReceiptIds.includes(row.rowKey)}
                        onChange={() => toggleReceiptSelection(row.rowKey)}
                        className="h-4 w-4 rounded border-line-strong accent-primary"
                        aria-label={`Select ${row.feeTypeName} for receipt print`}
                      />
                    </td>
                    <td className="py-3 px-1 text-fg-muted text-xs sm:text-sm whitespace-nowrap align-top">
                      {formatReceiptTransactionDate(row.createdAt)}
                    </td>
                    <td className="py-3 px-1 text-fg text-xs sm:text-sm leading-snug break-words align-top">
                      {row.feeTypeName}
                    </td>
                    <td className="py-3 px-1 text-fg-muted text-xs sm:text-sm whitespace-nowrap align-top">
                      {formatPaymentMethod(row.method)}
                    </td>
                    <td className="py-3 px-1 text-fg-muted text-xs sm:text-sm leading-snug break-words align-top hidden md:table-cell">
                      {isOfflinePaymentGateway(row.method) ? row.collectedByName || "—" : "—"}
                    </td>
                    <td className="py-3 px-1 text-fg-muted text-xs sm:text-sm break-all align-top hidden lg:table-cell">
                      {row.transactionId && row.transactionId.trim() && row.transactionId !== "N/A"
                        ? row.transactionId
                        : "-"}
                    </td>
                    <td className="py-3 px-1 align-top">
                      <span className="inline-flex items-center whitespace-nowrap rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {row.status || "Paid"}
                      </span>
                    </td>
                    <td className="py-3 px-1 text-right font-bold text-fg text-xs sm:text-sm whitespace-nowrap align-top">
                      ₹{row.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 pl-1 text-right align-top">
                      <div className="flex justify-end gap-1 sm:gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handlePrintReceipt(row)}
                          disabled={printingId === row.rowKey}
                          className="inline-flex items-center justify-center gap-1 rounded-lg border border-primary/30 bg-primary/15 px-2 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/25 disabled:opacity-40"
                          title="Print receipt"
                        >
                          <Printer className="w-3.5 h-3.5 shrink-0" />
                          <span className="hidden xl:inline">Print</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(payment)}
                          disabled={!canEditRow}
                          className="inline-flex items-center justify-center gap-1 rounded-lg border border-primary/40 bg-primary/15 px-2 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/25 disabled:cursor-not-allowed disabled:opacity-40"
                          title={synthetic ? "Edit fee amount" : "Edit payment"}
                        >
                          <Pencil className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} aria-hidden />
                          <span className="hidden xl:inline">Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDelete(payment)}
                          disabled={!canEditRow || deletingId === row.paymentId}
                          className="inline-flex items-center justify-center gap-1 rounded-lg border border-rose-400/50 bg-rose-500/20 px-2 py-1.5 text-[11px] font-semibold text-rose-800 dark:text-rose-200 hover:bg-rose-500/30 disabled:cursor-not-allowed disabled:opacity-40"
                          title={synthetic ? "Remove fee" : "Delete payment"}
                        >
                          <Trash2 className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} aria-hidden />
                          <span className="hidden xl:inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <FeePaymentReceiptTemplate ref={receiptRef} data={receiptData} />

      {editing ? (
        <EditPaymentDialog
          editing={editing}
          editAmount={editAmount}
          onEditAmountChange={setEditAmount}
          editRef={editRef}
          onEditRefChange={setEditRef}
          editGateway={editGateway}
          onEditGatewayChange={setEditGateway}
          editDate={editDate}
          onEditDateChange={setEditDate}
          saving={saving}
          onClose={closeEdit}
          onSave={() => void saveEdit()}
        />
      ) : null}
    </div>
  );
};
