"use client";

import { Banknote, CalendarDays, Smartphone } from "lucide-react";

type CollectionRow = {
  formattedAmount: string;
  count: number;
};

type Props = {
  selectedDate: string;
  onDateChange: (ymd: string) => void;
  totalFormatted: string;
  cash: CollectionRow;
  online: CollectionRow;
  loading?: boolean;
};

/** Day collection: total for the picked date, split into cash and online. */
export function CollectionStatCard({ selectedDate, onDateChange, totalFormatted, cash, online, loading = false }: Props) {
  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-elev-1 transition-opacity ${loading ? "opacity-60" : ""}`}
    >
      <div className="relative bg-sidebar px-5 pb-5 pt-4 text-white">
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-accent" />
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/65">Day Collection</p>
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/10 px-2 py-1 text-xs font-medium text-white hover:bg-white/15">
            <CalendarDays size={14} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-[7.4rem] bg-transparent text-xs text-white outline-none [color-scheme:dark]"
              aria-label="Select collection date"
            />
          </label>
        </div>
        <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">{totalFormatted}</p>
      </div>
      <dl className="grid flex-1 grid-cols-2 divide-x divide-line-subtle">
        <div className="p-4">
          <dt className="flex items-center gap-1.5 text-xs text-fg-subtle">
            <Banknote size={14} /> Cash
          </dt>
          <dd className="mt-1 text-lg font-semibold text-fg tabular-nums">{cash.formattedAmount}</dd>
          <dd className="text-xs text-fg-subtle">{cash.count} paid</dd>
        </div>
        <div className="p-4">
          <dt className="flex items-center gap-1.5 text-xs text-fg-subtle">
            <Smartphone size={14} /> Online
          </dt>
          <dd className="mt-1 text-lg font-semibold text-fg tabular-nums">{online.formattedAmount}</dd>
          <dd className="text-xs text-fg-subtle">{online.count} paid</dd>
        </div>
      </dl>
    </div>
  );
}
