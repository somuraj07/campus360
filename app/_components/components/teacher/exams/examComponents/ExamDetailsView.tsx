"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, Calendar, Clock, CheckCircle2, Pencil, LayoutGrid } from "lucide-react";
import { fetchExamScheduleDetail } from "@/lib/api/examSchedules";
import type { TeacherExam } from "./examTypes";
import PageHeader from "../../../common/PageHeader";
import TimellyLoader from "../../../common/TimellyLoader";

export default function ExamDetailsView({
  examId,
  onBack,
  onEdit,
}: {
  examId: string;
  onBack: () => void;
  onEdit?: () => void;
}) {
  const [exam, setExam] = useState<TeacherExam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDetails() {
      setLoading(true);
      try {
        const { ok, data } = await fetchExamScheduleDetail(examId);
        if (ok && data.exam) setExam(data.exam as TeacherExam);
        else setExam(null);
      } catch {
        setExam(null);
      } finally {
        setLoading(false);
      }
    }
    if (examId) getDetails();
  }, [examId]);

  if (loading) {
    return (
      <TimellyLoader title="Loading exam" steps={["Schedule", "Subjects", "Details"]} />
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen text-fg pb-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-fg-subtle hover:text-fg transition-colors mb-6 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm uppercase tracking-widest">Back to Exams</span>
        </button>
        <p className="text-fg-muted">Exam not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-fg pb-10 animate-in fade-in duration-500">
      <div className="px-1 md:px-0 mb-4">
        <PageHeader
          title={exam?.name || "Exam Details"}
          subtitle="Detailed breakdown of schedule and syllabus progress"
          icon={<CheckCircle2 className="text-primary" size={28} />}
        />
      </div>

      <button onClick={onBack} className="flex items-center gap-2 text-fg-muted hover:text-fg transition-colors mb-4 group">
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm uppercase tracking-widest font-bold">Back to Exams</span>
      </button>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-1 md:px-0">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="somu rounded-[1rem] p-8 flex flex-col gap-8 h-fit">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-fg leading-tight">Exam Details</h2>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border bg-primary/10 text-primary border-primary/20">
                {exam?.status ? String(exam.status).charAt(0).toUpperCase() + String(exam.status).slice(1).toLowerCase() : ""}
              </span>
            </div>

            <div className="space-y-3">
              <div className="bg-well border border-line rounded-xl p-3.5 flex items-center gap-4 transition-all">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-fg-muted uppercase tracking-wider">Date</p>
                  <p className="text-sm text-fg">{exam?.date}</p>
                </div>
              </div>

              <div className="bg-well border border-line rounded-xl p-3.5 flex items-center gap-4 transition-all">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-fg-muted uppercase tracking-wider">Time</p>
                  <p className="text-sm text-fg">{exam?.time} ({exam?.duration})</p>
                </div>
              </div>

              <div className="bg-well border border-line rounded-xl p-3.5 flex items-center gap-4 transition-all">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <LayoutGrid className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-fg-muted uppercase tracking-wider">Class & Subject</p>
                  <p className="text-sm text-fg">
                    {exam?.class?.name != null || exam?.class?.section != null
                      ? `Class ${exam?.class?.name ?? ""}${exam?.class?.section != null ? `-${exam.class.section}` : ""}`
                      : "-"}
                    {exam?.subject ? ` | ${exam.subject}` : ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-end mb-3">
                <p className="text-xs font-medium text-fg-muted uppercase tracking-wider">Total Coverage</p>
                <span className="text-lg font-bold text-primary">
                  {Math.min(100, Math.max(0, Number(exam?.totalCoverage) || 0))}%
                </span>
              </div>
              <div className="h-2 w-full bg-elev-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary shadow-[0_0_20px_rgba(180,255,57,0.5)] transition-all duration-1000"
                  style={{ width: `${Math.min(100, Math.max(0, Number(exam?.totalCoverage) || 0))}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={onEdit}
            className="w-full px-4 py-3 bg-primary hover:bg-primary-hover text-on-primary rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            <Pencil size={18} />
            Edit Exam Details
          </button>
        </div>

        <div className="lg:col-span-8 bg-elev-1 border-b border-line rounded-[1rem] flex flex-col overflow-hidden shadow-card">
          <div className="p-6 border-b border-line flex items-center gap-4">
            <CheckCircle2 className="text-primary" size={24} />
            <h2 className="text-lg font-bold text-fg flex items-center gap-2">Syllabus Breakdown</h2>
          </div>

          <div className="p-6 space-y-4 overflow-y-auto max-h-[850px] custom-scrollbar">
            {Array.isArray(exam?.syllabus) && exam.syllabus.length > 0 ? (
              exam.syllabus.map((unit, idx) => {
                const pct = Math.min(100, Math.max(0, Number(unit.completedPercent) || 0));
                return (
                  <div key={idx} className="bg-elev-1 border border-line-subtle rounded-xl p-4 flex flex-col gap-4 transition-all hover:bg-elev-3">
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-full bg-elev-1 border border-line flex items-center justify-center text-fg-muted text-xs font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="text-sm text-fg tracking-tight font-medium">{unit.subject ?? "Unit"}</h3>
                          <span className="text-base font-semibold text-fg">{pct}%</span>
                        </div>
                        <p className={`text-[10px] uppercase tracking-[0.2em] ${pct === 100 ? "text-primary" : pct > 0 ? "text-yellow-700 dark:text-yellow-400" : "text-red-600 dark:text-red-500"}`}>
                          {pct === 100 ? "COMPLETED" : pct > 0 ? "PARTIAL" : "PENDING"}
                        </p>
                      </div>
                    </div>
                    <div className="relative h-1 w-full bg-elev-1 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(180,255,57,0.4)] ${pct === 100 ? "bg-primary" : pct > 0 ? "bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)]" : "bg-red-400"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-end">
                      <p className="text-[10px] text-fg-faint uppercase tracking-widest">Complete</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-fg-subtle text-sm py-6">No syllabus units tracked for this exam yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
