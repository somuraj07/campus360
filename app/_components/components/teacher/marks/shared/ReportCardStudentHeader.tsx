import { Download, Printer } from "lucide-react";
import type { ReportCardData } from "./reportCardTypes";

export function ReportCardStudentHeader({
  reportData,
  displaySchoolLogo,
  pdfLoading,
  onDownloadPdf,
  onPrint,
}: {
  reportData: ReportCardData;
  displaySchoolLogo: string | null;
  pdfLoading: boolean;
  onDownloadPdf: () => void;
  onPrint: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-primary/5 via-white/5 to-emerald-400/5 p-5">
      {displaySchoolLogo ? (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src={displaySchoolLogo}
            alt=""
            className="w-52 h-52 object-contain opacity-[0.05]"
          />
        </div>
      ) : null}
      <div className="relative z-10 flex items-center justify-between gap-3 mb-4 pb-3 border-b border-line">
        <div className="flex items-center gap-3 min-w-0">
          {displaySchoolLogo ? (
            <img
              src={displaySchoolLogo}
              alt={`${reportData.school.name} logo`}
              className="w-11 h-11 rounded-full object-cover border border-line shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-full border border-line text-[10px] font-semibold text-fg-muted grid place-items-center shrink-0">
              LOGO
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-fg truncate">
              {reportData.school.name || "School"}
            </p>
            <p className="text-[11px] text-fg-subtle truncate">
              {reportData.school.address || "-"}
            </p>
          </div>
        </div>
        <span className="text-[11px] uppercase tracking-wider text-fg-subtle">
          Academic Performance Report
        </span>
      </div>
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(reportData.student.name)}&size=56&background=4ade80&color=fff`}
            alt={reportData.student.name}
            className="w-14 h-14 rounded-full flex-shrink-0"
          />
          <div>
            <h2 className="text-lg font-bold text-fg">
              {reportData.student.name}
            </h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-subtle mt-0.5">
              <span>{reportData.student.class}</span>
              <span className="w-1 h-1 rounded-full bg-elev-3" />
              <span>{reportData.student.admissionNumber}</span>
              {reportData.student.rollNo && (
                <>
                  <span className="w-1 h-1 rounded-full bg-elev-3" />
                  <span>Roll: {reportData.student.rollNo}</span>
                </>
              )}
            </div>
            {reportData.student.fatherName && (
              <p className="text-xs text-fg-subtle mt-0.5">
                Father: {reportData.student.fatherName}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={onDownloadPdf}
            disabled={pdfLoading}
            className="px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-sm font-medium flex items-center gap-2 hover:bg-primary/20 transition disabled:opacity-50"
          >
            <Download size={14} />
            {pdfLoading ? "Generating…" : "Download PDF"}
          </button>
          <button
            onClick={onPrint}
            disabled={pdfLoading}
            className="px-4 py-2 rounded-xl bg-elev-1 text-fg-muted border border-line text-sm font-medium flex items-center gap-2 hover:bg-elev-3 transition disabled:opacity-50"
          >
            <Printer size={14} />
            Print
          </button>
        </div>
      </div>
    </div>
  );
}
