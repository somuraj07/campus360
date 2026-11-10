"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import InputField from "../schooladmincomponents/InputField";
import SelectInput from "../../common/SelectInput";
import { SelectOption, StudentFormErrors, StudentFormState } from "./types";
import StudentSubjectsMultiSelect from "./StudentSubjectsMultiSelect";

type Props = {
  form: StudentFormState;
  errors: StudentFormErrors;
  classOptions: SelectOption[];
  sectionOptions: SelectOption[];
  classesLoading?: boolean;
  ageLabel: string;
  saving: boolean;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  editMode?: boolean;
  onFieldChange: (key: keyof StudentFormState, value: string | string[]) => void;
  onCancel: () => void;
  onReset: () => void;
  onSave: () => void;
};

const renderError = (errors: StudentFormErrors, key: keyof StudentFormState) =>
  errors[key] ? (
    <p className="text-xs text-red-700 dark:text-red-400 mt-1">{errors[key]}</p>
  ) : null;

/** Digits only, capped length (Aadhaar, phone, PIN, etc.). */
const digitsCap =
  (max: number) =>
  (value: string): string =>
    value.replace(/\D/g, "").slice(0, max);

export default function AddStudentForm({
  form,
  errors,
  classOptions,
  sectionOptions,
  classesLoading = false,
  ageLabel,
  saving,
  title = "Add New Student",
  subtitle = "Enter student details below",
  submitLabel = "Save Student",
  editMode = false,
  onFieldChange,
  onCancel,
  onReset,
  onSave,
}: Props) {
  const [showParentSection, setShowParentSection] = useState(!editMode);
  const [showAdmissionSection, setShowAdmissionSection] = useState(!editMode);

  return (
    <div className="bg-surface rounded-2xl p-6 border border-line">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-fg">{title}</h3>
            {editMode ? (
              <span className="rounded-full border border-primary/40 bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                Edit Mode
              </span>
            ) : null}
          </div>
          {subtitle ? <p className="text-xs text-fg-muted">{subtitle}</p> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
        <div>
          <InputField
            label="Full Name*"
            value={form.name}
            onChange={(value) => onFieldChange("name", value)}
            placeholder="Student Name"
            bgColor="white"
            error={errors.name}
          />
        </div>
        <div>
          <InputField
            label="RS Solutions ID"
            value={form.rollNo}
            onChange={(value) => onFieldChange("rollNo", value.slice(0, 40))}
            placeholder="e.g. STU001"
            bgColor="white"
            error={errors.rollNo}
          />
        </div>
        <div>
          <InputField
            label="PEN Number"
            value={form.penNumber}
            onChange={(value) => onFieldChange("penNumber", value.slice(0, 40))}
            placeholder="Optional"
            bgColor="white"
            error={errors.penNumber}
          />
        </div>
        <div>
          <InputField
            label="APAAR ID"
            value={form.apaarId}
            onChange={(value) => onFieldChange("apaarId", value.slice(0, 40))}
            placeholder="Optional"
            bgColor="white"
            error={errors.apaarId}
          />
        </div>
        <div>
          <InputField
            label="Aadhaar Number*"
            value={form.aadhaarNo}
            onChange={(value) => onFieldChange("aadhaarNo", digitsCap(12)(value))}
            placeholder="12 digits"
            inputMode="numeric"
            autoComplete="off"
            bgColor="white"
          />
          {renderError(errors, "aadhaarNo")}
        </div>
        <div>
          <SelectInput
            label="Gender*"
            value={form.gender}
            onChange={(value) => onFieldChange("gender", value)}
            options={[
              { label: "Select Gender", value: "" },
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Other", value: "Other" },
            ]}
            bgColor="white"
            error={errors.gender}
          />
        </div>
        <div>
          <SelectInput
            label="Residency Type"
            value={form.residencyType}
            onChange={(value) => onFieldChange("residencyType", value)}
            options={[
              { label: "Day Scholar", value: "Day Scholar" },
              { label: "Hostel", value: "Hosteller" },
            ]}
            bgColor="white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-fg-muted mb-1.5">
            Age
          </label>
          <div className="w-full rounded-xl bg-elev-1 border border-line px-4 py-3 text-sm text-fg">
            {ageLabel}
          </div>
        </div>
        <div>
          <InputField
            label="Date of Birth*"
            value={form.dob}
            onChange={(value) => onFieldChange("dob", value)}
            placeholder="dd-mm-yyyy"
            type="date"
            bgColor="white"
          />
          {renderError(errors, "dob")}
        </div>
        <div>
          <SelectInput
            label="Class*"
            value={form.classId}
            onChange={(value) => onFieldChange("classId", value)}
            options={classOptions}
            disabled={classesLoading || classOptions.length <= 1}
            bgColor="white"
            error={errors.classId}
          />
        </div>
        <div>
          <SelectInput
            label="Section"
            value={form.section}
            onChange={(value) => onFieldChange("section", value)}
            options={sectionOptions}
            disabled={classesLoading || sectionOptions.length <= 1}
            bgColor="white"
          />
        </div>
        <div>
          <SelectInput
            label="Status"
            value={form.status}
            onChange={(value) => onFieldChange("status", value)}
            options={[
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ]}
            bgColor="white"
          />
        </div>
        <StudentSubjectsMultiSelect
          selected={form.subjects || []}
          classId={form.classId}
          onChange={(subjects) => onFieldChange("subjects", subjects)}
          error={errors.subjects}
        />
      </div>

      <p className="text-xs text-fg-subtle mt-2 mb-4">
        Tuition is set from{" "}
        <span className="text-fg-muted">Fees → Global fee breakdown</span> for the student&apos;s class (plus any extra fees). It is not entered here.
      </p>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowParentSection((prev) => !prev)}
          className="mb-3 inline-flex items-center gap-2 rounded-lg border border-line bg-elev-1 px-3 py-1.5 text-sm font-semibold text-fg hover:bg-elev-3"
        >
          {showParentSection ? "Hide" : "Show"} Parent Information
        </button>
        {showParentSection ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InputField
              label="Parent Name*"
              value={form.fatherName}
              onChange={(value) => onFieldChange("fatherName", value)}
              placeholder="Parent/Guardian Name"
              bgColor="white"
            />
            {renderError(errors, "fatherName")}
          </div>
          <div>
            <InputField
              label="Mother Name"
              value={form.motherName}
              onChange={(value) => onFieldChange("motherName", value)}
              placeholder="Mother Name"
              bgColor="white"
            />
          </div>
          <div>
            <InputField
              label="Occupation"
              value={form.occupation}
              onChange={(value) => onFieldChange("occupation", value)}
              placeholder="e.g. Business"
              bgColor="white"
            />
          </div>
          <div className="md:col-span-2">
            <InputField
              label="Office Address"
              value={form.officeAddress}
              onChange={(value) => onFieldChange("officeAddress", value)}
              placeholder="Office address"
              bgColor="white"
            />
          </div>
          <div>
            <InputField
              label="Contact Number*"
              value={form.phoneNo}
              onChange={(value) => onFieldChange("phoneNo", digitsCap(10)(value))}
              placeholder="10 digits"
              inputMode="numeric"
              autoComplete="tel"
              bgColor="white"
            />
            {renderError(errors, "phoneNo")}
          </div>
          <div className="md:col-span-2">
            <InputField
              label="Parent / guardian email (optional)"
              value={form.email}
              onChange={(value) => onFieldChange("email", value)}
              placeholder="parent@example.com"
              type="email"
              autoComplete="email"
              bgColor="white"
            />
            <p className="mt-1.5 text-[11px] text-fg-subtle leading-snug">
              Used for parent contact on the admission record only. The student&apos;s login email is created automatically as their name @ your school domain.
            </p>
            {renderError(errors, "email")}
          </div>
          <div>
            <InputField
              label="Parent WhatsApp"
              value={form.parentWhatsapp}
              onChange={(value) => onFieldChange("parentWhatsapp", digitsCap(10)(value))}
              placeholder="10 digits"
              inputMode="numeric"
              bgColor="white"
            />
            {renderError(errors, "parentWhatsapp")}
          </div>
          <div>
            <InputField
              label="Bank Account No"
              value={form.bankAccountNo}
              onChange={(value) => onFieldChange("bankAccountNo", digitsCap(18)(value))}
              placeholder="9–18 digits"
              inputMode="numeric"
              bgColor="white"
            />
            {renderError(errors, "bankAccountNo")}
          </div>
          <div className="md:col-span-2">
            <InputField
              label="Address"
              value={form.address}
              onChange={(value) => onFieldChange("address", value)}
              placeholder="Full address"
              bgColor="white"
            />
            {renderError(errors, "address")}
          </div>
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowAdmissionSection((prev) => !prev)}
          className="mb-3 inline-flex items-center gap-2 rounded-lg border border-line bg-elev-1 px-3 py-1.5 text-sm font-semibold text-fg hover:bg-elev-3"
        >
          {showAdmissionSection ? "Hide" : "Show"} Admission Details
        </button>
        {showAdmissionSection ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <InputField label="House No" value={form.houseNo} onChange={(v) => onFieldChange("houseNo", v)} bgColor="white" />
          <InputField label="Street" value={form.street} onChange={(v) => onFieldChange("street", v)} bgColor="white" />
          <InputField label="City" value={form.city} onChange={(v) => onFieldChange("city", v)} bgColor="white" />
          <InputField label="Town" value={form.town} onChange={(v) => onFieldChange("town", v)} bgColor="white" />
          <InputField label="State" value={form.state} onChange={(v) => onFieldChange("state", v)} bgColor="white" />
          <InputField label="Pin Code" value={form.pinCode} onChange={(v) => onFieldChange("pinCode", v)} bgColor="white" />
          <InputField label="Nationality" value={form.nationality} onChange={(v) => onFieldChange("nationality", v)} bgColor="white" />
          <InputField label="Languages at Home" value={form.languagesAtHome} onChange={(v) => onFieldChange("languagesAtHome", v)} bgColor="white" />
          <InputField label="Caste" value={form.caste} onChange={(v) => onFieldChange("caste", v)} bgColor="white" />
          <InputField label="Religion" value={form.religion} onChange={(v) => onFieldChange("religion", v)} bgColor="white" />
          <InputField label="Emergency Father No" value={form.emergencyFatherNo} onChange={(v) => onFieldChange("emergencyFatherNo", v)} bgColor="white" />
          <InputField label="Emergency Mother No" value={form.emergencyMotherNo} onChange={(v) => onFieldChange("emergencyMotherNo", v)} bgColor="white" />
          <InputField label="Emergency Guardian No" value={form.emergencyGuardianNo} onChange={(v) => onFieldChange("emergencyGuardianNo", v)} bgColor="white" />
          </div>
        ) : null}
      </div>


      <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-line bg-elev-1 px-5 py-2 text-sm font-semibold text-fg-muted hover:bg-elev-3"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-line bg-elev-1 px-5 py-2 text-sm font-semibold text-fg-muted hover:bg-elev-3"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-primary
           px-5 py-2 text-sm font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-60"
        >
          <Plus size={16} /> {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </div>
  );
}
