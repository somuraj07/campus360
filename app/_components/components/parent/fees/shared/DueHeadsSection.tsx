import { Receipt } from "lucide-react";
import { formatRupee, type DueHeadRow } from "./parentFeesHelpers";

function DueHeadCard({ row }: { row: DueHeadRow }) {
  return (
    <div className="rounded-xl border border-line bg-elev-1 p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-fg leading-snug">{row.label}</p>
        <span className={`shrink-0 text-[11px] px-2 py-0.5 rounded-full ${row.status.className}`}>
          {row.status.label}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-well px-2 py-2">
          <p className="text-[10px] uppercase tracking-wide text-fg-subtle">Total</p>
          <p className="text-sm font-semibold text-fg mt-0.5">{formatRupee(row.total)}</p>
        </div>
        <div className="rounded-lg bg-well px-2 py-2">
          <p className="text-[10px] uppercase tracking-wide text-fg-subtle">Paid</p>
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">{formatRupee(row.paid)}</p>
        </div>
        <div className="rounded-lg bg-well px-2 py-2">
          <p className="text-[10px] uppercase tracking-wide text-fg-subtle">Due</p>
          <p className="text-sm font-semibold text-primary mt-0.5">{formatRupee(row.due)}</p>
        </div>
      </div>
    </div>
  );
}

export function DueHeadsSection({ dueHeadRows, totalDue }: { dueHeadRows: DueHeadRow[]; totalDue: number }) {
  return (
    <section className="glass-card rounded-2xl p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
        <h3 className="text-base sm:text-lg font-semibold text-fg flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary shrink-0" />
          Fee dues by head
        </h3>
        <span className="text-xs sm:text-sm text-fg-muted">
          Total due: <span className="text-fg font-semibold">{formatRupee(totalDue)}</span>
        </span>
      </div>

      {dueHeadRows.length === 0 ? (
        <p className="text-sm text-fg-subtle py-6 text-center">No fee heads assigned yet.</p>
      ) : (
        <>
          {/* Mobile: cards */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {dueHeadRows.map((row) => (
              <DueHeadCard key={row.key} row={row} />
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block rounded-xl border border-line overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-elev-1 text-left text-xs uppercase tracking-wider text-fg-muted">
                  <th className="px-4 py-3 font-medium">Fee head</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                  <th className="px-4 py-3 font-medium text-right">Paid</th>
                  <th className="px-4 py-3 font-medium text-right">Due</th>
                  <th className="px-4 py-3 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-subtle">
                {dueHeadRows.map((row) => (
                  <tr key={row.key} className="bg-elev-1 hover:bg-elev-2 transition-colors">
                    <td className="px-4 py-3 text-fg">{row.label}</td>
                    <td className="px-4 py-3 text-right text-fg">{formatRupee(row.total)}</td>
                    <td className="px-4 py-3 text-right text-emerald-700 dark:text-emerald-400">{formatRupee(row.paid)}</td>
                    <td className="px-4 py-3 text-right text-fg font-medium">
                      {formatRupee(row.due)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block text-xs px-2.5 py-1 rounded-full ${row.status.className}`}
                      >
                        {row.status.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
