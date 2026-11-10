"use client";

import { Clock, CalendarDays, CheckCircle, Download, XCircle } from "lucide-react";

interface CertificateRequestCardProps {
  title: string;
  purpose: string;
  requestId: string;
  status: "processing" | "ready" | "rejected";
  requestDate: string;
  secondDateLabel: string;
  secondDate: string;
  daysElapsed: string;
  progress?: number;
  highPriority?: boolean;
  downloadUrl?: string | null;
}

const CertificateRequestCard = ({
  title,
  purpose,
  requestId,
  status,
  requestDate,
  secondDateLabel,
  secondDate,
  daysElapsed,
  progress = 0,
  highPriority = false,
  downloadUrl,
}: CertificateRequestCardProps) => {
  const isProcessing = status === "processing";
  const isRejected = status === "rejected";

  return (
    <div className="w-full">
      <div
        className="relative rounded-2xl p-6 
                   bg-elev-1 
                   
                   border border-line 
                   shadow-card"
      >
        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-start mb-6">

          <div>
            <h3 className="text-fg text-lg font-bold">
              {title}
            </h3>

            <p className="text-fg-muted text-sm">
              Purpose: {purpose}
            </p>

            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs bg-elev-2 px-3 py-1 rounded-full text-fg-muted border border-line">
                {requestId}
              </span>

              {highPriority && (
                <span className="text-xs bg-red-500/20 text-red-700 dark:text-red-400 px-3 py-1 rounded-full border border-red-500/30">
                  High Priority
                </span>
              )}
            </div>
          </div>

          {/* Status Badge */}
          {isProcessing ? (
            <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full 
                             bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-400/30">
              <Clock className="w-3 h-3" />
              Processing
            </span>
          ) : isRejected ? (
            <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full 
                             bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/30">
              <XCircle className="w-3 h-3" />
              Rejected
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full 
                             bg-primary/20 text-primary border border-primary/30">
              <CheckCircle className="w-3 h-3" />
              Ready to Download
            </span>
          )}
        </div>

        {/* ================= DATE SECTION ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          {/* Request Date */}
          <div className="bg-elev-1 p-4 rounded-2xl border border-line">
            <div className="flex items-center gap-2 text-xs text-fg-muted mb-1">
              <CalendarDays className="w-4 h-4 text-primary" />
              Request Date
            </div>
            <div className="text-fg font-semibold">
              {requestDate}
            </div>
          </div>

          {/* Expected / Approved Date */}
          <div className="bg-elev-1 p-4 rounded-2xl border border-line">
            <div className="flex items-center gap-2 text-xs text-fg-muted mb-1">
              {isProcessing ? (
                <Clock className="w-4 h-4 text-orange-700 dark:text-orange-400" />
              ) : isRejected ? (
                <XCircle className="w-4 h-4 text-red-700 dark:text-red-400" />
              ) : (
                <CheckCircle className="w-4 h-4 text-primary" />
              )}
              {secondDateLabel}
            </div>
            <div className="text-fg font-semibold">
              {secondDate}
            </div>
          </div>

          {/* Days Elapsed */}
          <div className="bg-elev-1 p-4 rounded-2xl border border-line">
            <div className="flex items-center gap-2 text-xs text-fg-muted mb-1">
              <Clock className="w-4 h-4 text-purple-700 dark:text-purple-400" />
              Days Elapsed
            </div>
            <div className="text-purple-700 dark:text-purple-300 font-semibold">
              {daysElapsed}
            </div>
          </div>

        </div>

        {/* ================= PROGRESS ================= */}
        {isProcessing && (
          <div>
            <div className="flex justify-between text-xs text-fg-muted mb-2">
              <span>Processing Progress</span>
              <span className="text-orange-700 dark:text-orange-400 font-semibold">
                ~{progress}%
              </span>
            </div>

            <div className="h-2 bg-elev-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* ================= DOWNLOAD BUTTON ================= */}
        {!isProcessing && !isRejected && (
          downloadUrl ? (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full py-4 rounded-2xl 
                       bg-primary text-on-primary font-semibold
                       flex items-center justify-center gap-2
                       hover:bg-primary/90 transition"
            >
              <Download className="w-4 h-4" />
              Download Certificate Now
            </a>
          ) : (
            <button
              disabled
              className="mt-6 w-full py-4 rounded-2xl 
                       bg-elev-3 text-fg font-semibold
                       flex items-center justify-center gap-2
                       cursor-not-allowed opacity-50"
            >
              <Download className="w-4 h-4" />
              Document Not Available Yet
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default CertificateRequestCard;
