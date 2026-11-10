"use client";

import { ChevronDown, Save, SquarePen } from "lucide-react";
import { TeacherProfileData, TeacherStatus } from "../types";

interface EditProfileFormProps {
  formData: TeacherProfileData;
  onChange: (key: keyof TeacherProfileData, value: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function EditProfileForm({
  formData,
  onChange,
  onCancel,
  onSave,
}: EditProfileFormProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-elev-1 ">
      <div className="flex items-center gap-2.5 p-5 sm:px-6">
        <SquarePen size={20} className="text-primary" />
        <h3 className="text-[20px] font-bold leading-tight text-fg sm:text-xl">Edit Information</h3>
      </div>
      <div className="h-px bg-elev-2" />

      <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <LocalInput label="Teacher Name" value={formData.name} onChange={(value) => onChange("name", value)} />
          <LocalInput label="Teacher ID" value={formData.teacherId} onChange={(value) => onChange("teacherId", value)} />
          <LocalInput label="Subject" value={formData.subject} onChange={(value) => onChange("subject", value)} />
          <LocalInput
            label="Assigned Classes"
            value={formData.assignedClasses}
            onChange={(value) => onChange("assignedClasses", value)}
          />
          <LocalInput
            label="Qualification"
            value={formData.qualification}
            onChange={(value) => onChange("qualification", value)}
          />
          <LocalInput label="Experience" value={formData.experience} onChange={(value) => onChange("experience", value)} />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <LocalInput
            label="Joining Date"
            value={formData.joiningDate}
            onChange={(value) => onChange("joiningDate", value)}
          />
          <LocalSelect
            label="Status"
            value={formData.status}
            onChange={(value) => onChange("status", value)}
          />
        </div>

        <h3 className="p-2 text-[16px] font-bold leading-tight text-fg sm:text-xl">Contact Information</h3>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <LocalInput label="Email" value={formData.email} onChange={(value) => onChange("email", value)} />
          <LocalInput label="Phone Number" value={formData.phone} onChange={(value) => onChange("phone", value)} />
          <LocalInput
            label="Address"
            value={formData.address}
            onChange={(value) => onChange("address", value)}
            className="md:col-span-2"
          />
        </div>

        <div className="mt-1 h-px bg-elev-2" />

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-end gap-3 pb-1 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto cursor-pointer rounded-2xl border border-line-strong bg-elev-2 px-7 py-2.5 text-base font-semibold text-fg hover:bg-elev-3"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-2.5 text-base font-bold text-on-primary hover:bg-primary-hover"
          >
            <Save size={18} />
            Save Teacher
          </button>
        </div>
      </div>
    </section>
  );
}

function LocalInput({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-fg-muted">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-2xl border border-line bg-well px-4 text-base font-semibold text-fg outline-none placeholder:text-fg-subtle focus:border-primary/70"
      />
    </div>
  );
}

function LocalSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: TeacherStatus;
  onChange: (value: TeacherStatus) => void;
}) {
  const isInactive = value === "Inactive";

  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-fg-muted">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as TeacherStatus)}
          className={`h-12 w-full appearance-none rounded-2xl bg-well px-4 pr-10 text-base font-semibold outline-none ${
            isInactive
              ? "border border-red-400/70 text-red-700 dark:text-red-400 focus:border-red-400"
              : "border border-primary/70 text-primary focus:border-primary"
          }`}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <ChevronDown
          size={16}
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${
            isInactive ? "text-red-700 dark:text-red-300" : "text-primary"
          }`}
        />
      </div>
    </div>
  );
}
