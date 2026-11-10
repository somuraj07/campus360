import { Search } from "lucide-react";
import type { Class, ExtraFee } from "../../types";
import { classLabel, existingMessAmountForClass } from "./hostelMessFeesUtils";
import { fieldClass, fieldLabelClass } from "../../../../common/ui";

const inputClass = fieldClass;

const inputCompact = `${fieldClass} text-right tabular-nums`;

const labelClass = fieldLabelClass;

export function HostelMessTableSection({
  classSearch,
  setClassSearch,
  fillAllValue,
  setFillAllValue,
  applyFillAllToTable,
  tableSaving,
  sortedClasses,
  filteredClasses,
  classAmounts,
  setClassAmounts,
  classesWithDuplicate,
  extraFees,
  classHeadName,
}: {
  classSearch: string;
  setClassSearch: (v: string) => void;
  fillAllValue: string;
  setFillAllValue: (v: string) => void;
  applyFillAllToTable: () => void;
  tableSaving: boolean;
  sortedClasses: Class[];
  filteredClasses: Class[];
  classAmounts: Record<string, string>;
  setClassAmounts: (updater: (prev: Record<string, string>) => Record<string, string>) => void;
  classesWithDuplicate: Set<string>;
  extraFees: ExtraFee[];
  classHeadName: string;
}) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <div className="relative">
          <label className={labelClass} htmlFor="class-search">
            Search class
          </label>
          <Search className="pointer-events-none absolute left-3 top-[34px] h-4 w-4 text-fg-subtle" />
          <input
            id="class-search"
            type="search"
            value={classSearch}
            onChange={(e) => setClassSearch(e.target.value)}
            className={`${inputClass} pl-9`}
            placeholder="Filter by class name…"
            disabled={tableSaving}
          />
        </div>
        <div className="sm:min-w-[140px]">
          <label className={labelClass} htmlFor="fill-all-mess">
            Fill all rows (₹)
          </label>
          <input
            id="fill-all-mess"
            type="number"
            value={fillAllValue}
            onChange={(e) => setFillAllValue(e.target.value)}
            className={inputClass}
            placeholder="28600"
            disabled={tableSaving}
          />
        </div>
        <button
          type="button"
          onClick={applyFillAllToTable}
          disabled={tableSaving || sortedClasses.length === 0}
          className="min-h-[42px] rounded-xl border border-line bg-elev-2 px-4 text-sm font-semibold text-fg hover:bg-elev-3 disabled:opacity-50"
        >
          Apply to all
        </button>
      </div>

      {sortedClasses.length === 0 ? (
        <p className="py-8 text-center text-sm text-fg-subtle">No classes found.</p>
      ) : filteredClasses.length === 0 ? (
        <p className="py-8 text-center text-sm text-fg-subtle">No classes match your search.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-line">
          <div className="max-h-[min(32rem,55vh)] overflow-auto">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <thead className="sticky top-0 z-10 bg-well text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">#</th>
                  <th className="px-4 py-3 text-left font-semibold">Class</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">In DB (₹)</th>
                  <th className="px-4 py-3 text-right font-semibold min-w-[9rem]">New total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.map((c, idx) => {
                  const saved = existingMessAmountForClass(extraFees, classHeadName, c.id);
                  const draft = classAmounts[c.id] ?? "";
                  const draftNum = Number(draft);
                  const changed =
                    draft.trim() !== "" &&
                    Number.isFinite(draftNum) &&
                    draftNum > 0 &&
                    Math.abs(draftNum - saved) > 0.02;
                  const hasDup = classesWithDuplicate.has(c.id);
                  const rowTone = hasDup
                    ? "bg-amber-500/[0.06]"
                    : changed
                      ? "bg-sky-500/[0.06]"
                      : idx % 2 === 0
                        ? "bg-elev-1"
                        : "";

                  let status = "Not set";
                  let statusClass = "text-fg-subtle bg-elev-1 border-line";
                  if (hasDup) {
                    status = "Duplicate";
                    statusClass = "text-amber-800 dark:text-amber-200 bg-amber-500/15 border-amber-500/30";
                  } else if (changed) {
                    status = "Changed";
                    statusClass = "text-sky-800 dark:text-sky-200 bg-sky-500/15 border-sky-500/30";
                  } else if (saved > 0) {
                    status = "Saved";
                    statusClass = "text-primary bg-primary/10 border-primary/25";
                  }

                  return (
                    <tr key={c.id} className={`border-t border-line-subtle ${rowTone}`}>
                      <td className="px-4 py-2.5 text-fg-subtle tabular-nums">{idx + 1}</td>
                      <td className="px-4 py-2.5 font-medium text-fg">{classLabel(c)}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusClass}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-fg-muted">
                        {saved > 0 ? saved.toLocaleString("en-IN") : "—"}
                      </td>
                      <td className="px-4 py-2.5">
                        <input
                          type="number"
                          value={draft}
                          onChange={(e) =>
                            setClassAmounts((prev) => ({ ...prev, [c.id]: e.target.value }))
                          }
                          className={inputCompact}
                          placeholder="Enter amount"
                          disabled={tableSaving}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
