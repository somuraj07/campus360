"use client";

import { Briefcase, Loader2, Lock, Save, User, X } from "lucide-react";
import InputField from "./InputField";
import RoleSelector from "./RoleSelector";
import type { UserFormProps } from "./shared";
import { useUserFormState } from "./shared";
import { TeacherDetailsFields } from "./shared";
import { AccessControlPanel } from "./shared";
import { Alert, Badge, FormStep, InitialsAvatar, LoadingBlock, RequiredChecklist, btnClass } from "../../common/ui";

const ROLE_LABEL: Record<string, string> = { TEACHER: "Teacher", SCHOOLADMIN: "School Admin", STUDENT: "Student" };

/** Fields cleared from the error map when the role changes (they only apply to teachers). */
const TEACHER_ONLY_ERRORS = [
  "subjects",
  "teacherId",
  "qualification",
  "experience",
  "joiningDate",
  "mobile",
  "address",
] as const;

export default function UserForm(props: UserFormProps) {
  const { mode = "create" } = props;
  const {
    userId,
    loading,
    detailLoading,
    submitting,
    error,
    fieldErrors,
    setFieldErrors,
    success,
    schoolEmailDomain,
    emailSettingsLoading,
    formData,
    classesList,
    subjectInput,
    setSubjectInput,
    availableSubjects,
    subjectsDropdownOpen,
    setSubjectsDropdownOpen,
    handleChange,
    handleFeatureToggle,
    handleToggleAllFeatures,
    handleSubmit,
    cancelToUserList,
  } = useUserFormState(props);

  if (loading) {
    return <LoadingBlock label="Loading user form…" />;
  }

  const isCreate = mode === "create";
  const isTeacher = formData.role === "TEACHER";
  const checklist = [
    { label: "Full name", done: Boolean(formData.name?.trim()) },
    ...(isCreate || formData.password
      ? [
          { label: "Password", done: Boolean(formData.password) },
          { label: "Confirm password", done: Boolean(formData.confirmPassword) && formData.confirmPassword === formData.password },
        ]
      : []),
    { label: "At least one module", done: formData.allowedFeatures.length > 0 },
  ];
  const busy = submitting || detailLoading;

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
        <div className="min-w-0 space-y-5">
          {detailLoading ? <Alert tone="info">Loading full teacher profile…</Alert> : null}

          <FormStep step={1} title="Role" description="What kind of account this is.">
            <RoleSelector
              value={formData.role}
              onChange={(role) => {
                handleChange("role", role);
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  TEACHER_ONLY_ERRORS.forEach((k) => {
                    delete next[k];
                  });
                  return next;
                });
              }}
            />
          </FormStep>

          <FormStep step={2} title="Basic information" description="Name and designation as they should appear across the portal.">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField
                label="Full Name"
                value={formData.name}
                onChange={(v) => handleChange("name", v)}
                placeholder="Enter full name"
                icon={<User className="h-4 w-4" />}
                required
                error={fieldErrors.name}
              />
              <InputField
                label="Designation"
                value={formData.designation || ""}
                onChange={(v) => handleChange("designation", v)}
                placeholder="e.g. Senior Teacher"
                icon={<Briefcase className="h-4 w-4" />}
                error={fieldErrors.designation}
              />
            </div>
          </FormStep>

          <FormStep
            step={3}
            title="Login"
            description={`Email is generated from the full name using your school email domain${
              emailSettingsLoading ? "" : schoolEmailDomain ? ` (${schoolEmailDomain})` : ""
            }.`}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField
                label={isCreate ? "Password" : "New password (leave blank to keep unchanged)"}
                value={formData.password || ""}
                onChange={(v) => handleChange("password", v)}
                placeholder="Min 8 chars, letter + number"
                icon={<Lock className="h-4 w-4" />}
                type="password"
                required={isCreate}
                autoComplete="new-password"
                error={fieldErrors.password}
              />
              {formData.password ? (
                <InputField
                  label="Confirm Password"
                  value={formData.confirmPassword || ""}
                  onChange={(v) => handleChange("confirmPassword", v)}
                  placeholder="Confirm password"
                  icon={<Lock className="h-4 w-4" />}
                  type="password"
                  required
                  autoComplete="new-password"
                  error={fieldErrors.confirmPassword}
                />
              ) : null}
            </div>
          </FormStep>

          {isTeacher && (
            <FormStep step={4} title="Teacher details" description="Subjects, classes and employment details.">
              <TeacherDetailsFields
                formData={formData}
                fieldErrors={fieldErrors}
                onChange={handleChange}
                classesList={classesList}
                subjectInput={subjectInput}
                onSubjectInputChange={setSubjectInput}
                availableSubjects={availableSubjects}
                subjectsDropdownOpen={subjectsDropdownOpen}
                onSubjectsDropdownOpenChange={setSubjectsDropdownOpen}
              />
            </FormStep>
          )}

          <FormStep step={isTeacher ? 5 : 4} title="Access control" description="Choose which modules this user can open.">
            <AccessControlPanel
              allowedFeatures={formData.allowedFeatures}
              fieldErrors={fieldErrors}
              onToggleFeature={handleFeatureToggle}
              onToggleAll={handleToggleAllFeatures}
            />
          </FormStep>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-elev-1 p-5">
            <div className="flex items-center gap-3">
              <InitialsAvatar name={formData.name?.trim() || "New user"} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-fg">{formData.name?.trim() || "New user"}</p>
                <p className="truncate text-xs text-fg-subtle">{formData.designation?.trim() || "No designation yet"}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <Badge tone="navy">{ROLE_LABEL[formData.role] ?? formData.role}</Badge>
                  <Badge tone="gold">
                    {formData.allowedFeatures.length} module{formData.allowedFeatures.length === 1 ? "" : "s"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="my-5 h-px bg-line" />

            <RequiredChecklist items={checklist} />

            <div className="mt-5 flex flex-col gap-2">
              <button type="submit" disabled={busy} className={btnClass("primary")}>
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {submitting ? "Saving..." : `${userId ? "Update" : "Create"} User`}
              </button>
              <button type="button" onClick={cancelToUserList} disabled={submitting} className={btnClass("secondary")}>
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>

          {error && <Alert tone="error">{error}</Alert>}
          {success && <Alert tone="success">User {userId ? "updated" : "created"} successfully!</Alert>}
        </aside>
      </div>
    </form>
  );
}
