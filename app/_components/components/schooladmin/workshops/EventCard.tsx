"use client";

import { CalendarDays, Clock, MapPin, Users, Pencil, Trash2, Info, User, Award } from "lucide-react";

interface EventCardProps {
  title: string;
  description?: string | null;
  eventDate?: string | null;
  location?: string | null;
  mode?: string | null;
  registrations?: number;
  maxSeats?: number | null;
  hasCertificate?: boolean;
  teacherName?: string | null;
  status?: "upcoming" | "completed";
  photo?: string | null;
  additionalInfo?: string | null;
  onViewDetails?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

const modeStyles: Record<string, string> = {
  offline: "bg-emerald-500/90 text-fg",
  online: "bg-blue-500/90 text-fg",
  hybrid: "bg-orange-500/90 text-fg",
};

const statusStyles: Record<string, string> = {
  upcoming: "bg-primary/90 text-on-primary",
  completed: "bg-elev-3 text-fg",
};

function formatDate(dateString?: string | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateString?: string | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EventCard({
  title,
  description,
  eventDate,
  location: _location,
  mode,
  registrations,
  maxSeats,
  hasCertificate,
  teacherName,
  status,
  photo,
  additionalInfo,
  onViewDetails,
  onEdit,
  onDelete,
  showActions = true,
}: EventCardProps) {
  const badgeMode = (mode || "").toLowerCase();
  const modeClass = modeStyles[badgeMode] ?? "bg-elev-2 text-fg";
  const statusClass = status ? statusStyles[status] : "bg-elev-2 text-fg-muted";

  return (
    <article className="overflow-hidden rounded-3xl border border-line bg-elev-1 shadow-card">
      <div className="relative h-44 sm:h-48 bg-elev-2">
        {photo ? (
          <img src={photo} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-elev-2 via-elev-2 to-elev-2" />
        )}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${modeClass}`}>
            <MapPin size={12} />
            {mode || "Mode"}
          </span>
        </div>
        <div className="absolute right-4 top-4 flex flex-col items-end gap-1">
          {hasCertificate && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 border border-primary/40 px-2.5 py-1 text-xs font-semibold text-primary">
              <Award size={12} />
              Certificate
            </span>
          )}
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
            {status === "completed" ? "Completed" : "Upcoming"}
          </span>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-6 sm:py-5 text-fg">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-fg">{title}</h3>
          </div>
          {showActions && (
            <div className="ml-auto flex items-center gap-0">
              <button
                type="button"
                onClick={onEdit}
                className="h-9 w-9 rounded-xl text-fg-muted hover:text-fg transition cursor-pointer"
                aria-label="Edit"
              >
                <Pencil size={12} />
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="h-9 w-9 rounded-xl text-fg-muted hover:text-red-700 dark:hover:text-red-400 transition cursor-pointer"
                aria-label="Delete"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>

        <div className="flex-1">
            {description ? (
              <p className="mt-2 text-sm text-fg-muted line-clamp-2">
                {description}
              </p>
            ) : null}
          </div>

        <div className="mt-4 rounded-2xl border border-line bg-elev-2 px-4 py-4 text-[11px] sm:text-xs text-fg grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays size={14} className="text-primary" />
            <span>{formatDate(eventDate) || "Date"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-primary" />
            <span>{formatTime(eventDate) || "Time"}</span>
          </div>
          <div className="flex items-center gap-2">
            <User size={14} className="text-primary" />
            <span className="truncate">{teacherName || "Not assigned"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-primary" />
            <span>
              {registrations ?? 0}
              {maxSeats != null ? ` / ${maxSeats}` : ""} Enrolled
            </span>
          </div>
        </div>

        {additionalInfo ? (
          <div className="mt-3 flex items-start gap-2 text-xs text-fg-muted">
            <Info size={14} className="text-primary mt-0.5" />
            <span className="line-clamp-2">{additionalInfo}</span>
          </div>
        ) : null}

        <button
          type="button"
          onClick={onViewDetails}
          className="mt-4 w-full rounded-2xl border border-line bg-elev-1 px-4 py-2.5 text-sm font-semibold text-fg hover:bg-elev-3 transition cursor-pointer"
        >
          View Details
        </button>
      </div>
    </article>
  );
}
