import { Users, Download } from "lucide-react";
import TimellyLoader from "../../../common/TimellyLoader";

type AdmissionComparisonRow = {
  classLabel: string;
  existingDayScholarMale: number;
  existingDayScholarFemale: number;
  existingHostelMale: number;
  existingHostelFemale: number;
  newDayScholarMale: number;
  newDayScholarFemale: number;
  newHostelMale: number;
  newHostelFemale: number;
};

export function AdmissionComparisonSection({
  tablesLoading,
  onExport,
  admissionComparisonRows,
  admissionComparisonTotals,
}: {
  tablesLoading: boolean;
  onExport: () => void;
  admissionComparisonRows: AdmissionComparisonRow[];
  admissionComparisonTotals: Omit<AdmissionComparisonRow, "classLabel"> | null | undefined;
}) {
  if (tablesLoading) {
    return (
      <div className="mt-4 flex min-h-[240px] items-center justify-center rounded-xl border border-line bg-elev-1">
        <TimellyLoader
          title="Loading admissions"
          steps={["Applications", "Hostel data", "Comparison"]}
          compact
          bare
        />
      </div>
    );
  }

  return (
    <div className="mt-0 sm:mt-0 rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-elev-2 border border-line">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-700 dark:text-cyan-300 shrink-0" />
            <h3 className="font-semibold text-fg text-sm sm:text-base">
              New admission comparison report
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-fg-subtle mt-1 pl-0 sm:pl-7">
            Existing vs new admissions by class, day scholar/hostel, and male/female.
          </p>
        </div>
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/15 px-3 py-2 text-xs sm:text-sm font-semibold text-primary hover:bg-primary/25 transition-colors"
        >
          <Download className="h-4 w-4" />
          Export to Excel
        </button>
      </div>

      <div className="-mx-1 overflow-x-auto overscroll-x-contain touch-pan-x pb-1 sm:mx-0">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-fg-muted">
              <th rowSpan={3} className="py-3 pr-3 font-medium align-bottom">Class</th>
              <th colSpan={4} className="py-3 px-2 text-center font-medium">Existing</th>
              <th colSpan={4} className="py-3 px-2 text-center font-medium">New</th>
            </tr>
            <tr className="border-b border-line text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-fg-muted">
              <th colSpan={2} className="py-2 px-2 text-center font-medium">Day Scholar</th>
              <th colSpan={2} className="py-2 px-2 text-center font-medium">Hostel</th>
              <th colSpan={2} className="py-2 px-2 text-center font-medium">Day Scholar</th>
              <th colSpan={2} className="py-2 px-2 text-center font-medium">Hostel</th>
            </tr>
            <tr className="border-b border-line text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-fg-muted">
              <th className="py-2 px-2 text-right font-medium">Male</th>
              <th className="py-2 px-2 text-right font-medium">Female</th>
              <th className="py-2 px-2 text-right font-medium">Male</th>
              <th className="py-2 px-2 text-right font-medium">Female</th>
              <th className="py-2 px-2 text-right font-medium">Male</th>
              <th className="py-2 px-2 text-right font-medium">Female</th>
              <th className="py-2 px-2 text-right font-medium">Male</th>
              <th className="py-2 pl-2 text-right font-medium">Female</th>
            </tr>
          </thead>
          <tbody className="text-fg">
            {admissionComparisonRows.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-fg-subtle">
                  No admission comparison data found.
                </td>
              </tr>
            ) : (
              admissionComparisonRows.map((row) => (
                <tr
                  key={row.classLabel}
                  className="border-b border-line-subtle last:border-0 hover:bg-elev-2"
                >
                  <td className="py-3 pr-3 font-semibold text-fg">{row.classLabel}</td>
                  <td className="py-3 px-2 text-right tabular-nums text-sky-700 dark:text-sky-300">{row.existingDayScholarMale}</td>
                  <td className="py-3 px-2 text-right tabular-nums text-fuchsia-700 dark:text-fuchsia-300">{row.existingDayScholarFemale}</td>
                  <td className="py-3 px-2 text-right tabular-nums text-sky-700 dark:text-sky-300">{row.existingHostelMale}</td>
                  <td className="py-3 px-2 text-right tabular-nums text-fuchsia-700 dark:text-fuchsia-300">{row.existingHostelFemale}</td>
                  <td className="py-3 px-2 text-right tabular-nums text-cyan-700 dark:text-cyan-300">{row.newDayScholarMale}</td>
                  <td className="py-3 px-2 text-right tabular-nums text-rose-700 dark:text-rose-300">{row.newDayScholarFemale}</td>
                  <td className="py-3 px-2 text-right tabular-nums text-cyan-700 dark:text-cyan-300">{row.newHostelMale}</td>
                  <td className="py-3 pl-2 text-right tabular-nums text-rose-700 dark:text-rose-300">{row.newHostelFemale}</td>
                </tr>
              ))
            )}
            {admissionComparisonTotals ? (
              <tr className="border-t border-line-strong bg-elev-1 font-semibold">
                <td className="py-3 pr-3 text-fg">Total</td>
                <td className="py-3 px-2 text-right tabular-nums text-sky-700 dark:text-sky-300">{admissionComparisonTotals.existingDayScholarMale}</td>
                <td className="py-3 px-2 text-right tabular-nums text-fuchsia-700 dark:text-fuchsia-300">{admissionComparisonTotals.existingDayScholarFemale}</td>
                <td className="py-3 px-2 text-right tabular-nums text-sky-700 dark:text-sky-300">{admissionComparisonTotals.existingHostelMale}</td>
                <td className="py-3 px-2 text-right tabular-nums text-fuchsia-700 dark:text-fuchsia-300">{admissionComparisonTotals.existingHostelFemale}</td>
                <td className="py-3 px-2 text-right tabular-nums text-cyan-700 dark:text-cyan-300">{admissionComparisonTotals.newDayScholarMale}</td>
                <td className="py-3 px-2 text-right tabular-nums text-rose-700 dark:text-rose-300">{admissionComparisonTotals.newDayScholarFemale}</td>
                <td className="py-3 px-2 text-right tabular-nums text-cyan-700 dark:text-cyan-300">{admissionComparisonTotals.newHostelMale}</td>
                <td className="py-3 pl-2 text-right tabular-nums text-rose-700 dark:text-rose-300">{admissionComparisonTotals.newHostelFemale}</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
