"use client";

import React from 'react';
import type { TeacherExam } from "./examTypes";
import { Calendar, Clock, Pencil, Trash2, EyeIcon } from "lucide-react";

interface ExamCardProps {
  exam: TeacherExam;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ExamCard({ exam, onView, onEdit, onDelete }: ExamCardProps) {
  // Logic for dynamic status colors to match the UI screenshots
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming': return 'bg-primary/10 text-primary border-primary/20';
      case 'completed': return 'text-fg-muted bg-elev-2 border-line-strong';
      case 'draft': return 'text-amber-600 dark:text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-fg bg-elev-2 border-line';
    }
  };

  const coverage =
    !exam.syllabus || exam.syllabus.length === 0
      ? 0
      : Math.min(100, Math.max(0, Math.round(
          exam.syllabus.reduce((s: number, x) => s + (Number(x.completedPercent) || 0), 0) /
          exam.syllabus.length
        )));

  const statusLabel = typeof exam.status === "string"
    ? exam.status.charAt(0).toUpperCase() + exam.status.slice(1).toLowerCase()
    : exam.status;

  return (
    <div className="bg-elev-1 border border-line 
    rounded-2xl p-6 flex flex-col shadow-card
     w-full transition-transform hover:scale-[1.01]
     rounded-2xl p-6 hover:bg-elev-2 transition-all group border 
     border-line-subtle hover:border-primary/30 flex flex-col h-full">
      
      {/* HEADER: Status Badge and Top Actions */}
      <div className="flex justify-between items-start">
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${getStatusStyles(exam.status)}`}>
          {statusLabel}
        </span>
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-1.5 hover:bg-elev-3 rounded-lg text-fg-subtle hover:text-fg transition-colors">
            <Pencil size={16} />
          </button>
          <button onClick={onDelete} className="p-1.5 hover:bg-red-500/20 rounded-lg text-fg-subtle hover:text-red-700 dark:hover:text-red-400 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* EXAM INFO */}
      <h3 className={`text-lg font-bold text-fg mb-1 group-hover:text-primary transition-colors ${exam.status.toLowerCase() === 'upcoming' ? 'text-primary' : 'text-fg'}`}>
        {exam.name}
      </h3>
      <p className="text-fg-muted text-sm mb-4">
        Class {exam.class?.name ?? ""}{exam.class?.section != null ? `-${exam.class.section}` : ""}{exam.subject ? ` • ${exam.subject}` : ""}
      </p>

      {/* SCHEDULE DETAILS */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 text-fg-muted">
          <Calendar className="lucide lucide-calendar w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{exam.date}</span>
        </div>
        <div className="flex items-center gap-3 text-fg-muted">
          <Clock className=" w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{exam.time} <span className="text-fg-faint ml-1">({exam.duration})</span></span>
        </div>
      </div>

      {/* SYLLABUS PROGRESS */}
      <div className="mt-4 pt-4 border-t border-line">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-fg-muted font-medium uppercase tracking-wider">Syllabus Coverage</span>
          <span className="text-xs font-bold text-fg">{coverage}%</span>
        </div>
        <div className="h-1.5 bg-elev-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(180,255,57,0.4)]"
            style={{ width: `${coverage}%` }}
          />
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="grid grid-cols-2 gap-3 mt-8">
        <button 
          onClick={onEdit} 
          className="flex-1 py-2.5 bg-primary/10 hover:bg-primary/20 border
           border-primary/20 rounded-xl text-sm font-bold 
          text-primary transition-all flex items-center justify-center gap-2"
        >
          <Pencil size={14} /> Edit Details
        </button>
        <button 
          onClick={onView} 
          className="flex-1 py-2.5 bg-elev-1 hover:bg-elev-3 
          border border-line rounded-xl text-sm font-bold text-fg-muted hover:text-fg 
          transition-all flex items-center justify-center gap-2"
        >
          <EyeIcon size={14} /> View Details
        </button>
      </div>
    </div>
  );
}