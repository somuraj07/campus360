"use client";

import { useCallback, useEffect, useState } from "react";
import PageHeader from "../../common/PageHeader";
import { Plus, Search } from "lucide-react";
import type { TeacherExam } from "./examComponents/examTypes";
import ExamCard from "./examComponents/ExamCard";
import ScheduleExamView from "./examComponents/ScheduleExamView";
import ExamDetailsView from "./examComponents/ExamDetailsView";
import TimellyLoader from "../../common/TimellyLoader";
import DeleteConfirmation from "../../common/DeleteConfirmation";
import { deleteExamSchedule } from "@/lib/api/examSchedules";
import {
  invalidateTeacherExamsList,
  loadTeacherExamsList,
  peekTeacherExamsList,
  setTeacherExamsListCache,
} from "@/lib/teacher/loadTeacherFastTabs";

type ViewState =
    | { mode: "list" }
    | { mode: "create" }
    | { mode: "edit"; examId: string }
    | { mode: "view"; examId: string };

export default function TeacherExamsTab() {
    const initial = peekTeacherExamsList();
    const [view, setView] = useState<ViewState>({ mode: "list" });
    const [exams, setExams] = useState<TeacherExam[]>(() => (Array.isArray(initial) ? (initial as TeacherExam[]) : []));
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(() => !initial);
    const [examToDelete, setExamToDelete] = useState<TeacherExam | null>(null);

    const loadExams = useCallback(async (revalidate = false) => {
        if (!revalidate) {
            const cached = peekTeacherExamsList();
            if (cached) {
                setExams(Array.isArray(cached) ? (cached as TeacherExam[]) : []);
                setLoading(false);
                void loadExams(true);
                return;
            }
        }

        setLoading((prev) => (exams.length === 0 ? true : prev));
        try {
            const list = await loadTeacherExamsList({ revalidate: true });
            setExams(Array.isArray(list) ? (list as TeacherExam[]) : []);
        } catch (error) {
            console.error("Failed to load exams:", error);
            if (exams.length === 0) setExams([]);
        } finally {
            setLoading(false);
        }
    }, [exams.length]);

    useEffect(() => {
        void loadExams(false);
    }, [loadExams]);

    const handleSaveSuccess = () => {
        setView({ mode: "list" });
        invalidateTeacherExamsList();
        void loadExams(true);
    };

    // Navigation Render Logic
    if (view.mode === "create") {
        return (
            <ScheduleExamView
                mode="create"
                onCancel={() => setView({ mode: "list" })}
                onSave={handleSaveSuccess}
            />
        );
    }

    if (view.mode === "edit") {
        return (
            <ScheduleExamView
                mode="edit"
                examId={view.examId}
                onCancel={() => setView({ mode: "list" })}
                onSave={handleSaveSuccess}
            />
        );
    }

    if (view.mode === "view") {
        return (
            <ExamDetailsView
                examId={view.examId}
                onBack={() => setView({ mode: "list" })}
                onEdit={() => setView({ mode: "edit", examId: view.examId })}
            />
        );
    }

    const filtered = exams.filter((e) => {
        const name = (e.name || "").toLowerCase();
        const classStr = e.class ? `${e.class.name || ""}-${e.class.section || ""}`.toLowerCase() : "";
        const subject = (e.subject || "").toLowerCase();
        const q = searchQuery.toLowerCase().trim();
        return name.includes(q) || classStr.includes(q) || subject.includes(q);
    });

    return (
        <div className="min-h-screen space-y-6 px-1 md:px-0 animate-in fade-in duration-500">
            {/* ENHANCED PAGE HEADER */}
            <PageHeader
                title="Exams & Syllabus"
                subtitle="Manage schedules and track syllabus coverage"
                rightSlot={
                    <button
                        onClick={() => setView({ mode: "create" })}
                        className="px-4 py-2.5 bg-primary hover:bg-primary-hover
                          text-on-primary font-bold rounded-xl transition-all
                          
                          flex items-center gap-2"
                    >
                        <Plus size={18} strokeWidth={3} /> Schedule Exam
                    </button>
                }
            />

            {/* REFINED SEARCH BAR SECTION */}
            <div className="relative mb-8  px-6 py-4 rounded-2xl  border border-line rounded-2xl p-4 flex items-center gap-4">

                <Search className="absolute h-4 w-6 left-10 top-1/2 -translate-y-1/2 text-fg-subtle " />

                <input

                    placeholder="Search exams by class or subject..."

                    value={searchQuery}

                    onChange={(e) => setSearchQuery(e.target.value)}

                    className="w-full pl-9 pr-4 py-2 bg-well 
                    border border-line rounded-xl focus:outline-none
                    focus:border-primary/50 text-sm text-fg placeholder:text-fg-faint transition-all"

                />

            </div>  

            {/* EXAM CARDS GRID */}
            {loading && exams.length === 0 ? (
                <TimellyLoader title="Loading exams" steps={["Schedules", "Syllabus", "Classes"]} />
            ) : (
                <>
                    {filtered.length === 0 ? (
                        <div className="rounded-2xl border border-line bg-elev-1 p-20 text-center">
                            <p className="text-fg-subtle">No exams found matching your search.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((exam) => (
                                <ExamCard
                                    key={exam.id}
                                    exam={exam}
                                    onView={() => setView({ mode: "view", examId: exam.id })}
                                    onEdit={() => setView({ mode: "edit", examId: exam.id })}
                                    onDelete={() => setExamToDelete(exam)}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            <DeleteConfirmation
                isOpen={!!examToDelete}
                userName={examToDelete?.name ?? "this exam"}
                title="Delete Exam"
                message="Do you really want to delete this exam schedule? This action cannot be undone."
                confirmLabel="Delete Exam"
                cancelLabel="Cancel"
                onCancel={() => setExamToDelete(null)}
                onConfirm={async () => {
                    if (!examToDelete) return;
                    const prev = exams;
                    const next = exams.filter((e) => e.id !== examToDelete.id);
                    setExams(next);
                    setTeacherExamsListCache(next);
                    setExamToDelete(null);
                    try {
                        const { ok, data } = await deleteExamSchedule(examToDelete.id);
                        if (!ok) {
                            setExams(prev);
                            setTeacherExamsListCache(prev);
                            throw new Error(data.message || "Failed to delete exam");
                        }
                        invalidateTeacherExamsList();
                        void loadExams(true);
                    } catch (err) {
                        throw err;
                    }
                }}
            />
        </div>
    );
}
