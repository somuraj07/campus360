"use client";

import {
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
} from "lucide-react";
import MarksReportTemplate from "@/app/_components/components/pdf/MarksReportTemplate";
import { useTeacherDownloadReportsState } from "./shared";
import { TeacherClassAndExamPicker } from "./shared";

export default function TeacherDownloadReports() {
  const {
    classesLoading,
    selectedClassIds,
    examTypeOptions,
    selectedExamType,
    setSelectedExamType,
    classSearch,
    setClassSearch,
    downloading,
    downloadType,
    progress,
    pdfRef,
    pdfData,
    filteredClasses,
    toggleClass,
    selectAll,
    handleDownloadExcel,
    handleDownloadPdf,
    allVisibleSelected,
  } = useTeacherDownloadReportsState();

  return (
    <div className="space-y-6">
      <TeacherClassAndExamPicker
        selectedClassIds={selectedClassIds}
        allVisibleSelected={allVisibleSelected}
        onSelectAll={selectAll}
        classSearch={classSearch}
        onClassSearchChange={setClassSearch}
        classesLoading={classesLoading}
        filteredClasses={filteredClasses}
        onToggleClass={toggleClass}
        examTypeOptions={examTypeOptions}
        selectedExamType={selectedExamType}
        onSelectedExamTypeChange={setSelectedExamType}
      />

      {/* DOWNLOAD BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => void handleDownloadExcel()}
          disabled={downloading || selectedClassIds.size === 0}
          className={`rounded-2xl border p-6 flex items-center gap-4 transition group ${
            selectedClassIds.size === 0
              ? "border-line-subtle bg-elev-1 opacity-50 cursor-not-allowed"
              : downloading && downloadType === "excel"
                ? "border-primary/30 bg-primary/5"
                : "border-line bg-elev-1 hover:border-primary/20 hover:bg-elev-3 cursor-pointer"
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
            {downloading && downloadType === "excel" ? (
              <Loader2 size={22} className="text-emerald-700 dark:text-emerald-400 animate-spin" />
            ) : (
              <FileSpreadsheet size={22} className="text-emerald-700 dark:text-emerald-400" />
            )}
          </div>
          <div className="text-left min-w-0">
            <p className="font-semibold text-fg text-sm">Download Excel</p>
            <p className="text-xs text-fg-subtle mt-0.5">
              {downloading && downloadType === "excel"
                ? progress.label
                : "Marks sheet with all subjects, grades & ranks"}
            </p>
          </div>
        </button>

        <button
          onClick={() => void handleDownloadPdf()}
          disabled={downloading || selectedClassIds.size === 0}
          className={`rounded-2xl border p-6 flex items-center gap-4 transition group ${
            selectedClassIds.size === 0
              ? "border-line-subtle bg-elev-1 opacity-50 cursor-not-allowed"
              : downloading && downloadType === "pdf"
                ? "border-primary/30 bg-primary/5"
                : "border-line bg-elev-1 hover:border-primary/20 hover:bg-elev-3 cursor-pointer"
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            {downloading && downloadType === "pdf" ? (
              <Loader2 size={22} className="text-blue-700 dark:text-blue-400 animate-spin" />
            ) : (
              <FileText size={22} className="text-blue-700 dark:text-blue-400" />
            )}
          </div>
          <div className="text-left min-w-0">
            <p className="font-semibold text-fg text-sm">Download Report Cards (PDF)</p>
            <p className="text-xs text-fg-subtle mt-0.5">
              {downloading && downloadType === "pdf"
                ? progress.label
                : "Individual report cards for all students in one PDF"}
            </p>
          </div>
        </button>
      </div>

      {/* PROGRESS BAR */}
      {downloading && progress.total > 0 && (
        <div className="rounded-2xl border border-line bg-elev-1 p-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-fg-muted">
              Processing {progress.current} of {progress.total} students
            </span>
            <span className="text-primary font-medium">
              {Math.round((progress.current / progress.total) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-elev-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
          <p className="text-xs text-fg-faint mt-2 truncate">{progress.label}</p>
        </div>
      )}

      {selectedClassIds.size === 0 && (
        <div className="rounded-2xl border border-line bg-elev-1 p-8 text-center">
          <Download size={40} className="mx-auto text-fg-faint mb-3" />
          <p className="text-fg-subtle text-sm">Select one or more classes above to download reports</p>
        </div>
      )}

      {/* Hidden PDF mount */}
      <MarksReportTemplate ref={pdfRef} data={pdfData} />
    </div>
  );
}
