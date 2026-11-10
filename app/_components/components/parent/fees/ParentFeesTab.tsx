"use client";

import { AlertCircle } from "lucide-react";
import PageHeader from "../../common/PageHeader";
import { EmptyState } from "../../common/ui";
import ParentTimellyLoader from "../ParentTimellyLoader";
import FeePaymentReceiptTemplate from "../../pdf/FeePaymentReceiptTemplate";
import { useParentFeesState } from "./shared";
import { FeeSummarySection } from "./shared";
import { DueHeadsSection } from "./shared";
import { DueReportSection } from "./shared";
import { PaymentHistorySection } from "./shared";

export default function ParentFeesTab() {
  const {
    fee,
    loading,
    error,
    generatingPdfId,
    receiptData,
    receiptRef,
    dueHeadRows,
    transactions,
    handleDownloadInvoice,
  } = useParentFeesState();

  if (loading && !fee) {
    return (
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 pb-10 sm:gap-6">
        <PageHeader eyebrow="Your child" title="Fees" subtitle="View fee dues and payment history" />
        <div className="flex-1 flex items-center justify-center min-h-[40vh]">
          <ParentTimellyLoader preset="fees" className="w-full max-w-2xl" />
        </div>
      </div>
    );
  }

  if (error || !fee) {
    return (
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 pb-10 sm:gap-6">
        <PageHeader eyebrow="Your child" title="Fees" subtitle="View fee dues and payment history" />
        <div className="rounded-2xl border border-line bg-elev-1">
          <EmptyState
            icon={AlertCircle}
            title={error ? "Couldn't load fee details" : "Fee details not configured"}
            description={error || "Please contact the school admin."}
          />
        </div>
      </div>
    );
  }

  const progress = fee.finalFee > 0 ? Math.min((fee.amountPaid / fee.finalFee) * 100, 100) : 0;
  const totalDue = dueHeadRows.reduce((s, h) => s + h.due, 0);

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 pb-10 sm:gap-6">
      <PageHeader eyebrow="Your child" title="Fees" subtitle="View all fee dues and payment history" compact />

      <FeeSummarySection fee={fee} progress={progress} />

      <DueReportSection />

      <DueHeadsSection dueHeadRows={dueHeadRows} totalDue={totalDue} />

      <PaymentHistorySection
        transactions={transactions}
        generatingPdfId={generatingPdfId}
        onDownloadInvoice={handleDownloadInvoice}
      />

      <FeePaymentReceiptTemplate
        ref={receiptRef}
        data={receiptData}
        singleCopy
        showSignature={false}
      />
    </div>
  );
}
