"use client";

import { useMemo, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { createHomework, updateHomework } from "@/lib/api/homework";
import useHomeworkPage from "./useHomeworkPage";
import HomeworkForm from "./HomeworkForm";
import HomeworkStats from "./HomeworkStats";
import HomeworkFilterBar from "./HomeworkFilterBar";
import HomeworkList from "./HomeworkList";
import HomeworkSubmissionsView from "./HomeworkSubmissionsView";
import TimellyLoader from "../../common/TimellyLoader";
import { SaPage, SaPageHeader, Alert, btnClass } from "../../common/ui";

export default function TeacherHomeworkTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const homeworkId = searchParams.get("id");

  const handleBackFromSubmissions = () => {
    router.push("/teacher?tab=homework");
  };

  const handleViewSubmissions = (id: string) => {
    router.push(`/teacher?tab=homework&view=submissions&id=${id}`);
  };
  

  const {
    session,
    status,
    homeworks,
    classes,
    loading,
    showForm,
    setShowForm,
    expandedId,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    editingHomework,
    totalSubmissions,
    filteredHomeworks,
    handleDelete,
    handleEditClick,
    handleFormClose,
    handleSubmitSuccess,
    toggleExpanded,
  } = useHomeworkPage();

  const formSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showForm || !editingHomework) return;
    const t = setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    return () => clearTimeout(t);
  }, [showForm, editingHomework]);

  const handleSubmit = async (payload: {
    title: string;
    description: string;
    classId: string;
    subject: string;
    dueDate: string;
    assignedDate: string;
    file?: string | null;
  }) => {
    const { ok, data } = editingHomework
      ? await updateHomework(editingHomework.id, payload)
      : await createHomework(payload);
    if (!ok) {
      throw new Error((data.message as string) || "Failed to save");
    }
    const homework = data.homework ?? data;
    if (!homework || !homework.id) {
      throw new Error("Invalid response from server");
    }
    handleSubmitSuccess(homework as Parameters<typeof handleSubmitSuccess>[0]);
  };

  const _activeCount = useMemo(() => {
    const now = new Date().toISOString();
    return filteredHomeworks.filter((h) => h.dueDate && h.dueDate >= now).length;
  }, [filteredHomeworks]);

  const avgCompletionPercent = useMemo(() => {
    if (filteredHomeworks.length === 0) return 0;
    let totalPct = 0;
    let count = 0;
    filteredHomeworks.forEach((h) => {
      const total = h.class?._count?.students ?? 0;
      if (total > 0) {
        totalPct += ((h._count?.submissions ?? 0) / total) * 100;
        count += 1;
      }
    });
    return count > 0 ? Math.round(totalPct / count) : 0;
  }, [filteredHomeworks]);

  if (view === "submissions" && homeworkId) {
    return (
      <SaPage>
        <HomeworkSubmissionsView homeworkId={homeworkId} onBack={handleBackFromSubmissions} />
      </SaPage>
    );
  }

  if ((status === "loading" || loading) && homeworks.length === 0) {
    return (
      <SaPage>
        <TimellyLoader title="Loading homework" steps={["Assignments", "Classes", "Submissions"]} />
      </SaPage>
    );
  }

  if (!session) {
    return (
      <SaPage>
        <Alert tone="error">Unauthorized</Alert>
      </SaPage>
    );
  }

  return (
    <SaPage>
        <SaPageHeader
          eyebrow="Teaching"
          title="Homework Management"
          description="Assign and track student homework"
          actions={
            <button
              type="button"
              onClick={() => setShowForm((s) => !s)}
              aria-expanded={showForm}
              className={btnClass(showForm ? "secondary" : "primary")}
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? "Cancel" : "Create New Assignment"}
            </button>
          }
        />

        {/* CREATE / EDIT FORM */}
        {showForm && (
          <div ref={formSectionRef}>
          <HomeworkForm
            classes={classes}
            editing={editingHomework}
            onCancel={handleFormClose}
            onSubmit={handleSubmit}
          />
          </div>
        )}

        {/* STATS */}
        <HomeworkStats
          activeCount={homeworks.length}
          totalSubmissions={totalSubmissions}
          avgCompletionPercent={avgCompletionPercent}
        />

        {/* FILTER & SEARCH */}
        <HomeworkFilterBar
          filter={filter}
          setFilter={setFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* LIST */}
        <HomeworkList
          homeworks={filteredHomeworks}
          expandedId={expandedId}
          onToggle={toggleExpanded}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onViewSubmissions={handleViewSubmissions}
        />

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </SaPage>
  );
}
