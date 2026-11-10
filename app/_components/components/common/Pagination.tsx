"use client";

/**
 * Shared Previous/Next pager used across list/table views. Two near-identical
 * copies of this (InlinePagination and Schools' own SchoolsPagination) were
 * created in separate feature splits; this is the one canonical version both
 * now delegate to.
 */
type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-line bg-elev-1 px-4 py-3">
      <span className="text-xs text-fg-muted">
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="rounded-full px-4 py-2 text-xs font-semibold border border-line bg-elev-1 text-fg-muted hover:bg-elev-3 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="rounded-full px-4 py-2 text-xs font-semibold border border-line bg-elev-1 text-fg-muted hover:bg-elev-3 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
