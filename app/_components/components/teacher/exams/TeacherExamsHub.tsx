"use client";

import { useState, lazy, Suspense } from "react";
import { BookOpen, ClipboardList, Download } from "lucide-react";
import ExamsPage from "../../schooladmin/exams/exams";
import { SaPage, SaPageHeader, Segmented, LoadingBlock } from "../../common/ui";

const TeacherReportCard = lazy(() => import("../marks/ReportCard"));
const SchoolAdminDownloadReports = lazy(
  () => import("../../schooladmin/marks/DownloadReports")
);
const DownloadClassPdf = lazy(
  () => import("../../schooladmin/marks/DownloadClassPdf")
);

type SubTab = "exams" | "report-card" | "download";

const TABS: Array<{ id: SubTab; label: string; short: string; icon: typeof BookOpen }> = [
  { id: "exams", label: "Exams & Syllabus", short: "Exams", icon: BookOpen },
  { id: "report-card", label: "Report Card", short: "Reports", icon: ClipboardList },
  { id: "download", label: "Download Reports", short: "Download", icon: Download },
];

export default function TeacherExamsHub() {
  const [subTab, setSubTab] = useState<SubTab>("exams");

  const tabs = (
    <Segmented
      className="max-w-full overflow-x-auto"
      value={subTab}
      onChange={setSubTab}
      options={TABS.map(({ id, label, icon: Icon }) => ({
        value: id,
        label: (
          <span className="inline-flex items-center gap-1.5">
            <Icon size={14} /> {label}
          </span>
        ),
      }))}
    />
  );

  if (subTab === "exams") {
    return (
      <div className="space-y-5">
        <div className="mx-auto w-full max-w-[1400px]">{tabs}</div>
        <ExamsPage />
      </div>
    );
  }

  return (
    <SaPage>
      <SaPageHeader
        eyebrow="Academics"
        title={subTab === "report-card" ? "Report Card" : "Download Reports"}
        description={
          subTab === "report-card"
            ? "View student report cards and download class PDFs"
            : "Download marks reports for classes as Excel or PDF"
        }
        actions={tabs}
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
