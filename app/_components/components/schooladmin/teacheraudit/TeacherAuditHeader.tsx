"use client";

import { Search, Calendar, FileText, Plus } from "lucide-react";
import { SaPageHeader, TextInput, Badge, btnClass } from "../../common/ui";

function getCurrentAcademicYearStart(): number {
  const now = new Date();
  return now.getMonth() >= 5 ? now.getFullYear() : now.getFullYear() - 1;
}

function makeAcademicYears(startYear = getCurrentAcademicYearStart()) {
  return Array.from({ length: 4 }, (_, index) => {
    const year = startYear - index;
    const value = `${year}-${year + 1}`;
    return { value, label: value };
  });
}

const DEFAULT_ACADEMIC_YEARS = makeAcademicYears();

function getNextAcademicYear(currentYears: { value: string }[]): string {
  let maxStart = getCurrentAcademicYearStart();
  for (const y of currentYears) {
    const m = y.value.match(/^(\d{4})-(\d{4})$/);
    if (m) maxStart = Math.max(maxStart, parseInt(m[1], 10));
  }
  return `${maxStart + 1}-${maxStart + 2}`;
}

interface TeacherAuditHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  academicYear: string;
  onAcademicYearChange: (value: string) => void;
  academicYears: { value: string; label: string }[];
  onAddAcademicYear?: (newYear: string) => void;
  recordCount: number;
  onSearchSubmit?: () => void;
  placeholder?: string;
}

export default function TeacherAuditHeader({
  searchValue,
  onSearchChange,
  academicYear,
  onAcademicYearChange,
  academicYears,
  onAddAcademicYear,
  recordCount,
  onSearchSubmit,
  placeholder = "Search teacher...",
}: TeacherAuditHeaderProps) {
  const years = academicYears.length > 0 ? academicYears : DEFAULT_ACADEMIC_YEARS;

  const handleNewYear = () => {
    const nextYear = getNextAcademicYear(years);
    if (!years.some((y) => y.value === nextYear)) {
      onAddAcademicYear?.(nextYear);
    }
    onAcademicYearChange(nextYear);
  };
  return (
    <div className="space-y-5">
      <SaPageHeader
        eyebrow="Staff"
        title="Teacher Audit & Appraisal"
        description="Track performance, acknowledge achievements, and identify areas for improvement."
        actions={
          <TextInput
            icon={Search}
            type="search"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearchSubmit?.()}
            placeholder={placeholder}
            aria-label="Search teacher"
            className="h-10 md:w-72"
          />
        }
      />

      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-elev-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-2 text-[13px] font-medium text-fg-subtle">
            <Calendar size={15} className="text-primary" />
            Academic year
          </span>
          {years.map((y) => {
            const active = academicYear === y.value;
            return (
              <button
                key={y.value}
                type="button"
                aria-pressed={active}
                onClick={() => onAcademicYearChange(y.value)}
                className={btnClass(active ? "primary" : "secondary", "sm")}
              >
                {y.label}
              </button>
            );
          })}
          <button type="button" onClick={handleNewYear} className={btnClass("ghost", "sm")}>
            <Plus size={14} />
            New Year
          </button>
        </div>
        <Badge tone="navy">
          <FileText size={13} />
          {recordCount} record{recordCount !== 1 ? "s" : ""}
        </Badge>
      </div>
    </div>
  );
}
