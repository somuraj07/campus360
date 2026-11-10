"use client";

import { useEffect } from "react";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Users,
  GraduationCap,
  Building2,
  TrendingUp,
  Download,
  Trash2,
  UserRound,
} from "lucide-react";
import { formatAmount } from "../../../../utils/format";
import type { SchoolRow } from "../../Schools";
import { InitialsAvatar, btnClass } from "../ui";

function Stat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-3.5">
      <div className="flex items-center gap-2 text-xs text-fg-subtle">
        <Icon size={14} />
        {label}
      </div>
      <p className="mt-1.5 text-xl font-semibold text-fg tabular-nums">{value}</p>
    </div>
  );
}

/** Right-hand "school page" panel opened from the Schools list. */
export function SchoolProfileDrawer({
  school,
  onClose,
  exportingSchoolId,
  deleteBusy,
  onDownload,
  onRequestDelete,
}: {
  school: SchoolRow | null;
  onClose: () => void;
  exportingSchoolId: string | null;
  deleteBusy: boolean;
  onDownload: (s: SchoolRow) => void;
  onRequestDelete: (s: SchoolRow) => void;
}) {
  useEffect(() => {
    if (!school) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [school, onClose]);

  if (!school) return null;
  const s = school;
  const place = [s.location, s.address].filter(Boolean).join(" · ");
  const tel = s.admin?.mobile?.replace(/\s/g, "");
  const exporting = exportingSchoolId === s.id;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="school-drawer-title">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-overlay" />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-canvas shadow-pop">
        {/* Hero */}
        <div className="relative bg-sidebar px-6 pb-6 pt-5 text-white">
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-accent" />
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
              School #{String(s.slNo).padStart(2, "0")}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <InitialsAvatar name={s.name} size="lg" onDark />
            <div className="min-w-0">
              <h2 id="school-drawer-title" className="text-xl font-semibold leading-tight">
                {s.name}
              </h2>
              {place && (
                <p className="mt-1 flex items-start gap-1.5 text-xs text-white/70">
                  <MapPin size={13} className="mt-0.5 shrink-0" />
                  <span className="line-clamp-2">{place}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-3">
            <Stat icon={Users} label="Students" value={s.studentCount.toLocaleString("en-IN")} />
            <Stat icon={GraduationCap} label="Teachers" value={s.teacherCount.toLocaleString("en-IN")} />
            <Stat icon={Building2} label="Classes" value={s.classCount.toLocaleString("en-IN")} />
            <Stat icon={TrendingUp} label="Turnover" value={formatAmount(s.turnover, true)} />
          </div>

          <section>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">School admin</h3>
            <div className="rounded-xl border border-line bg-surface">
              <div className="flex items-center gap-3 border-b border-line-subtle p-4">
                {s.admin ? (
                  <InitialsAvatar name={s.admin.name || "Admin"} src={s.admin.photoUrl} />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-elev-2 text-fg-faint">
                    <UserRound size={18} />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-fg">{s.admin?.name ?? "No admin assigned"}</p>
                  {s.admin?.role && <p className="text-xs text-fg-subtle">{s.admin.role}</p>}
                </div>
              </div>
              <dl className="divide-y divide-line-subtle text-sm">
                <div className="flex items-center gap-3 px-4 py-3">
                  <Phone size={15} className="shrink-0 text-fg-faint" />
                  <dt className="sr-only">Phone</dt>
                  <dd className="min-w-0 truncate">
                    {tel ? (
                      <a href={`tel:${tel}`} className="text-primary hover:underline tabular-nums">
                        {s.admin?.mobile}
                      </a>
                    ) : (
                      <span className="text-fg-subtle">Not provided</span>
                    )}
                  </dd>
                </div>
                <div className="flex items-center gap-3 px-4 py-3">
                  <Mail size={15} className="shrink-0 text-fg-faint" />
                  <dt className="sr-only">Email</dt>
                  <dd className="min-w-0 truncate">
                    {s.admin?.email ? (
                      <a href={`mailto:${s.admin.email}`} className="text-primary hover:underline">
                        {s.admin.email}
                      </a>
                    ) : (
                      <span className="text-fg-subtle">Not provided</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">Data &amp; records</h3>
            <div className="rounded-xl border border-line bg-surface p-4">
              <p className="text-sm font-medium text-fg">Full fees backup</p>
              <p className="mt-0.5 text-xs text-fg-subtle">Download every fee record for this school as an Excel workbook.</p>
              <button
                type="button"
                onClick={() => onDownload(s)}
                disabled={exporting || deleteBusy}
                className={`${btnClass("secondary")} mt-3 w-full`}
              >
                {exporting ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-primary" />
                ) : (
                  <Download size={16} />
                )}
                {exporting ? "Preparing…" : "Fees backup"}
              </button>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-red-700 dark:text-red-400">Danger zone</h3>
            <div className="rounded-xl border border-red-200 bg-red-50/60 p-4 dark:border-red-500/30 dark:bg-red-500/5">
              <p className="text-sm font-medium text-fg">Delete this school</p>
              <p className="mt-0.5 text-xs text-fg-subtle">
                Permanently removes the school and all of its records. Export anything you need first.
              </p>
              <button
                type="button"
                onClick={() => onRequestDelete(s)}
                disabled={deleteBusy || exporting}
                className={`${btnClass("dangerSoft")} mt-3 w-full`}
              >
                <Trash2 size={16} />
                Delete school
              </button>
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
