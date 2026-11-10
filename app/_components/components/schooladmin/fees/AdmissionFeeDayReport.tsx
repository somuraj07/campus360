"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, FileSpreadsheet, FileText } from "lucide-react";
import { defaultDateRange, type GroupMode, type ReportPayload } from "./shared";
import { exportAdmissionFeeReportExcel } from "./shared";
import { exportAdmissionFeeReportPdf } from "./shared";
import { fetchAdmissionFeeReport } from "@/lib/api/admissionFeeReport";

export default function AdmissionFeeDayReport() {
  const [{ from, to }, setRange] = useState(defaultDateRange);
  const [groupMode, setGroupMode] = useState<GroupMode>("day");
  const [data, setData] = useState<ReportPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { ok, data: body } = await fetchAdmissionFeeReport(from, to);
      if (!ok) throw new Error(typeof body.message === "string" ? body.message : "Failed to load report");
      setData(body as ReportPayload);
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : "Failed to load report");
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    void load();
  }, [load]);

  const buckets = useMemo(() => {
    if (!data) return [];
    return groupMode === "day" ? data.byDay : data.byMonth;
  }, [data, groupMode]);

  const channelTotals = data?.totalsByChannel;

  const exportExcel = () => {
    if (!data) return;
    exportAdmissionFeeReportExcel(data, groupMode, buckets);
  };

  const exportPdf = async () => {
    if (!data) return;
    await exportAdmissionFeeReportPdf(data, groupMode, buckets);
  };

  return (
    <section className="rounded-2xl border border-line bg-elev-1 p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-fg">Admission fee day report</h3>
          <p className="mt-1 text-sm text-fg-muted">
            Paid admission fees recorded on applications (by paid date). Use date-wise or month-wise totals, then
            export to Excel or PDF.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!data || loading}
            onClick={exportExcel}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface px-4 text-sm font-semibold text-fg transition-colors hover:bg-elev-2 disabled:cursor-not-allowed disabled:opacity-55"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </button>
          <button
            type="button"
            disabled={!data || loading}
            onClick={() => void exportPdf()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface px-4 text-sm font-semibold text-fg transition-colors hover:bg-elev-2 disabled:cursor-not-allowed disabled:opacity-55"
          >
            <FileText className="h-4 w-4" />
            PDF
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-fg-muted">From</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
              className="h-10 rounded-lg border px-3 border-line-strong bg-surface text-sm text-fg placeholder:text-fg-faint transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-fg-muted">To</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
              className="h-10 rounded-lg border px-3 border-line-strong bg-surface text-sm text-fg placeholder:text-fg-faint transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface px-4 text-sm font-semibold text-fg transition-colors hover:bg-elev-2 disabled:cursor-not-allowed disabled:opacity-55"
          >
            <CalendarDays className="h-4 w-4" />
            {loading ? "Loading…" : "Apply range"}
          </button>
        </div>
        <div className="flex rounded-xl border border-line p-1">
          <button
            type="button"
            onClick={() => setGroupMode("day")}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
              groupMode === "day" ? "bg-primary/25 text-primary" : "text-fg-muted hover:text-fg"
            }`}
          >
            Date-wise
          </button>
          <button
            type="button"
            onClick={() => setGroupMode("month")}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
              groupMode === "month" ? "bg-primary/25 text-primary" : "text-fg-muted hover:text-fg"
            }`}
          >
            Month-wise
          </button>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-800 dark:text-red-200">{error}</div>
      ) : null}

      {data && !loading ? (
        <div
          className={`mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 ${
            channelTotals?.cash && channelTotals?.online ? "lg:grid-cols-4" : "lg:grid-cols-3"
          }`}
        >
          <div className="rounded-xl border border-line bg-well px-4 py-3">
            <p className="text-xs text-fg-muted">Applications (paid in range)</p>
            <p className="text-xl font-bold text-fg">{data.totals.count}</p>
          </div>
          <div className="rounded-xl border border-line bg-well px-4 py-3">
            <p className="text-xs text-fg-muted">Total admission fee collected</p>
            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">₹{data.totals.amount.toLocaleString("en-IN")}</p>
          </div>
          {channelTotals?.cash ? (
            <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3">
              <p className="text-xs text-amber-800 dark:text-amber-200">Cash collected</p>
              <p className="text-xl font-bold text-amber-800 dark:text-amber-100">
                ₹{channelTotals.cash.amount.toLocaleString("en-IN")}
              </p>
              <p className="mt-0.5 text-xs text-amber-800 dark:text-amber-200">{channelTotals.cash.count} application(s)</p>
            </div>
          ) : null}
          {channelTotals?.online ? (
            <div className="rounded-xl border border-sky-500/25 bg-sky-500/10 px-4 py-3">
              <p className="text-xs text-sky-800 dark:text-sky-200">Online collected</p>
              <p className="text-xl font-bold text-sky-800 dark:text-sky-100">
                ₹{channelTotals.online.amount.toLocaleString("en-IN")}
              </p>
              <p className="mt-0.5 text-xs text-sky-800 dark:text-sky-200">{channelTotals.online.count} application(s)</p>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-fg-muted">
              <th className="px-3 py-3 font-medium">{groupMode === "day" ? "Date" : "Month"}</th>
              <th className="px-3 py-3 font-medium text-right">Applications</th>
              <th className="px-3 py-3 font-medium text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-3 py-8 text-center text-fg-muted">
                  Loading…
                </td>
              </tr>
            ) : buckets.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-3 py-8 text-center text-fg-muted">
                  No paid admission fees in this range.
                </td>
              </tr>
            ) : (
              buckets.map((b) => (
                <tr key={b.period} className="border-b border-line-subtle last:border-0 hover:bg-elev-2">
                  <td className="px-3 py-2.5 font-mono text-fg">{b.period}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-fg">{b.count}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-emerald-700 dark:text-emerald-300">
                    ₹{b.amount.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.applications.length > 0 ? (
        <div className="mt-6">
          <h4 className="mb-2 text-sm font-semibold text-fg">Application detail (paid in range)</h4>
          <div className="max-h-72 overflow-auto rounded-xl border border-line">
            <table className="w-full min-w-[640px] text-left text-xs sm:text-sm">
              <thead className="sticky top-0 bg-surface ">
                <tr className="border-b border-line text-[11px] uppercase tracking-wide text-fg-muted">
                  <th className="px-2 py-2 font-medium">App. no.</th>
                  <th className="px-2 py-2 font-medium">Applicant</th>
                  <th className="px-2 py-2 font-medium">Class / grade</th>
                  <th className="px-2 py-2 font-medium text-right">Fee</th>
                  <th className="px-2 py-2 font-medium">Paid on</th>
                  <th className="px-2 py-2 font-medium">Mode</th>
                </tr>
              </thead>
              <tbody>
                {data.applications.map((a) => (
                  <tr key={`${a.applicationNo}-${a.paidAtIso}`} className="border-b border-line-subtle hover:bg-elev-2">
                    <td className="px-2 py-2 font-mono text-fg">{a.applicationNo}</td>
                    <td className="px-2 py-2 text-fg">{a.applicantName}</td>
                    <td className="px-2 py-2 text-fg-muted">{a.classOrGrade}</td>
                    <td className="px-2 py-2 text-right font-semibold text-emerald-700 dark:text-emerald-300">
                      ₹{a.admissionFee.toLocaleString("en-IN")}
                    </td>
                    <td className="px-2 py-2 text-fg-muted">{new Date(a.paidAtIso).toLocaleString("en-IN")}</td>
                    <td className="px-2 py-2 text-fg-muted">{a.paymentMode || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  );
}
