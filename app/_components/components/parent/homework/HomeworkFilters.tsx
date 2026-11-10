'use client';

import {
  Funnel,
  List,
  Clock,
  CheckCircle,
  AlertTriangle,
  BookOpen,
} from "lucide-react";

interface HomeworkFiltersProps {
  subject: string;
  status: string;
  onSubjectChange: (subject: string) => void;
  onStatusChange: (status: string) => void;
  filteredCount: number;
  availableSubjects: string[];
}

export default function HomeworkFilters({
  subject,
  status,
  onSubjectChange,
  onStatusChange,
  filteredCount,
  availableSubjects,
}: HomeworkFiltersProps) {
  const statusOptions = [
    { label: "All", icon: List },
    { label: "Pending", icon: Clock },
    { label: "Submitted", icon: CheckCircle },
    { label: "Late", icon: AlertTriangle },
  ];

  return (
    <section className="rounded-2xl p-6 lg:p-7 space-y-6 bg-elev-1 border border-line">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Filter Homework</h3>
          <p className="text-sm text-fg-muted">
            Find assignments quickly
          </p>
        </div>

        <span className="self-start sm:self-auto rounded-full border border-primary/30 px-4 py-2 text-sm text-primary">
          {filteredCount} Results
        </span>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Subject Filter */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-fg-muted mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Select Subject
          </label>

          <select
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="w-full rounded-xl px-4 py-3 
               somu text-fg 
               border border-line-strong 
               outline-none focus:border-primary 
               transition appearance-none"
          >
            <option value="All Subjects" className="bg-surface text-fg">
              All Subjects
            </option>

            {availableSubjects.map((subj) => (
              <option
                key={subj}
                value={subj}
                className="bg-surface text-fg"
              >
                {subj}
              </option>
            ))}
          </select>
        </div>
        {/* Status Filter */}
        <div className="lg:col-span-3">
          <label className="block text-sm font-semibold text-fg-muted mb-2 flex items-center gap-2">
            <Funnel className="w-4 h-4 text-primary" />
            Filter by Status
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {statusOptions.map(({ label, icon: Icon }) => {
              const isActive = status === label;

              return (
                <button
                  key={label}
                  onClick={() => onStatusChange(label)}
                  className={`flex flex-col items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium transition-all border somu
                    ${isActive
                      ? "bg-primary/10  border-primary text-primary "
                      : "border-line-strong text-fg-muted hover:border-line-strong hover:bg-elev-2"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}