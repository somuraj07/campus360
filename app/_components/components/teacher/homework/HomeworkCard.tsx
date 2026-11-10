"use client";

import {
  BookOpen,
  ChevronDown,
  Pencil,
  Trash2,
  FileText,
} from "lucide-react";
import type { HomeworkItem } from "./types";

type Props = {
  homework: HomeworkItem;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewSubmissions?: () => void;
};




export default function HomeworkCard({
  homework: h,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onViewSubmissions,
}: Props) {
  const totalStudents = h.class?._count?.students ?? 0;
  const submitted = h._count?.submissions ?? 0;
  const pending = Math.max(0, totalStudents - submitted);
  const progress = totalStudents > 0 ? (submitted / totalStudents) * 100 : 0;
  const now = new Date().toISOString();
  const isActive = h.dueDate ? h.dueDate >= now : true;

  return (
    <div
      className={`bg-elev-1 border-b border-line rounded-2xl transition-all duration-300 ${
        isExpanded ? "ring-1 ring-line-strong" : ""
      }`}
    >
      <div
        className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer"
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
      >
        <div className="flex gap-4 items-center w-full md:w-auto">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 shadow-inner">
            <BookOpen className="text-primary" size={20} />
          </div>
          <div className="overflow-hidden min-w-0">
            <p className="text-[10px] md:text-xs text-fg-subtle uppercase tracking-widest truncate">
              {h.class?.name}
              {h.class?.section ? `-${h.class.section}` : ""} • {h.subject}
            </p>
            <h3 className="text-base md:text-lg font-semibold truncate">{h.title}</h3>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4 md:gap-8 w-full md:w-auto border-t border-line-subtle pt-4 md:pt-0 md:border-t-0">
          <div className="text-xs md:text-sm">
            <p className="text-fg-subtle text-[10px] md:text-xs uppercase">Submissions</p>
            <p className="text-primary font-bold">
              {submitted} / {totalStudents || "—"}
            </p>
          </div>

          <div className="text-xs md:text-sm text-right md:text-left">
            <p className="text-fg-subtle text-[10px] md:text-xs uppercase">Due Date</p>
            <p className="font-medium">
              {h.dueDate ? new Date(h.dueDate).toLocaleDateString() : "—"}
            </p>
          </div>

          <div className="hidden sm:block">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase ${
                isActive
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-elev-2 text-fg-muted border-line-strong"
              }`}
            >
              {isActive ? "Active" : "Closed"}
            </span>
          </div>

          <div
            className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            aria-hidden
          >
            <ChevronDown className="text-fg-subtle" />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 md:px-6 pb-6 border-t border-line pt-6 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-elev-1 hover:bg-elev-3 border border-line-strong hover:border-line-strong flex items-center justify-center gap-2 text-sm transition-all shadow-sm text-fg"
                >
                  <Pencil size={16} /> Edit
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-700 dark:text-red-400 flex items-center justify-center gap-2 text-sm transition-all shadow-sm"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>

              <div className="bg-well rounded-xl p-4 border border-line-subtle">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-fg">
                  <FileText size={16} className="text-primary" /> Description
                </h4>
                <p className="text-fg-muted text-sm leading-relaxed">
                  {h.description || "No description provided."}
                </p>
              </div>

              {h.file && (
                <a
                  href={h.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-elev-1 rounded-xl p-4 flex items-center gap-3 border border-line-subtle hover:bg-elev-3 transition-colors cursor-pointer group"
                >
                  <FileText className="text-fg-subtle group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium text-fg truncate">
                    View attachment
                  </span>
                </a>
              )}
            </div>
            <div className="bg-well rounded-xl p-5 space-y-4 border border-line-subtle">
              <h4 className="text-[10px] font-semibold text-fg-subtle uppercase tracking-[0.2em]">
                Submission Status
              </h4>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-fg-muted">Completion</span>
                  <span className="text-primary font-bold">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-elev-1 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="text-center flex-1 border-r border-line-subtle">
                    <p className="text-[10px] text-fg-subtle uppercase">Submitted</p>
                    <p className="text-lg font-bold text-fg">{submitted}</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-[10px] text-fg-subtle uppercase">Pending</p>
                    <p className="text-lg font-bold text-orange-700 dark:text-orange-400">{pending}</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewSubmissions?.();
                }}
                className="block w-full py-3.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-bold text-sm transition-all active:scale-95 border border-primary/20 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!onViewSubmissions}
              >
                View All Submissions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
