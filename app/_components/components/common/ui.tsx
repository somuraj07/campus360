"use client";

/**
 * Portal design kit (Super Admin, School Admin, …) — page header, KPI cards, panels, fields, badges.
 * All colours come from the theme tokens in app/globals.css (light + dark).
 */

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { Inbox, Loader2 } from "lucide-react";

/* ─────────────────────────── Layout ─────────────────────────── */

export function SaPage({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-[1400px] space-y-5 pb-10 sm:space-y-6">{children}</div>;
}

export function SaPageHeader({
  eyebrow = "Super Admin",
  title,
  description,
  actions,
  tone = "default",
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  tone?: "default" | "danger";
}) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <p
          className={`mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${
            tone === "danger" ? "text-red-700 dark:text-red-400" : "text-accent-fg"
          }`}
        >
          {eyebrow}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-fg-subtle">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 md:justify-end">{actions}</div>}
    </header>
  );
}

export function Panel({
  title,
  description,
  icon: Icon,
  actions,
  children,
  className = "",
  bodyClassName = "p-5",
}: {
  title?: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`overflow-hidden rounded-2xl border border-line bg-elev-1 ${className}`}>
      {(title || actions) && (
        <div className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            {Icon && (
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={16} />
              </span>
            )}
            <div className="min-w-0">
              {title && <h2 className="text-[15px] font-semibold text-fg">{title}</h2>}
              {description && <p className="mt-0.5 text-xs text-fg-subtle">{description}</p>}
            </div>
          </div>
          {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

/** Numbered form section ("1  Basic information") used by long multi-part forms. */
export function FormStep({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-elev-1">
      <div className="flex items-start gap-4 border-b border-line px-5 py-4 sm:px-6">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-on-primary">
          {step}
        </span>
        <div>
          <h2 className="text-[15px] font-semibold text-fg">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-fg-subtle">{description}</p>}
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

/** "3/5 required fields" progress list for form side panels. */
export function RequiredChecklist({ items }: { items: { label: string; done: boolean }[] }) {
  const done = items.filter((i) => i.done).length;
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-fg">Required fields</p>
        <span className="text-xs font-medium text-fg-subtle tabular-nums">
          {done}/{items.length}
        </span>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-elev-3">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${items.length ? (done / items.length) * 100 : 0}%` }}
        />
      </div>
      <ul className="mt-4 space-y-2">
        {items.map(({ label, done: ok }) => (
          <li key={label} className="flex items-center gap-2 text-xs">
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full ${
                ok ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-elev-2 text-fg-faint"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="3.5" aria-hidden>
                <path d="M5 12.5 10 17 19 7" />
              </svg>
            </span>
            <span className={ok ? "text-fg" : "text-fg-subtle"}>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────────────────── Data display ─────────────────────────── */

const TONES = {
  navy: "bg-primary/10 text-primary",
  gold: "bg-accent/15 text-accent-fg",
  sky: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  green: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  red: "bg-red-500/10 text-red-700 dark:text-red-300",
} as const;
export type Tone = keyof typeof TONES;

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "navy",
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon: LucideIcon;
  tone?: Tone;
}) {
  return (
    <div className="rounded-2xl border border-line bg-elev-1 p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-fg-subtle">{label}</p>
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${TONES[tone]}`}>
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-2 text-[28px] font-semibold leading-none tracking-tight text-fg tabular-nums">{value}</p>
      {hint && <p className="mt-2.5 text-xs text-fg-subtle">{hint}</p>}
    </div>
  );
}

export function KpiGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{children}</div>;
}

export function Badge({ tone = "navy", children, dot = false }: { tone?: Tone; children: ReactNode; dot?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

const AVATAR_TONES = [
  "bg-primary/10 text-primary",
  "bg-accent/20 text-accent-fg",
  "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  "bg-violet-500/15 text-violet-700 dark:text-violet-300",
];

/** Initials tile (stable colour per name); shows the photo instead when one is provided. */
export function InitialsAvatar({
  name,
  src,
  size = "md",
  onDark = false,
}: {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  /** Gold tile with navy letters, for use on the navy hero headers. */
  onDark?: boolean;
}) {
  const dims = size === "lg" ? "h-14 w-14 text-lg" : size === "sm" ? "h-8 w-8 text-[11px]" : "h-10 w-10 text-sm";
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?";
  const tone = onDark ? "bg-accent text-[#1E3A5F]" : AVATAR_TONES[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_TONES.length];
  if (src?.trim()) {
    return <img src={src} alt="" className={`${dims} shrink-0 rounded-xl object-cover ring-1 ring-line`} loading="lazy" />;
  }
  return (
    <span className={`${dims} ${tone} flex shrink-0 items-center justify-center rounded-xl font-semibold`} aria-hidden>
      {initials}
    </span>
  );
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-elev-2 text-fg-subtle">
        <Icon size={22} />
      </span>
      <p className="mt-3 text-sm font-semibold text-fg">{title}</p>
      {description && <p className="mt-1 max-w-sm text-xs text-fg-subtle">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingBlock({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2.5 py-16 text-sm text-fg-subtle">
      <Loader2 size={18} className="animate-spin text-primary" />
      {label}
    </div>
  );
}

export function Alert({ tone, children }: { tone: "error" | "success" | "warning" | "info"; children: ReactNode }) {
  const styles = {
    error: "border-red-200 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200",
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200",
    warning: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200",
    info: "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200",
  }[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}

/** Thin proportional bar used for "share of total" columns. */
export function ShareBar({ value, max, tone = "navy" }: { value: number; max: number; tone?: "navy" | "gold" }) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-elev-3">
      <div
        className={`h-full rounded-full ${tone === "gold" ? "bg-accent" : "bg-primary"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ─────────────────────────── Buttons ─────────────────────────── */

const BTN = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover shadow-sm",
  secondary: "border border-line-strong bg-surface text-fg hover:bg-elev-2",
  ghost: "text-fg-muted hover:bg-elev-2 hover:text-fg",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
  dangerSoft: "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20",
} as const;

export function btnClass(variant: keyof typeof BTN = "primary", size: "sm" | "md" = "md") {
  return `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-55 ${
    size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 text-sm"
  } ${BTN[variant]}`;
}

/* ─────────────────────────── Form fields ─────────────────────────── */

const FIELD =
  "h-11 w-full rounded-lg border bg-surface px-3.5 text-sm text-fg placeholder:text-fg-faint transition focus:outline-none focus:ring-4 disabled:opacity-60";

/** Kit field + label classes for raw <input>/<select>/<textarea> that can't use TextInput/Field. */
export const fieldClass = `${FIELD} border-line-strong focus:border-primary focus:ring-primary/10`;
export const fieldLabelClass = "mb-1.5 block text-[13px] font-medium text-fg";

function fieldBorder(error?: string) {
  return error
    ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
    : "border-line-strong focus:border-primary focus:ring-primary/10";
}

export function Field({
  label,
  required,
  hint,
  error,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[13px] font-medium text-fg">
        {label}
        {required && <span className="ml-0.5 text-red-600 dark:text-red-400">*</span>}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs text-red-700 dark:text-red-400">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-fg-subtle">{hint}</span>
      ) : null}
    </label>
  );
}

export function TextInput({
  icon: Icon,
  error,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { icon?: LucideIcon; error?: string }) {
  return (
    <span className="relative block">
      {Icon && (
        <Icon size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-faint" />
      )}
      <input
        {...props}
        aria-invalid={Boolean(error) || undefined}
        className={`${FIELD} ${fieldBorder(error)} ${Icon ? "pl-10" : ""} ${className}`}
      />
    </span>
  );
}

export function SelectInput({
  icon: Icon,
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { icon?: LucideIcon }) {
  return (
    <span className="relative block">
      {Icon && (
        <Icon size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-faint" />
      )}
      <select {...props} className={`${FIELD} ${fieldBorder()} ${Icon ? "pl-10" : ""} pr-9 ${className}`}>
        {children}
      </select>
    </span>
  );
}

/** Segmented control (2–4 options). */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className = "",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode }[];
  className?: string;
}) {
  return (
    <div role="radiogroup" className={`inline-flex rounded-xl border border-line bg-elev-2 p-1 ${className}`}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition ${
              active ? "bg-surface text-fg shadow-card" : "text-fg-subtle hover:text-fg"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Search box for page toolbars. */
export function SearchBox({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <span className={`relative block ${className}`}>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-faint"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`h-10 w-full rounded-lg border border-line-strong bg-surface pl-9 pr-3 text-sm text-fg placeholder:text-fg-faint focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10`}
      />
    </span>
  );
}

/* ─────────────────────────── Table ─────────────────────────── */

export function DataTable({ head, children, minWidth = 860 }: { head: ReactNode; children: ReactNode; minWidth?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        <thead className="border-b border-line bg-well text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
          {head}
        </thead>
        <tbody className="divide-y divide-line-subtle">{children}</tbody>
      </table>
    </div>
  );
}

const ALIGN = { left: "text-left", right: "text-right", center: "text-center" } as const;

export function Th({ children, align = "left", className = "" }: { children?: ReactNode; align?: keyof typeof ALIGN; className?: string }) {
  return <th className={`px-5 py-3 ${ALIGN[align]} ${className}`}>{children}</th>;
}

export function Td({ children, align = "left", className = "" }: { children?: ReactNode; align?: keyof typeof ALIGN; className?: string }) {
  return <td className={`px-5 py-3.5 align-middle ${ALIGN[align]} ${className}`}>{children}</td>;
}

export function TablePager({
  page,
  totalPages,
  total,
  pageSize,
  onChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onChange: (p: number) => void;
}) {
  if (total === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-line px-5 py-3 text-xs text-fg-subtle sm:flex-row">
      <span>
        Showing <span className="font-medium text-fg">{from}–{to}</span> of{" "}
        <span className="font-medium text-fg">{total}</span>
      </span>
      <div className="flex items-center gap-1.5">
        <button type="button" className={btnClass("secondary", "sm")} disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Previous
        </button>
        <span className="px-2 tabular-nums">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          className={btnClass("secondary", "sm")}
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────── Column-driven table ─────────────────────────── */

type KitColumn<T> = {
  header: string;
  accessor?: keyof T;
  align?: "left" | "center" | "right";
  render?: (row: T, index: number) => ReactNode;
};

/** Renders the existing `Column<T>[]` definitions (types/superadmin) in the kit's table style. */
export function ColumnsTable<T>({
  columns,
  data,
  rowKey,
  emptyText = "No records found",
  loading = false,
  minWidth = 860,
  onRowClick,
}: {
  columns: KitColumn<T>[];
  data: T[];
  rowKey?: (row: T, index: number) => string | number;
  emptyText?: string;
  loading?: boolean;
  minWidth?: number;
  onRowClick?: (row: T) => void;
}) {
  return (
    <DataTable
      minWidth={minWidth}
      head={
        <tr>
          {columns.map((c, i) => (
            <Th key={i} align={c.align ?? "left"}>
              {c.header}
            </Th>
          ))}
        </tr>
      }
    >
      {loading && data.length === 0 ? (
        <tr>
          <td colSpan={columns.length}>
            <LoadingBlock />
          </td>
        </tr>
      ) : data.length === 0 ? (
        <tr>
          <td colSpan={columns.length} className="px-5 py-14 text-center text-sm text-fg-subtle">
            {emptyText}
          </td>
        </tr>
      ) : (
        data.map((row, i) => (
          <tr
            key={rowKey ? rowKey(row, i) : ((row as { id?: string | number }).id ?? i)}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={`transition-colors hover:bg-elev-2 ${onRowClick ? "cursor-pointer" : ""}`}
          >
            {columns.map((c, j) => (
              <Td key={j} align={c.align ?? "left"}>
                {c.render ? c.render(row, i) : c.accessor ? String(row[c.accessor] ?? "—") : null}
              </Td>
            ))}
          </tr>
        ))
      )}
    </DataTable>
  );
}
