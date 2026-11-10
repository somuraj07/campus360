"use client";

import { BookOpen, Calendar, CalendarClock, CheckCircle2, Hourglass, Layers } from "lucide-react";
import TimellyLoader from "../../common/TimellyLoader";
import { SaPage, SaPageHeader, KpiGrid, KpiCard, Panel, Field, SelectInput, Badge, EmptyState } from "../../common/ui";
import { useExamsTabState } from "./shared";
import { ExamTypesManager } from "./shared";
import { SubjectsManager } from "./shared";

export default function ExamsTab() {
    const {
        examTypes,
        examTypesLoading,
        newExamType,
        setNewExamType,
        examTypeError,
        examTypeSaving,
        sectionError,
        subjectMaxByExam,
        setSubjectMaxByExam,
        subjectPartsByKey,
        setSubjectPartsByKey,
        subjectConfigSavingFor,
        subjectConfigMessage,
        openExamType,
        setOpenExamType,
        saveSubjectParts,
        removedByExam,
        deleteSubjectFromExam,
        restoreSubjectOnExam,
        subjects,
        subjectsLoading,
        newSubject,
        setNewSubject,
        subjectError,
        setSubjectError,
        subjectSaving,
        editingSubject,
        setEditingSubject,
        editingSubjectValue,
        setEditingSubjectValue,
        classes,
        selectedClassId,
        setSelectedClassId,
        selectedTermName,
        setSelectedTermName,
        selectedSubject,
        setSelectedSubject,
        loading,
        showAllSchedules,
        setShowAllSchedules,
        deleteExamType,
        addExamType,
        deleteSubject,
        renameSubject,
        addSubject,
        uniqueTerms,
        isTermCompleted,
        activeSchedules,
        activeSubjects,
        activeTermData,
        nextExamDate,
        daysLeft,
    } = useExamsTabState();

    if (loading)
        return (
            <TimellyLoader
                title="Loading exams"
                steps={["Terms", "Schedules", "Subjects"]}
            />
        );

    return (
        <SaPage>
            <SaPageHeader
                eyebrow="Academics"
                title="Exams & Syllabus"
                description={selectedTermName ? `Viewing details for ${selectedTermName}` : "Exam types, subjects, schedules and syllabus progress"}
                actions={<Badge tone={isTermCompleted ? "navy" : "green"} dot>{isTermCompleted ? "Term completed" : "Active term"}</Badge>}
            />

            <KpiGrid>
                <KpiCard
                    label="Next Exam"
                    value={nextExamDate ? nextExamDate.toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "--"}
                    icon={CalendarClock}
                    hint={selectedTermName || "No term selected"}
                />
                <KpiCard label="Days Left" value={daysLeft} icon={Hourglass} tone="gold" hint="Until the next exam" />
                <KpiCard label="Terms" value={uniqueTerms.length} icon={Layers} tone="sky" hint="For the selected class" />
                <KpiCard label="Subjects" value={activeSubjects.length} icon={BookOpen} tone="green" hint="In the selected term" />
            </KpiGrid>

            <ExamTypesManager
                examTypesLoading={examTypesLoading}
                examTypes={examTypes}
                newExamType={newExamType}
                onNewExamTypeChange={setNewExamType}
                onAddExamType={addExamType}
                examTypeSaving={examTypeSaving}
                examTypeError={examTypeError}
                sectionError={sectionError}
                subjectConfigMessage={subjectConfigMessage}
                onDeleteExamType={deleteExamType}
                openExamType={openExamType}
                onOpenExamTypeChange={setOpenExamType}
                subjects={subjects}
                removedByExam={removedByExam}
                subjectMaxByExam={subjectMaxByExam}
                onSubjectMaxChange={(rowKey, value) =>
                    setSubjectMaxByExam((prev) => ({ ...prev, [rowKey]: value }))
                }
                subjectPartsByKey={subjectPartsByKey}
                onSubjectPartsChange={(rowKey, update) =>
                    setSubjectPartsByKey((prev) => ({ ...prev, [rowKey]: update(prev[rowKey] ?? []) }))
                }
                subjectConfigSavingFor={subjectConfigSavingFor}
                subjectSaving={subjectSaving}
                onSaveSubject={saveSubjectParts}
                onRemoveSubjectFromExam={deleteSubjectFromExam}
                onRestoreSubjectOnExam={restoreSubjectOnExam}
                editing={{
                    editingSubject,
                    onEditingSubjectChange: setEditingSubject,
                    editingSubjectValue,
                    onEditingSubjectValueChange: setEditingSubjectValue,
                    onRenameSubject: renameSubject,
                    onSubjectErrorChange: setSubjectError,
                }}
            />

            <SubjectsManager
                newSubject={newSubject}
                onNewSubjectChange={setNewSubject}
                onAddSubject={addSubject}
                subjectSaving={subjectSaving}
                subjectError={subjectError}
                onSubjectErrorChange={setSubjectError}
                subjectsLoading={subjectsLoading}
                subjects={subjects}
                editingSubject={editingSubject}
                onEditingSubjectChange={setEditingSubject}
                editingSubjectValue={editingSubjectValue}
                onEditingSubjectValueChange={setEditingSubjectValue}
                onRenameSubject={renameSubject}
                onDeleteSubject={deleteSubject}
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4 xl:col-span-3">
                    <Panel title="Class & Term" icon={Layers} bodyClassName="space-y-4 p-4">
                        <Field label="Class">
                            <SelectInput
                                value={selectedClassId ?? ""}
                                onChange={(e) => {
                                    const id = e.target.value || null;
                                    setSelectedClassId(id);
                                    setSelectedTermName(""); // reset term selection
                                    setSelectedSubject("all");
                                }}
                            >
                                <option value="">All Classes</option>
                                {classes.map((cls) => (
                                    <option key={cls.id} value={cls.id}>
                                        {cls.name} {cls.section}
                                    </option>
                                ))}
                            </SelectInput>
                        </Field>

                        <div className="flex flex-col gap-2">
                            {uniqueTerms.length === 0 && <p className="text-xs text-fg-subtle">No exam terms yet.</p>}
                            {uniqueTerms.map((term) => {
                                const active = selectedTermName === term.name;
                                return (
                                    <button
                                        key={term.name}
                                        type="button"
                                        aria-pressed={active}
                                        onClick={() => {
                                            setSelectedTermName(term.name);
                                            setSelectedSubject("all");
                                            setShowAllSchedules(false);
                                        }}
                                        className={`flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left transition ${
                                            active ? "border-primary bg-primary/10" : "border-line bg-surface hover:bg-elev-2"
                                        }`}
                                    >
                                        <span className="text-sm font-medium capitalize text-fg">{term.name} Examination</span>
                                        <Badge tone={term.status === "UPCOMING" ? "sky" : "navy"}>
                                            {String(term.status).toLowerCase()}
                                        </Badge>
                                    </button>
                                );
                            })}
                        </div>
                    </Panel>

                    <Panel title="Schedule" icon={Calendar} bodyClassName="space-y-2.5 p-4">
                        {activeSchedules.length === 0 && <p className="text-xs text-fg-subtle">No exams scheduled.</p>}
                        {(showAllSchedules ? activeSchedules : activeSchedules.slice(0, 3)).map((exam) => (
                            <div key={exam.id} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3">
                                <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <span className="text-base font-semibold leading-none">{new Date(exam.examDate).getDate()}</span>
                                    <span className="text-[9px] font-semibold uppercase">
                                        {new Date(exam.examDate).toLocaleString("default", { month: "short" })}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <p className="break-words text-sm font-medium capitalize text-fg">{exam.subject}</p>
                                    <p className="text-xs text-fg-subtle">{exam.startTime}</p>
                                </div>
                            </div>
                        ))}
                        {activeSchedules.length > 3 && (
                            <button
                                type="button"
                                onClick={() => setShowAllSchedules(!showAllSchedules)}
                                className="w-full pt-1 text-center text-xs font-semibold text-primary hover:underline"
                            >
                                {showAllSchedules ? "Show less" : `View all ${activeSchedules.length}`}
                            </button>
                        )}
                    </Panel>
                </div>

                {/* RIGHT SIDE: SUBJECTS & SYLLABUS */}
                <div className="space-y-5 lg:col-span-8 xl:col-span-9">
                    {isTermCompleted ? (
                        <Panel bodyClassName="p-0">
                            <EmptyState
                                icon={CheckCircle2}
                                title="Examination Completed"
                                description={`All syllabus and exams for ${selectedTermName} have been concluded.`}
                            />
                        </Panel>
                    ) : (
                        <>
                            {/* SUBJECT FILTER */}
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                                <button
                                    onClick={() => setSelectedSubject("all")}
                                    className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${selectedSubject === "all" ? "bg-primary text-on-primary" : "border border-line bg-surface text-fg-muted hover:bg-elev-2"
                                        }`}
                                >
                                    All Subjects
                                </button>
                                {activeSubjects.map((sub) => (
                                    <button
                                        key={sub}
                                        onClick={() => setSelectedSubject(sub)}
                                        className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all capitalize ${selectedSubject === sub ? "bg-primary text-on-primary" : "border border-line bg-surface text-fg-muted hover:bg-elev-2"
                                            }`}
                                    >
                                        {sub}
                                    </button>
                                ))}
                            </div>

                            {/* SYLLABUS ITEMS */}
                            {(selectedSubject === "all" ? activeSubjects : [selectedSubject]).map((subName) => {
                                const syllabusItem = activeTermData.flatMap((t) => t.syllabus).find((s) => s.subject === subName);
                                if (!syllabusItem) return null;

                                const unitCount = syllabusItem.units.length;
                                const calculatedProgress = unitCount > 0
                                    ? Math.round(syllabusItem.units.reduce((acc, u) => acc + u.completedPercent, 0) / unitCount)
                                    : syllabusItem.completedPercent;

                                return (
                                    <div key={subName} className="rounded-2xl border border-line bg-elev-1 p-5 sm:p-6">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                                                    <BookOpen className="text-primary" size={20} />
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-semibold capitalize text-fg">{subName}</h2>
                                                    {activeTermData[0]?.class?.teacher?.name && (
                                                        <div className="flex items-center gap-2 text-fg-subtle text-xs">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-elev-3"></span>
                                                            <span>{activeTermData[0].class.teacher.name}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="w-full md:w-auto">
                                                <div className="flex justify-between md:justify-end items-center gap-3 mb-2">
                                                    <span className="text-[10px] text-fg-subtle uppercase font-bold tracking-widest">
                                                        Completion
                                                    </span>
                                                    <span className="text-lg font-bold">{calculatedProgress}%</span>
                                                </div>
                                                <div className="w-full md:w-40 h-1.5 bg-elev-2 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-primary h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${calculatedProgress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {syllabusItem.units.map((unit) => (
                                                <div
                                                    key={unit.id}
                                                    className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface p-3.5"
                                                >
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <div
                                                            className={`w-2 h-2 shrink-0 rounded-full ${unit.completedPercent === 100 ? "bg-primary" : "bg-sky-500"
                                                                }`}
                                                        />
                                                        <span className="min-w-0 break-words text-sm font-medium text-fg">{unit.unitName}</span>
                                                    </div>
                                                    {unit.completedPercent === 100 ? (
                                                        <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">
                                                            <CheckCircle2 size={12} className="text-primary" />
                                                            <span className="text-[10px] font-bold text-primary uppercase">Done</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-bold text-fg-faint uppercase">
                                                                {unit.completedPercent}%
                                                            </span>
                                                            <div className="w-10 h-1 bg-elev-2 rounded-full overflow-hidden">
                                                                <div className="h-full bg-sky-500" style={{ width: `${unit.completedPercent}%` }} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            </div>
        </SaPage>
    );
}
