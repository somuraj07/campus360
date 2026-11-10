"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, User } from "lucide-react";
import { fetchHomeworkSubmissions } from "@/lib/api/homework";
import AttachmentPreview from "../../common/AttachmentPreview";
import TimellyLoader from "../../common/TimellyLoader";

export type SubmissionRow = {
  id: string;
  content: string | null;
  fileUrl: string | null;
  submittedAt: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  rollNo: string | null;
};

type HomeworkSubmissionsViewProps = {
  homeworkId: string;
  onBack: () => void;
};


export default function HomeworkSubmissionsView({ homeworkId, onBack }: HomeworkSubmissionsViewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [homeworkTitle, setHomeworkTitle] = useState<string>("");
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { ok, data } = await fetchHomeworkSubmissions(homeworkId);
      if (!ok) {
        setError(data.message || "Failed to load submissions");
        setSubmissions([]);
        return;
      }

      setHomeworkTitle(data.homework?.title ?? "Submissions");
      setSubmissions(data.submissions ?? []);
    } catch {
      setError("Something went wrong");
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, [homeworkId]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  if (loading) {
    return (
      <TimellyLoader
        compact
        title="Loading submissions"
        steps={["Students", "Files", "Ready"]}
      />
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-fg-muted hover:text-fg text-sm"
        >
          <ArrowLeft size={18} /> Back to Homework
        </button>
        <p className="text-red-700 dark:text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-fg-muted hover:text-fg text-sm w-fit"
        >
          <ArrowLeft size={18} /> Back to Homework
        </button>
        <h3 className="text-lg font-semibold text-fg truncate">
          {homeworkTitle}
        </h3>
      </div>

      <p className="text-fg-muted text-sm">
        {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
      </p>

      {submissions.length === 0 ? (
        <div className="rounded-2xl border border-line bg-elev-1 p-8 text-center text-fg-muted">
          No submissions yet.
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-line bg-elev-1 p-4 md:p-6 flex flex-col md:flex-row md:items-start gap-4"
            >
              <div className="flex items-center gap-3 min-w-0 md:min-w-[200px]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <User size={20} />
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-fg truncate">{s.studentName}</p>
                  <p className="text-xs text-fg-subtle">
                    {s.admissionNumber}
                    {s.rollNo ? ` • Roll: ${s.rollNo}` : ""}
                  </p>
                  <p className="text-xs text-fg-subtle mt-0.5">
                    Submitted {new Date(s.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                {s.content && (
                  <p className="text-sm text-fg-muted whitespace-pre-wrap">{s.content}</p>
                )}
                {s.fileUrl ? (
                  <div>
                    <p className="text-xs text-fg-subtle mb-1 uppercase tracking-wide">Document</p>
                    <AttachmentPreview
                      url={s.fileUrl}
                      label="View submission document"
                      className="w-full max-w-md"
                    />
                  </div>
                ) : (
                  !s.content && (
                    <p className="text-sm text-fg-subtle italic">No attachment or text</p>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
