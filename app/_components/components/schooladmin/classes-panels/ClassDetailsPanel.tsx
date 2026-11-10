"use client";

import { Eye, X } from "lucide-react";

type ClassRow = {
  id: string;
  name: string;
  section: string;
  students: number;
  teacher: string;
  subject: string;
};

interface ClassDetailsPanelProps {
  row: ClassRow;
  onClose: () => void;
}

export default function ClassDetailsPanel({
  row,
  onClose,
}: ClassDetailsPanelProps) {
  const shortSection = row.section.replace("Section ", "");

  const cards = [
    { label: "Class Teacher", value: row.teacher, strong: true },
    { label: "Total Students", value: String(row.students) },
    { label: "Subject Focus", value: row.subject || "—" },
  ];
  return (
    <div className="animate-fadeIn px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Eye size={16} />
          </span>
          <h3 className="text-sm font-semibold text-fg">
            Class Details: {row.name} - {shortSection}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-fg-subtle transition hover:bg-elev-3 hover:text-fg"
          aria-label="Close class details"
        >
          <X size={16} />
        </button>
      </div>
      <dl className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-line bg-surface p-3.5">
            <dt className="text-xs text-fg-subtle">{c.label}</dt>
            <dd className={`mt-1 truncate text-sm font-semibold ${c.strong ? "text-primary" : "text-fg"}`}>{c.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
