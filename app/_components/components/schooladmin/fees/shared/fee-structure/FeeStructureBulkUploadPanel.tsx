import type { RefObject } from "react";
import PrimaryButton from "../../../../common/PrimaryButton";

export function FeeStructureBulkUploadPanel({
  bulkInputRef,
  bulkFile,
  setBulkFile,
  bulkUploading,
  bulkResult,
  onDownloadTemplate,
  onUpload,
}: {
  bulkInputRef: RefObject<HTMLInputElement | null>;
  bulkFile: File | null;
  setBulkFile: (f: File | null) => void;
  bulkUploading: boolean;
  bulkResult: {
    updatedClasses: number;
    updated: Array<{ label: string; components: number }>;
    failed: Array<{ row: number; message: string }>;
  } | null;
  onDownloadTemplate: () => void;
  onUpload: () => void;
}) {
  return (
    <div className="mb-4 space-y-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
      <p className="text-sm text-fg-muted">
        One row per fee head. Use columns{" "}
        <span className="font-medium text-fg">ClassName</span>,{" "}
        <span className="font-medium text-fg">Section</span> (blank if your class has no section),{" "}
        <span className="font-medium text-fg">ComponentName</span>,{" "}
        <span className="font-medium text-fg">Amount</span>. Class names must match your school
        classes exactly.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          onClick={onDownloadTemplate}
          className="text-left text-sm text-emerald-700 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline"
        >
          Download Excel template
        </button>
        <span className="hidden text-fg-faint sm:inline">·</span>
        <input
          ref={bulkInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setBulkFile(e.target.files?.[0] ?? null)}
          className="w-full max-w-md text-sm text-fg-muted file:mr-3 file:rounded-lg file:border-0 file:bg-elev-2 file:px-3 file:py-2 file:text-sm file:text-fg"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <PrimaryButton
          title={bulkUploading ? "Uploading..." : "Upload & apply"}
          loading={bulkUploading}
          onClick={onUpload}
        />
        {bulkFile ? (
          <span className="self-center text-xs text-fg-subtle">Selected: {bulkFile.name}</span>
        ) : null}
      </div>
      {bulkResult ? (
        <div className="rounded-lg border border-line bg-well p-3 text-sm">
          <p className="font-medium text-fg">
            Updated {bulkResult.updatedClasses} class{bulkResult.updatedClasses === 1 ? "" : "es"}.
          </p>
          {bulkResult.updated.length > 0 ? (
            <ul className="mt-2 list-inside list-disc text-fg-muted">
              {bulkResult.updated.map((u) => (
                <li key={u.label}>
                  {u.label} — {u.components} head{u.components === 1 ? "" : "s"}
                </li>
              ))}
            </ul>
          ) : null}
          {bulkResult.failed.length > 0 ? (
            <div className="mt-3 border-t border-line pt-2">
              <p className="font-medium text-amber-700 dark:text-amber-300">Issues ({bulkResult.failed.length})</p>
              <ul className="mt-1 max-h-40 list-inside list-disc overflow-y-auto text-fg-muted">
                {bulkResult.failed.map((f, i) => (
                  <li key={i}>
                    {f.row > 0 ? `Row ${f.row}: ` : ""}
                    {f.message}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
