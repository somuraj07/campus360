"use client";

import { Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { createClass } from "@/lib/api/classes";
import { fetchTeacherList } from "@/lib/api/teacher";
import SearchInput from "../../common/SearchInput";
import SelectInput from "../../common/SelectInput";
import SuccessPopups from "../../common/SuccessPopUps";
import { getErrorMessage } from "@/lib/errors/errorInfo";
import { btnClass } from "../../common/ui";

interface AddClassPanelProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

export default function AddClassPanel({ onCancel, onSuccess }: AddClassPanelProps) {
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [maxStudents, setMaxStudents] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<
    { id: string; name: string; email: string; mobile?: string | null }[]
  >([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadTeachers = async () => {
      setIsLoadingTeachers(true);
      try {
        const { ok, data } = await fetchTeacherList();
        if (!ok) {
          throw new Error("Failed to load teachers.");
        }
        if (isActive) {
          setTeachers(Array.isArray(data?.teachers) ? data.teachers : []);
        }
      } catch {
        if (isActive) {
          setTeachers([]);
        }
      } finally {
        if (isActive) {
          setIsLoadingTeachers(false);
        }
      }
    };

    loadTeachers();

    return () => {
      isActive = false;
    };
  }, []);

  const handleSave = async () => {
    if (!className.trim()) {
      setError("Class name is required.");
      return;
    }

    setError(null);
    setIsSaving(true);
    try {
      const { ok, data } = await createClass({
        name: className.trim(),
        section: section.trim() || undefined,
        teacherId: teacherId || undefined,
      });

      if (!ok) {
        throw new Error(data?.message || "Failed to create class.");
      }

      setShowSuccess(true);
      setClassName("");
      setSection("");
      setTeacherId("");
      setMaxStudents("");
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Failed to create class.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-elev-1 animate-fadeIn">
      <div className="flex items-center gap-3 border-b border-line px-5 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Plus size={16} />
        </span>
        <div>
          <h2 className="text-[15px] font-semibold text-fg">Add New Class</h2>
          <p className="text-xs text-fg-subtle">Create a class, optionally with a section and class teacher.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 xl:grid-cols-4">
        <SearchInput
          label="Class Name"
          placeholder="e.g. Class 10"
          showSearchIcon={false}
          value={className}
          onChange={setClassName}
          error={error ?? undefined}
        />

        <SearchInput
          label="Section"
          placeholder="e.g. A"
          showSearchIcon={false}
          value={section}
          onChange={setSection}
        />

        <SelectInput
          label="Class Teacher"
          value={teacherId}
          onChange={setTeacherId}
          options={[
            {
              label: isLoadingTeachers ? "Loading teachers..." : "Select Teacher",
              value: "",
              disabled: true,
            },
            ...(teachers.length > 0
              ? teachers.map((teacher) => ({
                  label: teacher.name,
                  value: teacher.id,
                }))
              : [
                  {
                    label: "No teachers found",
                    value: "__no_teachers__",
                    disabled: true,
                  },
                ]),
          ]}
        />

        <SearchInput
          label="Max Students"
          placeholder="e.g. 50"
          showSearchIcon={false}
          value={maxStudents}
          onChange={setMaxStudents}
        />
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-line bg-elev-2 px-5 py-3.5">
        <button type="button" onClick={onCancel} className={btnClass("secondary")}>
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className={btnClass("primary")}
        >
          <Save size={15} />
          {isSaving ? "Saving..." : "Save Class"}
        </button>
      </div>

      <SuccessPopups
        open={showSuccess}
        title="Class Created Successfully"
        onClose={() => {
          setShowSuccess(false);
          onSuccess?.();
        }}
      />
    </section>
  );
}
