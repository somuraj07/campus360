"use client";

import { ReactNode, memo } from "react";
import { Column } from "../../types/superadmin";
import Spinner from "./Spinner";
import ParentTimellyLoader from "../parent/ParentTimellyLoader";

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  /** Use RS Solutions branded loader inside the table body instead of spinner. */
  timellyLoader?: boolean;
  emptyText?: string;
  rowKey?: (row: T, index: number) => string | number;
  caption?: string;
  tableTitle?: string;
  tableSubtitle?: string;
  headerRight?: ReactNode;
  showMobile?: boolean;
  container?: boolean;
  rounded?: boolean;
  containerClassName?: string;
  tableClassName?: string;
  theadClassName?: string;
  thClassName?: string;
  tbodyClassName?: string;
  rowClassName?: string;
  tdClassName?: string;
  pagination?: {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
  };
  /** Columns size to content; outer area scrolls horizontally (avoids cramped fixed columns). */
  scrollableWide?: boolean;
  /** Pin the first column while scrolling horizontally (pair with scrollableWide). */
  stickyFirstColumn?: boolean;
  /** How many leading columns stay pinned. Defaults to 1 when stickyFirstColumn is set. */
  stickyLeadingCount?: number;
  /** Pin the last column while scrolling horizontally (e.g. actions on the right). */
  stickyLastColumn?: boolean;
  /** Extra classes on the scroll viewport (e.g. max-h + overflow-auto for in-table vertical scroll). */
  scrollAreaClassName?: string;
  /** Tighter footer row inside the same card (no extra bordered box). */
  paginationInline?: boolean;
};

function stickyColumnClass(
  index: number,
  lastIndex: number,
  opts: {
    scrollableWide: boolean;
    stickyFirstColumn: boolean;
    stickyLeadingCount: number;
    stickyLastColumn: boolean;
    header?: boolean;
  }
): string {
  const { scrollableWide, stickyFirstColumn, stickyLeadingCount, stickyLastColumn, header } = opts;
  if (!scrollableWide) return "";
  const z = header ? "z-20" : "z-10";
  const bg = header
    ? "bg-well"
    : "bg-surface group-hover:bg-elev-2";
  if (stickyFirstColumn && index < stickyLeadingCount) {
    const left = index === 0 ? "left-0 min-w-[7.5rem]" : "left-[7.5rem]";
    return `sticky ${left} ${z} border-r border-line ${bg}`;
  }
  if (stickyLastColumn && index === lastIndex) {
    return `sticky right-0 ${z} border-l border-line ${bg}`;
  }
  return "";
}

const ALIGN_CLASS = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

