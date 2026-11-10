"use client";

import { SaPageHeader, KpiCard, btnClass } from "../../common/ui";
import { Award, Clock, FileText } from "lucide-react";
import CertificatesCard from "./CertificatesCard";
import ApprovedCertificates from "./ApprovedCertificates";
import ParentTimellyLoader from "../ParentTimellyLoader";
import { useParentCertificatesState } from "./shared";
import { CertificateRequestsSection } from "./shared";
import { RequestCertificateModal } from "./shared";

export default function ParentCertificatesTab() {
  const {
    certificateRequests,
    certificates,
    loading,
    studentName,
    showRequestModal,
    setShowRequestModal,
    certificateType,
    setCertificateType,
    requestReason,
    setRequestReason,
    requestLoading,
    message,
    handleRequestCertificate,
    pendingRequests,
    approvedRequests,
    rejectedRequests,
    totalIssued,
    approvedCertificatesToShow,
  } = useParentCertificatesState();

  if (loading && certificateRequests.length === 0 && certificates.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
        <ParentTimellyLoader preset="certificates" className="w-full max-w-2xl" />
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="mx-auto w-full max-w-[1400px] space-y-5 sm:space-y-6">

        <SaPageHeader
          eyebrow="Your child"
          title="Certificates"
          description={`Request and download certificates for ${studentName || "your child"}`}
          actions={
            <button type="button" onClick={() => setShowRequestModal(true)} className={btnClass("primary")}>
              <FileText size={16} />
              Request Certificate
            </button>
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <KpiCard label="Processing" value={pendingRequests.length} icon={Clock} tone="gold" hint="Awaiting the school" />
          <KpiCard label="Total Issued" value={totalIssued} icon={Award} tone="green" hint="Ready to download" />
        </div>

        {/* CERTIFICATES */}
        <CertificatesCard />

        {/* CERTIFICATE REQUESTS */}
        <CertificateRequestsSection
          loading={loading}
          certificateRequests={certificateRequests}
          pendingRequests={pendingRequests}
          approvedRequests={approvedRequests}
          rejectedRequests={rejectedRequests}
        />

        {/* APPROVED CERTIFICATES (issued + approved requests) */}
        <ApprovedCertificates certificates={approvedCertificatesToShow} />

        {/* REQUEST CERTIFICATE MODAL */}
        {showRequestModal && (
          <RequestCertificateModal
            requestLoading={requestLoading}
            onClose={() => setShowRequestModal(false)}
            message={message}
            certificateType={certificateType}
            setCertificateType={setCertificateType}
            requestReason={requestReason}
            setRequestReason={setRequestReason}
            onSubmit={handleRequestCertificate}
          />
        )}
      </div>
    </div>
  );
}
