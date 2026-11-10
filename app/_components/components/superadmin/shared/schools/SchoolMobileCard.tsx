import { ChevronRight, Download, Trash2 } from "lucide-react";
import Pagination from "@/app/_components/components/common/Pagination";
import { formatAmount as fmtAmount } from "../../../../utils/format";
import type { SchoolRow } from "../../Schools";
import { InitialsAvatar } from "../ui";

export function SchoolMobileCard({
  school: s,
  exportingSchoolId,
  deleteBusy,
  onDownload,
  onRequestDelete,
  onOpen,
}: {
  school: SchoolRow;
  exportingSchoolId: string | null;
  deleteBusy: boolean;
  onDownload: (s: SchoolRow) => void;
  onRequestDelete: (s: SchoolRow) => void;
  onOpen?: (s: SchoolRow) => void;
}) {
  const place = [s.location, s.address].filter(Boolean).join(" · ") || "—";
  const exporting = exportingSchoolId === s.id;
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-elev-1">
      <button
        type="button"
        onClick={() => onOpen?.(s)}
        className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-elev-2"
      >
        <InitialsAvatar name={s.name} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-fg">{s.name}</p>
          <p className="truncate text-xs text-fg-subtle">{place}</p>
        </div>
        <ChevronRight size={18} className="shrink-0 text-fg-faint" />
      </button>

      <dl className="grid grid-cols-3 divide-x divide-line-subtle border-y border-line-subtle text-center">
        <div className="px-2 py-3">
          <dt className="text-[11px] text-fg-subtle">Students</dt>
          <dd className="mt-0.5 text-sm font-semibold text-fg tabular-nums">{s.studentCount.toLocaleString("en-IN")}</dd>
        </div>
        <div className="px-2 py-3">
          <dt className="text-[11px] text-fg-subtle">Teachers</dt>
          <dd className="mt-0.5 text-sm font-semibold text-fg tabular-nums">{s.teacherCount.toLocaleString("en-IN")}</dd>
        </div>
        <div className="px-2 py-3">
          <dt className="text-[11px] text-fg-subtle">Turnover</dt>
          <dd className="mt-0.5 text-sm font-semibold text-fg tabular-nums">{fmtAmount(s.turnover, true)}</dd>
        </div>
      </dl>

      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <p className="min-w-0 truncate text-xs text-fg-subtle">
          Admin: <span className="font-medium text-fg">{s.admin?.name ?? "—"}</span>
        </p>
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={() => onDownload(s)}
            disabled={exporting || deleteBusy}
            aria-label={`Download fees backup for ${s.name}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong bg-surface text-fg-muted transition hover:bg-elev-2 hover:text-fg disabled:opacity-50"
          >
            {exporting ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-primary" />
            ) : (
              <Download size={16} />
            )}
          </button>
          <button
            type="button"
            onClick={() => onRequestDelete(s)}
            disabled={deleteBusy || exporting}
            aria-label={`Delete ${s.name}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100 disabled:opacity-50 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

/** Thin alias kept for existing import sites — see app/_components/components/common/Pagination. */
export function SchoolsPagination(props: { page: number; totalPages: number; onChange: (p: number) => void }) {
  return <Pagination {...props} />;
}
