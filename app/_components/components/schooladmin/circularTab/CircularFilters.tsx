"use client";

import { Search, Users, GraduationCap } from "lucide-react";
import { IMPORTANCE_LEVELS } from "@/lib/constants";
import { useClasses } from "@/app/_components/hooks/useClasses";

const RECIPIENT_OPTIONS = [
  { value: "all", label: "All Recipients" },
  { value: "teachers", label: "Teachers" },
  { value: "parents", label: "Parents" },
  { value: "students", label: "Students" },
  { value: "staff", label: "Staff" },
];

interface Props {
  search: string;
  onSearch: (v: string) => void;
  importance: string;
  onImportance: (v: string) => void;
  recipient: string;
  onRecipient: (v: string) => void;
  classId: string;
  onClassId: (v: string) => void;
}

export default function CircularFilters({
  search,
  onSearch,
  importance,
  onImportance,
  recipient,
  onRecipient,
  classId,
  onClassId,
}: Props) {
  const { classes } = useClasses();

  return (
    <div className="bg-elev-1 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-line flex flex-col gap-3 sm:gap-4 w-full min-w-0 overflow-hidden">
      {/* Row 1: Search + Importance */}
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 w-full min-w-0">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-fg-subtle w-4 h-4 shrink-0 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by title or ref..."
            className="w-full min-w-0 pl-10 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl bg-well text-fg text-sm sm:text-base placeholder:text-fg-subtle focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {["All Importance", ...IMPORTANCE_LEVELS].map((opt) => {
            const isActive = importance === opt;
            return (
              <button
                key={opt}
                onClick={() => onImportance(opt)}
                className={`
                  px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap shrink-0
                  transition-all border
                  ${
                    isActive
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-elev-1 text-fg-muted border-line hover:bg-elev-3"
                  }
                `}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 2: Recipient + Class filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center border-t border-line pt-3 sm:pt-4">
        <div className="flex items-center gap-2 min-w-0 flex-1 sm:flex-initial">
          <Users className="w-4 h-4 text-fg-subtle shrink-0" />
          <span className="text-sm text-fg-muted shrink-0">Recipients:</span>
          <select
            value={recipient}
            onChange={(e) => onRecipient(e.target.value)}
            className="flex-1 sm:flex-initial min-w-0 max-w-full sm:max-w-[180px] px-3 py-2 rounded-xl bg-well text-fg text-sm border border-line focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            {RECIPIENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-surface text-fg">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 min-w-0 flex-1 sm:flex-initial">
          <GraduationCap className="w-4 h-4 text-fg-subtle shrink-0" />
          <span className="text-sm text-fg-muted shrink-0">Class:</span>
          <select
            value={classId}
            onChange={(e) => onClassId(e.target.value)}
            className="flex-1 sm:flex-initial min-w-0 max-w-full sm:max-w-[200px] px-3 py-2 rounded-xl bg-well text-fg text-sm border border-line focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            <option value="" className="bg-surface text-fg">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id} className="bg-surface text-fg">
                {c.name}{c.section ? ` - ${c.section}` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
