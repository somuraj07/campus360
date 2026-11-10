"use client";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { uploadClassesCsv } from "@/lib/api/classes";
import SuccessPopups from "../../common/SuccessPopUps";
import { getErrorMessage } from "@/lib/errors/errorInfo";

interface UploadCsvPanelProps {
  onCancel: () => void;
  /** Called after a successful upload so the classes table can reload. */
  onSuccess?: () => void;
}

export default function UploadCsvPanel({ onCancel, onSuccess }: UploadCsvPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setError(null);
    setIsUploading(true);
    try {
      const { ok, data: payload } = await uploadClassesCsv(file);

      if (!ok) {
        throw new Error(payload?.message || "Upload failed.");
      }

      const createdCount = payload?.createdCount ?? 0;
      const failedCount = payload?.failedCount ?? 0;
      setSuccessMessage(
        `Created: ${createdCount}, Failed: ${failedCount}`
      );
      setShowSuccess(true);
      setFile(null);
      onSuccess?.();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-elev-1 p-5 sm:p-6 animate-fadeIn">
      <div className="mb-5 flex items-center gap-2 text-[15px] font-semibold text-fg">
        <Upload size={18} className="text-primary" />
        Upload CSV
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4">
        <div
          className="rounded-2xl border border-dashed border-line bg-elev-1 p-6 text-center cursor-pointer hover:border-primary"
          onClick={handleBrowseClick}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleBrowseClick();
            }
          }}
        >
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-elev-1">
            <Upload size={18} className="text-fg-muted" />
          </div>
          <div className="text-sm text-fg">
            {file ? file.name : "Click to upload or drag and drop"}
          </div>
          <div className="text-xs text-fg-subtle mt-1">CSV file (max. 10MB)</div>
        </div>

        <div className="rounded-2xl border border-sky-300/20 bg-sky-50 dark:bg-sky-900/10 p-4">
          <div className="text-xs font-semibold text-sky-800 dark:text-sky-200 mb-2">Instructions:</div>
          <ul className="list-disc pl-4 space-y-1 text-[11px] text-sky-800 dark:text-sky-200">
            <li>File must be in .csv format</li>
            <li>Required columns: Class Name, Section, Class Teacher, Max Students</li>
            <li>Ensure no duplicate entries</li>
          </ul>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && <div className="mt-3 text-xs text-red-700 dark:text-red-300">{error}</div>}

      <div className="mt-6 flex items-center justify-end gap-2 border-t border-line pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface px-4 text-sm font-semibold text-fg transition-colors hover:bg-elev-2 cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-hover cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
        >
          {isUploading ? "Uploading..." : "Upload File"}
        </button>
      </div>

      <SuccessPopups
        open={showSuccess}
        title="Uploaded and Added Classes Successfully"
        description={successMessage ?? undefined}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
