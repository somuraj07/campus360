"use client";

import { X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import SelectInput from "../../common/SelectInput";
import ParentTimellyLoader from "../ParentTimellyLoader";
import { fetchTeacherList } from "@/lib/api/timetable";
import { createAppointment } from "@/lib/api/communication";

type Teacher = {
  id: string;
  name: string | null;
  subject?: string | null;
};

type Props = {
  onClose: () => void;
  onSuccess?: () => void;
};

export default function NewChatModal({ onClose, onSuccess }: Props) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [teacherError, setTeacherError] = useState<string | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [topic, setTopic] = useState("Academic Performance");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchTeachers = useCallback(async () => {
    setLoadingTeachers(true);
    setTeacherError(null);
    try {
      const { ok, data } = await fetchTeacherList();
      if (!ok) {
        setTeacherError(data.message || "Failed to load teachers");
        setTeachers([]);
        return;
      }
      const list = Array.isArray(data.teachers) ? (data.teachers as Teacher[]) : [];
      setTeachers(list);
      if (list.length > 0 && !selectedTeacherId) {
        setSelectedTeacherId(list[0].id);
      }
    } catch {
      setTeacherError("Failed to load teachers");
      setTeachers([]);
    } finally {
      setLoadingTeachers(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- load-once; selectedTeacherId is only read to keep an existing selection
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleSubmit = async () => {
    if (!selectedTeacherId) {
      setSubmitError("Please select a teacher");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const note = [topic, message].filter(Boolean).join("\n\n");
      const { ok, data } = await createAppointment({ teacherId: selectedTeacherId, note: note || undefined });
      if (!ok) {
        setSubmitError(data.message || "Request failed");
        return;
      }
      onSuccess?.();
      onClose();
    } catch {
      setSubmitError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-overlay flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-elev-2 rounded-2xl border border-line shadow-card">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-line">
          <h2 className="text-lg font-semibold text-fg">
            New Chat Request
          </h2>
          <button onClick={onClose} className="text-fg-muted hover:text-fg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Recipient – real teachers */}
          <div>
            <label className="text-xs text-fg-muted block mb-2">
              SELECT RECIPIENT
            </label>
            {loadingTeachers ? (
              <ParentTimellyLoader preset="chat" compact bare className="py-4" />
            ) : teacherError ? (
              <p className="text-red-700 dark:text-red-400 text-sm py-2">{teacherError}</p>
            ) : (
             <SelectInput
  value={selectedTeacherId}
  onChange={setSelectedTeacherId}
  options={[
    { label: "Select a teacher", value: "", disabled: false },
    ...teachers.map((t) => ({
      label: `${t.name ?? "Teacher"} ${t.subject ? `- ${t.subject}` : ""}`,
      value: t.id,
    })),
  ]}
  bgColor="black"
/>

            )}
          </div>

          {/* Topic */}
          <div>
            <label className="text-xs text-fg-muted block mb-2">
              TOPIC
            </label>
            <SelectInput
  value={topic}
  onChange={setTopic}
  options={[
    { label: "Academic Performance" },
    { label: "Attendance" },
    { label: "Behavior" },
  ]}
  bgColor="black"
/>

          </div>

          {/* Message */}
          <div>
            <label className="text-xs text-fg-muted block mb-2">
              MESSAGE
            </label>
            <textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-elev-2 border border-line rounded-xl px-4 py-3 text-fg h-32 resize-none focus:border-primary/50 outline-none placeholder:text-fg-subtle"
            />
          </div>

          {submitError && (
            <p className="text-red-700 dark:text-red-400 text-sm">{submitError}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between p-6 border-t border-line">
          <button
            type="button"
            onClick={onClose}
            className="bg-elev-2 text-fg-muted px-6 py-2 rounded-xl hover:bg-elev-3 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || loadingTeachers || teachers.length === 0}
            className="bg-primary text-on-primary font-semibold px-6 py-2 rounded-xl hover:bg-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Sending…" : "Send Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
