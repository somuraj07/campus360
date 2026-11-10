import { Check, CheckCircle2, FileImage, Loader2, Upload } from "lucide-react";
import { formatDate, type HubEvent } from "./createHubTypes";

export function WorkshopAndCertificatePanel({
  events,
  selectedEventId,
  onSelectEvent,
  uploadingCert,
  certificateUrl,
  certificateFile,
  onCertUpload,
}: {
  events: HubEvent[];
  selectedEventId: string | null;
  onSelectEvent: (id: string) => void;
  uploadingCert: boolean;
  certificateUrl: string | null;
  certificateFile: File | null;
  onCertUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="xl:col-span-1 space-y-6">
      {/* 1. Select Workshop */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-fg-subtle uppercase tracking-wider">
            1. Select Workshop
          </span>
          <span className="text-xs text-primary border border-primary/30 bg-primary/10 px-2.5 py-1 rounded-full">
            {events.length} Events
          </span>
        </div>
        <div className="space-y-2 max-h-[200px] sm:max-h-[240px] overflow-y-auto no-scrollbar pr-1">
          {events.map((event) => {
            const isSelected = event.id === selectedEventId;
            return (
              <button
                key={event.id}
                type="button"
                onClick={() => onSelectEvent(event.id)}
                className={`w-full rounded-xl sm:rounded-2xl border px-3 py-2.5 sm:px-4 sm:py-3 text-left transition-colors ${
                  isSelected
                    ? "border-primary/70 bg-elev-2"
                    : "border-line bg-well hover:bg-elev-3"
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl flex items-center justify-center text-sm font-semibold shrink-0 ${
                      isSelected
                        ? "bg-primary text-on-primary"
                        : "bg-elev-2 text-fg-subtle"
                    }`}
                  >
                    {event.title?.[0] ?? "E"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`font-medium text-sm sm:text-base truncate ${
                        isSelected ? "text-fg" : "text-fg-subtle"
                      }`}
                    >
                      {event.title}
                    </div>
                    <div
                      className={`text-xs ${
                        isSelected ? "text-fg-muted" : "text-fg-subtle"
                      }`}
                    >
                      {formatDate(event.eventDate) || "Date"} •{" "}
                      {event._count?.registrations ?? 0} enrolled
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 size={18} className="text-primary shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
          {events.length === 0 && (
            <div className="rounded-xl border border-dashed border-line bg-elev-1 px-4 py-6 text-sm text-fg-subtle text-center">
              No events yet. Create one to get started.
            </div>
          )}
        </div>
      </div>

      {/* 2. Attach Certificate */}
      <div>
        <span className="text-xs font-bold text-fg-subtle uppercase tracking-wider">
          2. Attach Certificate
        </span>
        <label className="mt-3 block">
          <div className="rounded-xl sm:rounded-2xl border-2 border-dashed border-line-strong hover:border-primary/40 bg-well p-4 sm:p-6 cursor-pointer transition-colors">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={onCertUpload}
              disabled={uploadingCert}
            />
            {uploadingCert ? (
              <div className="flex flex-col items-center gap-2 text-fg-muted">
                <Loader2 size={32} className="animate-spin" />
                <span className="text-sm">Uploading...</span>
              </div>
            ) : certificateUrl ? (
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-elev-2 flex items-center justify-center text-primary shrink-0">
                  <FileImage size={24} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-fg truncate">
                    {certificateFile?.name || "Certificate attached"}
                  </div>
                  <div className="text-xs text-fg-subtle">Click to replace</div>
                </div>
                <Check size={18} className="text-primary shrink-0" />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-fg-subtle">
                <Upload size={28} />
                <span className="text-sm">Upload certificate image</span>
                <span className="text-xs">JPEG, PNG or WebP</span>
              </div>
            )}
          </div>
        </label>
        {!certificateUrl && (
          <div className="mt-4 rounded-xl border border-dashed border-line-strong bg-well h-[200px] sm:h-[220px] lg:h-[240px] flex items-center justify-center text-fg-subtle text-sm">
            Upload a certificate first
          </div>
        )}
      </div>
    </div>
  );
}
