"use client";

import { useEffect, useState, useCallback } from "react";
import { CircleAlert, Clock, FileText, SquareCheck } from "lucide-react";
import { SaPage, SaPageHeader, KpiGrid, KpiCard } from "../common/ui";
import CertificatesTab from "./certificatesTab/CertificatesTab";
import {
  loadCertificatesPage,
  patchCertificateRequest,
  peekCertificatesPage,
  setCertificatesPageCache,
} from "@/lib/school/loadSchoolAdminFastTabs";
import { getErrorMessage } from "@/lib/errors/errorInfo";

export type CertificateRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface CertificateRequestListItem {
  id: string;
  certificateType: string | null;
  reason: string | null;
  status: string;
  issuedDate: string | null;
  tcDocumentUrl: string | null;
  createdAt: string;
  student: {
    id: string;
    user: { id: string; name: string | null; email: string | null };
    class: { id: string; name: string; section: string | null } | null;
  };
  requestedBy: { id: string; name: string | null; email: string | null } | null;
  approvedBy: { id: string; name: string | null; email: string | null } | null;
}

export default function SchoolAdminCertificatesTab() {
  const initial = peekCertificatesPage();
  const [certificateRequests, setCertificateRequests] = useState<CertificateRequestListItem[]>(
    () => initial ?? []
  );
  const [loading, setLoading] = useState(() => !initial);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificateRequests = useCallback(async (revalidate = false) => {
    if (!revalidate) {
      const cached = peekCertificatesPage();
      if (cached) {
        setCertificateRequests(cached);
        setLoading(false);
        void fetchCertificateRequests(true);
        return;
      }
    }

    setLoading(certificateRequests.length === 0);
    setError(null);
    try {
      const rows = await loadCertificatesPage({ revalidate });
      setCertificateRequests(rows);
    } catch (e: unknown) {
      setError(getErrorMessage(e) || "Something went wrong");
      if (certificateRequests.length === 0) setCertificateRequests([]);
    } finally {
      setLoading(false);
    }
  }, [certificateRequests.length]);

  useEffect(() => {
    fetchCertificateRequests();
  }, [fetchCertificateRequests]);

  const total = certificateRequests.length;
  const pending = certificateRequests.filter((t) => t.status === "PENDING").length;
  const approved = certificateRequests.filter((t) => t.status === "APPROVED").length;
  const rejected = certificateRequests.filter((t) => t.status === "REJECTED").length;

  return (
    <SaPage>
      <SaPageHeader
        eyebrow="Students"
        title="Certificate Requests"
        description="Manage and process student certificate applications."
      />

      <KpiGrid>
        <KpiCard label="Total Requests" value={total} icon={FileText} hint="All time" />
        <KpiCard label="Pending" value={pending} icon={Clock} tone="gold" hint="Awaiting a decision" />
        <KpiCard label="Approved" value={approved} icon={SquareCheck} tone="green" hint="Issued or ready" />
        <KpiCard label="Rejected" value={rejected} icon={CircleAlert} tone="red" hint="Declined" />
      </KpiGrid>

      <div className="w-full overflow-x-auto">
        <CertificatesTab
          certificateRequests={certificateRequests}
          loading={loading}
          error={error}
          onRefresh={() => fetchCertificateRequests(true)}
          onRequestPatch={(id, patch) => {
            const next = certificateRequests.map((request) =>
              request.id === id ? { ...request, ...patch } : request
            );
            setCertificateRequests(next);
            setCertificatesPageCache(next);
            patchCertificateRequest(id, patch);
          }}
        />
      </div>
    </SaPage>
  );
}
