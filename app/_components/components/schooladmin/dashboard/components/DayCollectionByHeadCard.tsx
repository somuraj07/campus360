"use client";

import { useState } from "react";
import { CalendarDays, Download } from "lucide-react";
import { formatDdMmYyyyFromYmdInput } from "@/lib/fees/feeDayReportExcel";
import type { CollectionByHeadRow } from "@/lib/fees/feeDayReportExcel";
import { exportDayReportXlsx } from "@/lib/fees/exportDayReportXlsx";

type Props = {
  fromDate: string;
  toDate: string;
  onDateRangeChange: (range: { from: string; to: string }) => void;
  rows: CollectionByHeadRow[];
  formattedTotal: string;
  loading?: boolean;
};

/** Day-wise fee collection broken down by fee head (installments merged). */
export function DayCollectionByHeadCard({
  fromDate,
  toDate,
  onDateRangeChange,
  rows,
  formattedTotal,
  loading = false,
}: Props) {
  const [downloading, setDownloading] = useState(false);
  const fromLabel = formatDdMmYyyyFromYmdInput(fromDate);
  const toLabel = formatDdMmYyyyFromYmdInput(toDate);
  const dateLabel = fromDate === toDate ? fromLabel : `${fromLabel} - ${toLabel}`;

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const ok = await exportDayReportXlsx(fromDate, toDate);
      if (!ok) {
        alert("No fee transactions found for the selected date range.");
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to download day report.");
    } finally {
      setDownloading(false);
    }
  };

  const maxAmount = rows.reduce((m, r) => Math.max(m, r.amount || 0), 0);

  return (
    <section className={`overflow-hidden rounded-2xl border border-line bg-elev-1 transition-opacity ${loading ? "opacity-60" : ""}`}>
      <div className="flex flex-col gap-4 border-b border-line px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarDays size={16} />
          </span>
          <div>
            <h3 className="text-[15px] font-semibold text-fg">Day-wise Collection</h3>
            <p className="mt-0.5 text-xs text-fg-subtle">By fee head for {dateLabel}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex h-10 items-center gap-2 rounded-lg border border-line-strong bg-surface px-3 text-xs text-fg-subtle">
            From
            <input
              type="date"
              value={fromDate}
              onChange={(e) => onDateRangeChange({ from: e.target.value, to: toDate })}
              className="bg-transparent text-sm font-medium text-fg outline-none"
              aria-label="Select collection from date"
            />
          </label>
          <label className="inline-flex h-10 items-center gap-2 rounded-lg border border-line-strong bg-surface px-3 text-xs text-fg-subtle">
            To
            <input
              type="date"
              value={toDate}
              onChange={(e) => onDateRangeChange({ from: fromDate, to: e.target.value })}
              className="bg-transparent text-sm font-medium text-fg outline-none"
              aria-label="Select collection to date"
            />
          </label>
          <button
            type="button"
            onClick={() => void handleDownload()}
            disabled={downloading || loading}
            title="Download day report (Excel)"
            aria-label="Download day report Excel"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-line-strong bg-surface px-3 text-sm font-semibold text-fg transition hover:bg-elev-2 disabled:pointer-events-none disabled:opacity-40"
          >
            <Download size={15} />
            Excel
          </button>
          <div className="ml-1 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Total</p>
            <p className="text-lg font-semibold leading-tight text-fg tabular-nums">₹{formattedTotal}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-fg-subtle">Loading collection breakdown…</p>
      ) : rows.length === 0 ? (
        <p className="py-10 text-center text-sm text-fg-subtle">No collections recorded for this date.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-sm">
            <thead className="border-b border-line bg-well text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              <tr>
                <th className="px-5 py-3 text-left">Fee Head</th>
                <th className="hidden w-[40%] px-5 py-3 text-left sm:table-cell">Share</th>
                <th className="px-5 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-subtle">
              {rows.map((row) => {
                const amt = row.amount || 0;
                const pct = maxAmount > 0 ? Math.max(2, (amt / maxAmount) * 100) : 0;
                return (
                  <tr key={row.key} className="hover:bg-elev-2">
                    <td className="px-5 py-3 font-medium text-fg">{row.label}</td>
                    <td className="hidden px-5 py-3 sm:table-cell">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-elev-3">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-fg tabular-nums">₹{row.formattedAmount}</td>
                  </tr>
                );
              })}
              <tr className="bg-well">
                <td className="px-5 py-3 font-semibold text-fg">Total</td>
                <td className="hidden sm:table-cell" />
                <td className="px-5 py-3 text-right font-semibold text-fg tabular-nums">₹{formattedTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
