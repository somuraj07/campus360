"use client";

import { useState, lazy, Suspense } from "react";
import { SaPage, SaPageHeader, Segmented, LoadingBlock } from "../../common/ui";
import { ClipboardList, Download } from "lucide-react";

const TeacherReportCard = lazy(() => import("../../teacher/marks/ReportCard"));
const SchoolAdminDownloadReports = lazy(() => import("./DownloadReports"));
const DownloadClassPdf = lazy(() => import("./DownloadClassPdf"));

export default function SchoolAdminMarksTab() {
  const [subTab, setSubTab] = useState<"report-card" | "download">("download");

  return (
    <SaPage>
      <SaPageHeader
        eyebrow="Academics"
        title={subTab === "report-card" ? "Report Card" : "Download Reports"}
        description={
          subTab === "report-card"
            ? "View student report cards and download class PDFs (2 students per A4)"
            : "Download consolidated marks for all classes or selected sections as Excel or PDF"
        }
        actions={
          <Segmented
            value={subTab}
            onChange={setSubTab}
            options={[
              {
                value: "download",
                label: (
                  <span className="inline-flex items-center gap-1.5">
                    <Download size={14} /> Download Reports
                  </span>
                ),
              },
              {
                value: "report-card",
                label: (
                  <span className="inline-flex items-center gap-1.5">
                    <ClipboardList size={14} /> Report Card
                  </span>
                ),
              },
            ]}
          />
        }
      />

      <Suspense fallback={<LoadingBlock />}>
        {subTab === "report-card" ? (
          <div className="space-y-6">
            <DownloadClassPdf />
            <TeacherReportCard scope="school" />
          </div>
        ) : (
          <SchoolAdminDownloadReports />
        )}
      </Suspense>
    </SaPage>
  );
}
