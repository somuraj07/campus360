"use client";

import { Download, FileText, KeyRound, RefreshCw } from "lucide-react";
import type { ExportFormat } from "./types";

type Props = {
  revalidating: boolean;
  initialLoading: boolean;
  resetting: boolean;
  exporting: ExportFormat | null;
  hasRows: boolean;
  onReset: () => void;
  onDownload: (format: ExportFormat) => void;
};

const btnBase =
  "inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2 sm:text-sm";

export default function StudentCredentialsHeader({
  revalidating,
  initialLoading,
  resetting,
  exporting,
  hasRows,
  onReset,
  onDownload,
}: Props) {
  const disabled = initialLoading || !hasRows;

  return (
    <div className="mb-4 flex flex-col gap-4 md:gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <KeyRound className="h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300 sm:h-5 sm:w-5" />
          <h3 className="text-sm font-semibold text-fg sm:text-base">
            Student login credentials
          </h3>
          {revalidating && !initialLoading ? (
            <span className="rounded-full border border-line bg-elev-1 px-2 py-0.5 text-[10px] text-fg-subtle">
              Updating…
            </span>
          ) : null}
        </div>
        <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-fg-subtle sm:text-sm">
          Verified passwords only in exports. Default password is DOB as{" "}
          <span className="font-mono">YYYYMMDD</span>.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end md:gap-2">
        <button
          type="button"
          disabled={resetting || initialLoading}
          onClick={onReset}
          className={`${btnBase} col-span-2 border border-amber-500/40 bg-amber-500/15 text-amber-800 dark:text-amber-100 hover:bg-amber-500/25 sm:col-span-1`}
        >
          <RefreshCw className={`h-4 w-4 shrink-0 ${resetting ? "animate-spin" : ""}`} />
          <span className="truncate">{resetting ? "Resetting…" : "Reset to DOB"}</span>
        </button>

        <button
          type="button"
          disabled={!!exporting || disabled}
          onClick={() => onDownload("pdf")}
          className={`${btnBase} border border-rose-500/35 bg-rose-500/10 text-rose-800 dark:text-rose-100 hover:bg-rose-500/20`}
        >
          <FileText className="h-4 w-4 shrink-0" />
          {exporting === "pdf" ? "PDF…" : "PDF"}
        </button>

        <button
          type="button"
          disabled={!!exporting || disabled}
          onClick={() => onDownload("xlsx")}
          className={`${btnBase} border border-primary/40 bg-primary/15 text-primary hover:bg-primary/25`}
        >
          <Download className="h-4 w-4 shrink-0" />
          {exporting === "xlsx" ? "Excel…" : "Excel"}
        </button>

        <button
          type="button"
          disabled={!!exporting || disabled}
          onClick={() => onDownload("csv")}
          className={`${btnBase} border border-line bg-elev-1 text-fg hover:bg-elev-3`}
        >
          <Download className="h-4 w-4 shrink-0" />
          {exporting === "csv" ? "CSV…" : "CSV"}
        </button>
      </div>
    </div>
  );
}
