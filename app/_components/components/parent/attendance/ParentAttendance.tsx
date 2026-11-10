"use client";

import { Download, Loader2 } from "lucide-react";
import PageHeader from "../../common/PageHeader";
import { SaPage, SaPageHeader, Alert, btnClass } from "../../common/ui";
import ParentTimellyLoader from "../ParentTimellyLoader";
import AttendanceReportTemplate from "../../pdf/AttendanceReportTemplate";
import { useParentAttendanceState } from "./shared";
import { AttendanceStatCardsSection } from "./shared";
import { AttendanceCalendarSection } from "./shared";
import { SelectedDaySection } from "./shared";

export default function ParentAttendanceTab() {
  const {
    monthCursor,
    setMonthCursor,
    setSelectedDateKey,
    loading,
    error,
    loadAttendance,
    generatingPdf,
    handleDownloadReport,
    headerSubtitle,
    statCards,
    calendarCells,
    selectedDayStatus,
    selectedDayLabel,
    selectedDayRecords,
    mounted,
    reportRef,
    pdfReportData,
    reportData,
  } = useParentAttendanceState();

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1400px] space-y-6">
        <PageHeader eyebrow="Your child" title="Attendance" subtitle={headerSubtitle} />
        <ParentTimellyLoader preset="attendance" className="w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[1400px] space-y-6">
        <PageHeader eyebrow="Your child" title="Attendance" subtitle={headerSubtitle} />
        <Alert tone="error">
          <p className="font-semibold">Failed to load attendance</p>
          <p className="mt-1">{error}</p>
          <button type="button" onClick={loadAttendance} className={`${btnClass("secondary", "sm")} mt-3`}>
            Retry
          </button>
        </Alert>
      </div>
    );
  }

  return (
    <SaPage>
      <SaPageHeader
        eyebrow="Your child"
        title="Attendance"
        description={headerSubtitle}
        actions={
          !loading && !error && mounted ? (
            <button type="button" onClick={handleDownloadReport} disabled={generatingPdf} className={btnClass("secondary")}>
              {generatingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              Download Report
            </button>
          ) : null
        }
      />

      <AttendanceStatCardsSection statCards={statCards} />

      <AttendanceCalendarSection
        monthCursor={monthCursor}
        setMonthCursor={setMonthCursor}
        calendarCells={calendarCells}
        onSelectDate={setSelectedDateKey}
      />

      <SelectedDaySection
        selectedDayLabel={selectedDayLabel}
        selectedDayStatus={selectedDayStatus}
        selectedDayRecords={selectedDayRecords}
      />

      {mounted ? (
        <AttendanceReportTemplate ref={reportRef} data={pdfReportData ?? reportData} />
      ) : null}
    </SaPage>
  );
}
