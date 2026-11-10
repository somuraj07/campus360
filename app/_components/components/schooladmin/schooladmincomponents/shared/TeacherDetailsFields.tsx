import { Briefcase, CheckCircle, User2, Phone, MapPin, Calendar, BookOpen } from "lucide-react";
import InputField from "../InputField";
import type { UserFormErrors } from "../userFormValidation";
import type { UserFormData } from "./userFormTypes";

export function TeacherDetailsFields({
  formData,
  fieldErrors,
  onChange,
  classesList,
  subjectInput,
  onSubjectInputChange,
  availableSubjects,
  subjectsDropdownOpen,
  onSubjectsDropdownOpenChange,
}: {
  formData: UserFormData;
  fieldErrors: UserFormErrors;
  onChange: (field: keyof UserFormData, value: unknown) => void;
  classesList: { id: string; name: string; section: string | null }[];
  subjectInput: string;
  onSubjectInputChange: (v: string) => void;
  availableSubjects: string[];
  subjectsDropdownOpen: boolean;
  onSubjectsDropdownOpenChange: (v: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Teacher ID"
          value={formData.teacherId || ""}
          onChange={(v) => onChange("teacherId", v.slice(0, 40))}
          placeholder="e.g. TCH005"
          icon={<User2 className="w-4 h-4" />}
          error={fieldErrors.teacherId}
        />
        <div>
          <label className="block text-xs font-medium text-fg-muted mb-1.5">
            Subject(s) <span className="text-red-700 dark:text-red-400">*</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(formData.subjects || []).map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-primary/20 border border-primary/30 text-primary text-sm"
              >
                {s}
                <button
                  type="button"
                  onClick={() => onChange("subjects", (formData.subjects || []).filter((x) => x !== s))}
                  className="hover:text-fg"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="relative">
            <div className="flex gap-2">
              <input
                type="text"
                value={subjectInput}
                onChange={(e) => {
                  onSubjectInputChange(e.target.value);
                  onSubjectsDropdownOpenChange(true);
                }}
                onFocus={() => onSubjectsDropdownOpenChange(true)}
                onBlur={() => setTimeout(() => onSubjectsDropdownOpenChange(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const v = subjectInput.trim().toUpperCase();
                    if (v && !(formData.subjects || []).map((s) => s.toUpperCase()).includes(v)) {
                      onChange("subjects", [...(formData.subjects || []), v]);
                      onSubjectInputChange("");
                      onSubjectsDropdownOpenChange(false);
                    }
                  }
                }}
                placeholder="Search or type a subject"
                className="flex-1 pl-4 pr-4 py-3 bg-well border border-line rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 text-fg-muted text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  const v = subjectInput.trim().toUpperCase();
                  if (v && !(formData.subjects || []).map((s) => s.toUpperCase()).includes(v)) {
                    onChange("subjects", [...(formData.subjects || []), v]);
                    onSubjectInputChange("");
                    onSubjectsDropdownOpenChange(false);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-primary/20 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/30"
              >
                Add
              </button>
            </div>
            {subjectsDropdownOpen && (() => {
              const selected = new Set((formData.subjects || []).map((s) => s.toUpperCase()));
              const filtered = availableSubjects.filter(
                (s) => !selected.has(s.toUpperCase()) && s.toUpperCase().includes(subjectInput.trim().toUpperCase())
              );
              if (!filtered.length) return null;
              return (
                <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-xl bg-elev-2 border border-line shadow-pop no-scrollbar">
                  {filtered.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        const normalized = s.trim().toUpperCase();
                        if (
                          !(formData.subjects || [])
                            .map((x) => x.toUpperCase())
                            .includes(normalized)
                        ) {
                          onChange("subjects", [
                            ...(formData.subjects || []),
                            normalized,
                          ]);
                        }
                        onSubjectInputChange("");
                        onSubjectsDropdownOpenChange(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-fg hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>
          {fieldErrors.subjects ? (
            <p className="text-xs text-red-700 dark:text-red-400 mt-1.5" role="alert">
              {fieldErrors.subjects}
            </p>
          ) : null}
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-fg-muted mb-1.5">Assigned Classes</label>
          <div className="flex flex-wrap gap-2 p-3 bg-well border border-line rounded-xl min-h-[48px]">
            {classesList.map((c) => {
              const id = c.id;
              const label = c.section ? `${c.name}-${c.section}` : c.name;
              const selected = (formData.assignedClassIds || []).includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    const current = formData.assignedClassIds || [];
                    onChange(
                      "assignedClassIds",
                      selected ? current.filter((x) => x !== id) : [...current, id]
                    );
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    selected
                      ? "bg-primary/30 border-primary/50 text-primary"
                      : "bg-elev-1 border-line text-fg-muted hover:border-line-strong"
                  }`}
                >
                  {label}
                </button>
              );
            })}
            {classesList.length === 0 && (
              <span className="text-fg-subtle text-sm">No classes found. Create classes first.</span>
            )}
          </div>
          <p className="text-[11px] text-fg-subtle mt-1">
            Classes this teacher can enter marks for. Class teacher (homeroom) is set under Teachers → Appoint Teacher.
          </p>
        </div>
        <InputField
          label="Qualification"
          value={formData.qualification || ""}
          onChange={(v) => onChange("qualification", v.slice(0, 120))}
          placeholder="e.g. M.Sc, B.Ed"
          icon={<BookOpen className="w-4 h-4" />}
          error={fieldErrors.qualification}
        />
        <InputField
          label="Experience"
          value={formData.experience || ""}
          onChange={(v) => onChange("experience", v.slice(0, 80))}
          placeholder="e.g. 5 Years"
          icon={<Briefcase className="w-4 h-4" />}
          error={fieldErrors.experience}
        />
        <InputField
          label="Joining Date"
          value={formData.joiningDate || ""}
          onChange={(v) => onChange("joiningDate", v)}
          type="date"
          icon={<Calendar className="w-4 h-4" />}
          error={fieldErrors.joiningDate}
        />
        <div>
          <label className="block text-xs font-medium text-fg-muted mb-1.5">Status</label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-fg-subtle">
              <CheckCircle className="w-4 h-4" />
            </span>
            <select
              value={formData.teacherStatus || "Active"}
              onChange={(e) => onChange("teacherStatus", e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-well border border-line rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 text-fg-muted"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <InputField
          label="Phone Number"
          value={formData.mobile || ""}
          onChange={(v) => onChange("mobile", v.replace(/\D/g, "").slice(0, 10))}
          placeholder="10-digit mobile"
          icon={<Phone className="w-4 h-4" />}
          inputMode="numeric"
          autoComplete="tel"
          error={fieldErrors.mobile}
        />
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-fg-muted mb-1.5">Address</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-3 text-fg-subtle">
              <MapPin className="w-4 h-4" />
            </span>
            <textarea
              value={formData.address || ""}
              onChange={(e) => onChange("address", e.target.value.slice(0, 500))}
              placeholder="Full Address"
              rows={2}
              aria-invalid={Boolean(fieldErrors.address)}
              className={`w-full pl-11 pr-4 py-3 bg-well rounded-xl focus:outline-none focus:ring-1 text-fg-muted resize-none ${
                fieldErrors.address
                  ? "border border-red-500/60 focus:ring-red-400/40"
                  : "border border-line focus:ring-primary/50"
              }`}
            />
          </div>
          {fieldErrors.address ? (
            <p className="text-xs text-red-700 dark:text-red-400 mt-1.5" role="alert">
              {fieldErrors.address}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
