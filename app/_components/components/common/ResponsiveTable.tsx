"use client";

import { ReactNode } from "react";

interface ResponsiveTableProps {
  /** Table header cells (th) */
  headers: { key: string; label: string; className?: string; hideOnMobile?: boolean }[];
  /** Table body rows: array of cells per row, each cell is ReactNode */
  rows: ReactNode[][];
  /** Optional empty state message */
  emptyMessage?: string;
  /** Optional footer slot below table */
  footer?: ReactNode;
  /** Optional wrapper class for the scroll container */
  className?: string;
}

/**
 * Responsive table: horizontal scroll on small screens, aligned columns.
 * Use with consistent column count matching headers length.
 */
export default function ResponsiveTable({
  headers,
  rows,
  emptyMessage = "No data",
  footer,
  className = "",
}: ResponsiveTableProps) {
  const colCount = headers.length;

  return (
    <div className={`rounded-xl border border-line overflow-hidden bg-elev-1 ${className}`}>
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-line">
              {headers.map((h) => (
                <th
                  key={h.key}
                  className={`text-left px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold text-fg whitespace-nowrap ${h.hideOnMobile ? "hidden sm:table-cell" : ""} ${h.className ?? ""}`}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={colCount}
                  className="px-4 py-8 text-center text-sm text-fg-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-line hover:bg-elev-2 transition"
                >
                  {row.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      className={`px-3 sm:px-4 py-3 text-xs sm:text-sm text-fg ${headers[cellIdx]?.hideOnMobile ? "hidden sm:table-cell" : ""}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {footer && (
        <div className="px-3 sm:px-4 py-3 border-t border-line flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-fg-muted">
          {footer}
        </div>
      )}
    </div>
  );
}