function DataTable<T>({
  columns,
  data,
  loading = false,
  timellyLoader = false,
  emptyText = "No data found",
  rowKey,
  caption,
  tableTitle,
  tableSubtitle,
  headerRight,
  showMobile: _showMobile = true,
  container = true,
  rounded = true,
  containerClassName = "",
  tableClassName = "",
  theadClassName = "",
  thClassName = "",
  tbodyClassName = "",
  rowClassName = "",
  tdClassName = "",
  pagination,
  scrollableWide = false,
  stickyFirstColumn = false,
  stickyLeadingCount = 1,
  stickyLastColumn = false,
  scrollAreaClassName = "",
  paginationInline = false,
}: DataTableProps<T>) {
  const lastColIndex = columns.length - 1;
  const scrollViewportClass = scrollAreaClassName.trim()
    ? scrollAreaClassName
    : scrollableWide
      ? "relative z-0 scroll-smooth overflow-x-scroll overflow-y-hidden overscroll-x-contain pb-3 [scrollbar-width:thin] [scrollbar-color:var(--line-strong)_transparent] [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-elev-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-elev-3 hover:[&::-webkit-scrollbar-thumb]:bg-elev-3"
      : "overflow-x-auto overflow-y-hidden overscroll-x-contain";
  const stickyHeader = Boolean(scrollAreaClassName.trim());
  const canPaginate =
    Boolean(pagination) &&
    (pagination?.totalPages ?? 1) > 1 &&
    !loading &&
    data.length > 0;

  const handlePrev = () => {
    if (!pagination) return;
    pagination.onChange(Math.max(1, pagination.page - 1));
  };

  const handleNext = () => {
    if (!pagination) return;
    pagination.onChange(Math.min(pagination.totalPages, pagination.page + 1));
  };

  const getKey = (row: T, index: number) => {
    if (rowKey) return rowKey(row, index);
    const id = (row as { id?: string | number })?.id;
    if (id) return id;
    return `row-${index}`;
  };

  const renderCell = (col: Column<T>, row: T, rowIndex: number) => {
    if (col.render) return col.render(row, rowIndex);
    const value = row[col.accessor as keyof T];
    return value as ReactNode;
  };

  return (
    <div className="w-full min-w-0 max-w-full space-y-4">
      <div
        className={`block min-w-0 max-w-full ${
          container
            ? `
              ${rounded ? "rounded-3xl" : "rounded-none"}
              overflow-hidden
              border border-line
              bg-transparent shadow-card
            `
            : "w-full"
        } ${containerClassName}`}
      >
        {tableTitle && (
          <div className="px-5 py-4 border-b border-line">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[15px] font-semibold text-fg">
                  {tableTitle}
                </div>
                {tableSubtitle && (
                  <div className="mt-0.5 text-xs text-fg-subtle">
                    {tableSubtitle}
                  </div>
                )}
              </div>
              {headerRight && (
                <div className="w-full sm:w-auto sm:min-w-[240px] md:min-w-[280px]">
                  {headerRight}
                </div>
              )}
            </div>
          </div>
        )}

        <div className={`w-full min-w-0 max-w-full overscroll-x-contain ${scrollViewportClass}`}>
          <table
            className={`${
              scrollableWide ? "w-max min-w-full table-auto" : "w-full table-fixed"
            } text-sm border-collapse ${tableClassName}`}
            aria-busy={loading}
          >
            {caption && <caption className="sr-only">{caption}</caption>}

            <thead
              className={`bg-well border-b border-line ${
                stickyHeader ? "sticky top-0 z-30 " : ""
              } ${theadClassName}`}
            >
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    scope="col"
                    className={`px-3 md:px-5 py-3 text-[11px] font-semibold text-fg-subtle uppercase tracking-wider ${
                      ALIGN_CLASS[col.align ?? "left"]
                    } ${stickyColumnClass(i, lastColIndex, {
                      scrollableWide,
                      stickyFirstColumn,
                      stickyLeadingCount,
                      stickyLastColumn,
                      header: true,
                    })} ${thClassName}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody
              className={`divide-y divide-line-subtle ${tbodyClassName}`}
            >
              {loading && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-6 sm:p-10 text-center text-fg-muted"
                  >
                    {timellyLoader ? (
                      <ParentTimellyLoader preset="students" compact bare className="mx-auto w-full max-w-sm" />
                    ) : (
                      <Spinner size={26} label="Loading..." />
                    )}
                  </td>
                </tr>
              )}

              {!loading && data.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-8 text-center text-fg-muted"
                  >
                    {emptyText}
                  </td>
                </tr>
              )}

              {!loading &&
                data.map((row, rowIndex) => (
                  <tr
                    key={getKey(row, rowIndex)}
                    className={`group hover:bg-elev-2 transition-colors duration-200 ${rowClassName}`}
                  >
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-3 md:px-5 py-3.5 text-sm text-fg ${
                          scrollableWide ? "align-top whitespace-normal" : "truncate"
                        } ${ALIGN_CLASS[col.align ?? "left"]} ${stickyColumnClass(colIndex, lastColIndex, {
                          scrollableWide,
                          stickyFirstColumn,
                          stickyLeadingCount,
                          stickyLastColumn,
                        })} ${tdClassName}`}
                      >
                        {renderCell(col, row, rowIndex)}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      {canPaginate && pagination && (
        <div
          className={
            paginationInline
              ? "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-line bg-elev-1 px-4 py-3"
              : "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-line bg-elev-1 px-4 py-3"
          }
        >
          <span className="text-xs text-fg-muted">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={pagination.page <= 1}
              className="inline-flex h-8 items-center rounded-lg border border-line-strong bg-surface px-3 text-xs font-semibold text-fg transition hover:bg-elev-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={pagination.page >= pagination.totalPages}
              className="inline-flex h-8 items-center rounded-lg border border-line-strong bg-surface px-3 text-xs font-semibold text-fg transition hover:bg-elev-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(DataTable) as typeof DataTable;
