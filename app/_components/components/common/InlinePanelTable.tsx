"use client";

import { Fragment, ReactNode } from "react";
import { Column } from "../../types/superadmin";

type InlinePanelTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  emptyText?: string;
  rowKey?: (row: T, index: number) => string | number;
  activeRowId?: string | number | null;
  panelKey?: string | null;
  renderPanel?: (row: T) => ReactNode;
};

const ALIGN_CLASS = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export default function InlinePanelTable<T>({
  columns,
  data,
  emptyText = "No data found",
  rowKey,
  activeRowId,
  panelKey,
  renderPanel,
}: InlinePanelTableProps<T>) {
  const getKey = (row: T, index: number) => {
    if (rowKey) return rowKey(row, index);
    const id = (row as { id?: string | number })?.id;
    if (id) return id;
    return `row-${index}`;
  };

  return (
    <table className="w-full border-separate border-spacing-0 text-sm">
      <thead className="bg-well">
        <tr>
          {columns.map((col, i) => (
            <th
              key={i}
              scope="col"
              className={`border-b border-line px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle ${ALIGN_CLASS[col.align ?? "left"]}`}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 && (
          <tr>
            <td colSpan={columns.length} className="px-5 py-14 text-center text-sm text-fg-subtle">
              {emptyText}
            </td>
          </tr>
        )}
        {data.map((row, rowIndex) => {
          const key = getKey(row, rowIndex);
          const showPanel = renderPanel && activeRowId != null && key === activeRowId;
          return (
            <Fragment key={key}>
              <tr className={`transition-colors ${showPanel ? "bg-primary/[0.04]" : "hover:bg-elev-2"}`}>
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`whitespace-nowrap border-b border-line-subtle px-5 py-3.5 ${ALIGN_CLASS[col.align ?? "left"]}`}
                  >
                    {col.render ? col.render(row, rowIndex) : null}
                  </td>
                ))}
              </tr>

              {showPanel && (
                <tr key={`${key}-${panelKey ?? "panel"}`}>
                  <td colSpan={columns.length} className="border-b border-line bg-well p-0">
                    {renderPanel?.(row)}
                  </td>
                </tr>
              )}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
