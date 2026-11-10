"use client";

import { Calendar, Download, FileText } from "lucide-react";

type CircularNoticeCardProps = {
  referenceNumber: string;
  subject: string;
  content: string;
  publishStatus: string;
  date: string;
  issuedBy?: string | null;
  issuedByPhoto?: string | null;
  attachments?: string[];
  accentClassName?: string;
  className?: string;
};

function getInitials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "S";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function fileLabel(path: string) {
  const parts = path.split("/");
  return parts[parts.length - 1] || "Attachment";
}

export default function CircularNoticeCard({
  referenceNumber,
  subject,
  content,
  publishStatus,
  date,
  issuedBy,
  issuedByPhoto,
  attachments = [],
  accentClassName = "bg-primary",
  className = "",
}: CircularNoticeCardProps) {
  const issuer = issuedBy?.trim() || "School Admin";
  const isPublished = publishStatus.toUpperCase() === "PUBLISHED";

  return (
    <article
      className={`relative overflow-hidden rounded-xl sm:rounded-2xl border border-line bg-elev-1 p-4 sm:p-5 flex flex-col ${className}`}
    >
      <div className={`absolute top-0 left-0 h-1 w-full ${accentClassName}`} />

      <div className="flex items-center justify-between text-xs text-fg-muted">
        <span>{referenceNumber || "CIR/NA"}</span>
        <span
          className={`px-2 py-1 rounded-full font-semibold border ${
            isPublished
              ? "bg-primary/10 text-primary border-primary/20"
              : "bg-elev-2 text-fg-muted border-line-strong"
          }`}
        >
          {publishStatus || "DRAFT"}
        </span>
      </div>

      <h4 className="mt-3 sm:mt-4 text-lg sm:text-2xl font-bold text-fg leading-tight line-clamp-2">{subject}</h4>

      <div className="mt-3 sm:mt-4 bg-well rounded-lg sm:rounded-xl p-3 sm:p-5 border border-line-subtle flex-1">
        <p className="text-sm sm:text-base text-fg-muted italic leading-relaxed line-clamp-4 sm:line-clamp-6">{content}</p>
      </div>

      {attachments.length > 0 && (
        <div className="mt-4 space-y-2">
          {attachments.slice(0, 2).map((file) => (
            /^https?:\/\//i.test(file) ? (
              <a
                key={file}
                href={file}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-line bg-elev-1 px-3 py-2.5 hover:bg-elev-3 transition-colors"
              >
                <span className="flex items-center gap-2 text-sm text-fg truncate">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <span className="truncate">{fileLabel(file)}</span>
                </span>
                <Download className="h-4 w-4 text-fg-subtle shrink-0" />
              </a>
            ) : (
              <div
                key={file}
                className="flex items-center justify-between rounded-xl border border-line bg-elev-1 px-3 py-2.5"
              >
                <span className="flex items-center gap-2 text-sm text-fg truncate">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <span className="truncate">{fileLabel(file)}</span>
                </span>
              </div>
            )
          ))}
        </div>
      )}

      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-line flex items-center justify-between text-xs sm:text-sm text-fg-muted gap-2">
        <div className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold overflow-hidden">
            {issuedByPhoto ? (
               
              <img src={issuedByPhoto} alt={issuer} className="h-full w-full object-cover" />
            ) : (
              getInitials(issuer)
            )}
          </span>
          <span className="truncate max-w-[140px]">{issuer}</span>
        </div>
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {new Date(date).toLocaleDateString("en-GB")}
        </span>
      </div>
    </article>
  );
}
