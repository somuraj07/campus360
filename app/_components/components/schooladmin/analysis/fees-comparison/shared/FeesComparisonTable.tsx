import Spinner from "@/app/_components/components/common/Spinner";
import { formatInr, type ComparisonReport } from "./feesComparisonTypes";

export function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-fg-subtle">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-line bg-well px-3 py-2 text-sm text-fg scheme-dark"
      />
    </label>
  );
}

export function SummaryCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  const valueColor =
    tone === "positive" ? "text-primary" : tone === "negative" ? "text-rose-700 dark:text-rose-300" : "text-fg";
  return (
    <div className="rounded-xl border border-line bg-well px-3 py-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">{label}</p>
      <p className={`mt-1 text-lg font-bold ${valueColor}`}>{value}</p>
    </div>
  );
}

export function FeesComparisonTable({
  report,
  loading,
  hasRows,
}: {
  report: ComparisonReport | null;
  loading: boolean;
  hasRows: boolean;
}) {
  if (loading && !report) {
    return (
      <div className="flex min-h-[220px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="mb-3 grid gap-2 sm:grid-cols-3">
        <SummaryCard label="Range 1 total" value={formatInr(report?.totals.rangeAAmount ?? 0)} />
        <SummaryCard label="Range 2 total" value={formatInr(report?.totals.rangeBAmount ?? 0)} />
        <SummaryCard
          label="Difference"
          value={formatInr(report?.totals.difference ?? 0)}
          tone={(report?.totals.difference ?? 0) >= 0 ? "positive" : "negative"}
        />
      </div>

      <div className="-mx-1 overflow-x-auto pb-1 sm:mx-0">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[11px] font-bold uppercase tracking-wider text-fg-subtle">
              <th className="py-3 pr-3 font-medium">Type</th>
              <th className="px-2 py-3 font-medium">Head</th>
              <th className="px-2 py-3 text-right font-medium">Range 1</th>
              <th className="px-2 py-3 text-right font-medium">Range 2</th>
              <th className="px-2 py-3 text-right font-medium">Difference</th>
              <th className="py-3 pl-2 text-right font-medium">Count</th>
            </tr>
          </thead>
          <tbody className="text-fg">
            {!hasRows ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-fg-subtle">
                  No fee or petty cash data found for these ranges.
                </td>
              </tr>
            ) : (
              report?.rows.map((row) => (
                <tr key={row.key} className="border-b border-line-subtle last:border-0 hover:bg-elev-2">
                  <td className="py-3 pr-3 text-xs font-semibold uppercase tracking-wide text-fg-subtle">
                    {row.category === "PETTY_CASH" ? "Petty cash" : "Fees"}
                  </td>
                  <td className="px-2 py-3 font-semibold text-fg">{row.head}</td>
                  <td className="px-2 py-3 text-right tabular-nums text-sky-800 dark:text-sky-200">
                    {formatInr(row.rangeAAmount)}
                  </td>
                  <td className="px-2 py-3 text-right tabular-nums text-primary">
                    {formatInr(row.rangeBAmount)}
                  </td>
                  <td
                    className={`px-2 py-3 text-right tabular-nums font-semibold ${
                      row.difference >= 0 ? "text-primary" : "text-rose-700 dark:text-rose-300"
                    }`}
                  >
                    {formatInr(row.difference)}
                  </td>
                  <td className="py-3 pl-2 text-right tabular-nums text-fg-muted">
                    {row.rangeACount} / {row.rangeBCount}
                  </td>
                </tr>
              ))
            )}
            {hasRows && report ? (
              <tr className="border-t border-line-strong bg-elev-1 font-bold">
                <td className="py-3 pr-3 text-fg">Total</td>
                <td className="px-2 py-3 text-fg">All heads</td>
                <td className="px-2 py-3 text-right tabular-nums text-sky-800 dark:text-sky-200">
                  {formatInr(report.totals.rangeAAmount)}
                </td>
                <td className="px-2 py-3 text-right tabular-nums text-primary">
                  {formatInr(report.totals.rangeBAmount)}
                </td>
                <td
                  className={`px-2 py-3 text-right tabular-nums ${
                    report.totals.difference >= 0 ? "text-primary" : "text-rose-700 dark:text-rose-300"
                  }`}
                >
                  {formatInr(report.totals.difference)}
                </td>
                <td className="py-3 pl-2 text-right text-fg-subtle">-</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
