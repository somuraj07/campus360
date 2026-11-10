import { IndianRupee, Download } from "lucide-react";
import SelectInput from "../../../common/SelectInput";
import TimellyLoader from "../../../common/TimellyLoader";
import type { FeeCollectionRow } from "./types";

export function FeeCollectionSection({
  tablesLoading,
  feeSearch,
  onFeeSearchChange,
  feeClassSectionFilter,
  onFeeClassSectionFilterChange,
  feeClassSectionOptions,
  onExport,
  feeRowsFiltered,
  formatInr,
  feeFilteredTotals,
  feeFilteredAvgDiscountPercent,
  feeFilteredCollectionPercent,
  feeFilteredDuePercent,
}: {
  tablesLoading: boolean;
  feeSearch: string;
  onFeeSearchChange: (v: string) => void;
  feeClassSectionFilter: string;
  onFeeClassSectionFilterChange: (v: string) => void;
  feeClassSectionOptions: string[];
  onExport: () => void;
  feeRowsFiltered: FeeCollectionRow[];
  formatInr: (n: number) => string;
  feeFilteredTotals: { totalFees: number; finalFees: number; paidFee: number; pendingFee: number } | null;
  feeFilteredAvgDiscountPercent: number;
  feeFilteredCollectionPercent: number;
  feeFilteredDuePercent: number;
}) {
  if (tablesLoading) {
    return (
      <div className="mt-4 flex min-h-[240px] items-center justify-center rounded-xl border border-line bg-elev-1">
        <TimellyLoader
          title="Loading fee collection"
          steps={["Fees", "Payments", "Pending"]}
          compact
          bare
        />
      </div>
    );
  }

  return (
    <div className="mt-0 sm:mt-0 rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-elev-2 border border-line">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
            <h3 className="font-semibold text-fg text-sm sm:text-base">
              Fee collection (class & section)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-fg-subtle mt-1 pl-0 sm:pl-7">
            From student fee records for each class / section.
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          <input
            type="text"
            value={feeSearch}
            onChange={(e) => onFeeSearchChange(e.target.value)}
            placeholder="Search class / section"
            className="w-full rounded-xl border border-line bg-well px-3 py-2 text-xs text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-1 focus:ring-primary/40 sm:w-[180px] sm:text-sm"
          />
          <div className="w-full sm:w-[180px]">
            <SelectInput
              value={feeClassSectionFilter}
              onChange={onFeeClassSectionFilterChange}
              options={[
                { label: "All class / section", value: "" },
                ...feeClassSectionOptions.map((label) => ({ label, value: label })),
              ]}
            />
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
      </div>

      <div className="-mx-1 overflow-x-auto overscroll-x-contain touch-pan-x pb-1 sm:mx-0">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-fg-muted">
              <th className="py-3 pr-3 font-medium">Class / section</th>
              <th className="py-3 px-2 text-right font-medium whitespace-nowrap">Total fees</th>
              <th className="py-3 px-2 text-right font-medium whitespace-nowrap">Avg discount %</th>
              <th className="py-3 px-2 text-right font-medium whitespace-nowrap">Final fees</th>
              <th className="py-3 px-2 text-right font-medium whitespace-nowrap">Paid</th>
              <th className="py-3 px-2 text-right font-medium whitespace-nowrap">Pending</th>
              <th className="py-3 px-2 text-right font-medium whitespace-nowrap">Collection %</th>
              <th className="py-3 pl-2 text-right font-medium whitespace-nowrap">Due %</th>
            </tr>
          </thead>
          <tbody className="text-fg">
            {feeRowsFiltered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-fg-subtle">
                  No matching class / section found.
                </td>
              </tr>
            ) : (
              feeRowsFiltered.map((row) => (
                <tr
                  key={row.classId}
                  className="border-b border-line-subtle last:border-0 hover:bg-elev-2"
                >
                  <td className="py-3 pr-3 font-semibold text-fg">{row.label}</td>
                  <td className="py-3 px-2 text-right tabular-nums text-fg-muted">
                    {formatInr(row.totalFees)}
                  </td>
                  <td className="py-3 px-2 text-right tabular-nums text-cyan-700 dark:text-cyan-300">
                    {row.avgDiscountPercent.toLocaleString("en-IN")}%
                  </td>
                  <td className="py-3 px-2 text-right tabular-nums text-amber-800 dark:text-amber-200">
                    {formatInr(row.finalFees)}
                  </td>
                  <td className="py-3 px-2 text-right tabular-nums text-primary">
                    {formatInr(row.paidFee)}
                  </td>
                  <td className="py-3 px-2 text-right tabular-nums text-rose-700 dark:text-rose-300">
                    {formatInr(row.pendingFee)}
                  </td>
                  <td className="py-3 px-2 text-right tabular-nums text-primary">
                    {row.collectionPercent.toLocaleString("en-IN")}%
                  </td>
                  <td className="py-3 pl-2 text-right tabular-nums text-amber-700 dark:text-amber-300">
                    {row.duePercent.toLocaleString("en-IN")}%
                  </td>
                </tr>
              ))
            )}
            {feeFilteredTotals && feeRowsFiltered.length > 0 ? (
              <tr className="border-t border-line-strong bg-elev-1 font-semibold">
                <td className="py-3 pr-3 text-fg">Filtered total</td>
                <td className="py-3 px-2 text-right tabular-nums">{formatInr(feeFilteredTotals.totalFees)}</td>
                <td className="py-3 px-2 text-right tabular-nums text-cyan-700 dark:text-cyan-300">
                  {feeFilteredAvgDiscountPercent.toLocaleString("en-IN")}%
                </td>
                <td className="py-3 px-2 text-right tabular-nums">{formatInr(feeFilteredTotals.finalFees)}</td>
                <td className="py-3 px-2 text-right tabular-nums text-primary">
                  {formatInr(feeFilteredTotals.paidFee)}
                </td>
                <td className="py-3 px-2 text-right tabular-nums text-rose-700 dark:text-rose-300">
                  {formatInr(feeFilteredTotals.pendingFee)}
                </td>
                <td className="py-3 px-2 text-right tabular-nums text-primary">
                  {feeFilteredCollectionPercent.toLocaleString("en-IN")}%
                </td>
                <td className="py-3 pl-2 text-right tabular-nums text-amber-700 dark:text-amber-300">
                  {feeFilteredDuePercent.toLocaleString("en-IN")}%
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
