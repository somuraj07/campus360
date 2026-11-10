import { X } from "lucide-react";
import { certificateTypes } from "./parentCertificatesHelpers";

export function RequestCertificateModal({
  requestLoading,
  onClose,
  message,
  certificateType,
  setCertificateType,
  requestReason,
  setRequestReason,
  onSubmit,
}: {
  requestLoading: boolean;
  onClose: () => void;
  message: { text: string; type: "success" | "error" } | null;
  certificateType: string;
  setCertificateType: (v: string) => void;
  requestReason: string;
  setRequestReason: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-overlay "
        onClick={() => !requestLoading && onClose()}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-surface border border-line shadow-pop flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h3 className="text-lg font-bold text-fg">Request Certificate</h3>
          <button
            type="button"
            onClick={() => !requestLoading && onClose()}
            className="p-2 rounded-lg hover:bg-elev-3 text-fg-muted hover:text-fg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form
          className="flex flex-col flex-1 overflow-y-auto"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="p-6 space-y-4">
            {message && (
              <div
                className={`px-4 py-3 rounded-xl text-sm ${
                  message.type === "success"
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/30"
                }`}
              >
                {message.text}
              </div>
            )}
            <div>
              <label htmlFor="certificate-type" className="block text-sm font-medium text-fg-muted mb-2">
                Certificate type <span className="text-red-700 dark:text-red-400">*</span>
              </label>
              <select
                id="certificate-type"
                value={certificateType}
                onChange={(e) => setCertificateType(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-elev-1 border border-line text-fg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                <option value="" className="text-fg-faint bg-white">Select type</option>
                {certificateTypes.map((opt) => (
                  <option key={opt.value} value={opt.value} className="text-fg bg-surface">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="request-reason" className="block text-sm font-medium text-fg-muted mb-2">
                Reason <span className="text-red-700 dark:text-red-400">*</span>
              </label>
              <textarea
                id="request-reason"
                value={requestReason}
                onChange={(e) => setRequestReason(e.target.value)}
                required
                rows={4}
                placeholder="Brief reason for requesting this certificate..."
                className="w-full px-4 py-3 rounded-xl bg-elev-1 border border-line text-fg placeholder:text-fg-faint focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
              />
            </div>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-line bg-surface">
            <button
              type="button"
              onClick={onClose}
              disabled={requestLoading}
              className="flex-1 px-4 py-3 rounded-xl bg-elev-2 text-fg-muted hover:bg-elev-3 disabled:opacity-50 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={requestLoading}
              className="flex-1 px-4 py-3 rounded-xl bg-primary text-on-primary font-semibold hover:bg-primary/90 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {requestLoading ? "Submitting…" : "Submit request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
