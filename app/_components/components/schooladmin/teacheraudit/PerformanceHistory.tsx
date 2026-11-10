"use client";

import { History, Zap } from "lucide-react";
import type { AuditRecord } from "./types";
import { categoryToLabel } from "./types";

interface PerformanceHistoryProps {
  records: AuditRecord[];
}

export default function PerformanceHistory({ records }: PerformanceHistoryProps) {
  return (
    <div className="space-y-4">

      {/* HEADER BAR */}
      <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-fg">
        <History className="w-4 h-4 text-fg-muted" />
        PERFORMANCE HISTORY
      </div>

      {/* EMPTY STATE */}
      {records.length === 0 ? (
        <div className="rounded-xl bg-elev-1 border border-line p-4 text-sm text-fg-muted">
          No records yet.
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between gap-4 rounded-xl bg-elev-1 border border-line px-4 py-3"
            >
              {/* LEFT CONTENT */}
              <div className="flex items-start gap-3 min-w-0">

                {/* ICON BUBBLE */}
                <div className="w-9 h-9 rounded-lg bg-elev-2 flex items-center justify-center flex-shrink-0">
                  <Zap
                    className={`w-4 h-4 ${
                      r.scoreImpact >= 0 ? "text-primary" : "text-red-700 dark:text-red-400"
                    }`}
                  />
                </div>

                {/* TEXT */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-fg">
                      {categoryToLabel(r.category, r.customCategory)}
                    </span>
                    <span className="text-xs text-fg-subtle">
                      {new Date(r.createdAt).toLocaleDateString("en-CA")}
                    </span>
                  </div>

                  <p className="text-sm text-fg-muted mt-1 truncate">
                    {r.description}
                  </p>
                </div>
              </div>

              {/* SCORE IMPACT */}
              <span
                className={`text-sm font-semibold flex-shrink-0 ${
                  r.scoreImpact >= 0 ? "text-primary" : "text-red-700 dark:text-red-400"
                }`}
              >
                {r.scoreImpact >= 0 ? `+${r.scoreImpact}` : r.scoreImpact}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
