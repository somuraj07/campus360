import { FormStep as Section } from "../../../common/ui";
import { Check, Loader2, Save } from "lucide-react";
import { motion } from "framer-motion";
import InputField from "../../../schooladmin/schooladmincomponents/InputField";
import { Select } from "./PresentationalBits";
import { BOARDING, GENDERS } from "./constants";
import type { BoardingType, FormState, Gender } from "./types";

export function AdmissionFormView({
  editId,
  onCancelEdit,
  form,
  onFormChange,
  classes,
  classOptions,
  onClassIdChange,
  handleSaveClick,
  submitting,
  message,
  messageTone,
}: {
  editId: string | null;
  onCancelEdit: () => void;
  form: FormState;
  onFormChange: (update: (p: FormState) => FormState) => void;
  classes: { id: string; name: string; section: string | null }[];
  classOptions: { label: string; value: string }[];
  onClassIdChange: (v: string) => void;
  handleSaveClick: () => void;
  submitting: boolean;
  message: string | null;
  messageTone: "success" | "error";
}) {
  const set = (key: keyof FormState) => (v: string) => onFormChange((p) => ({ ...p, [key]: v }));
  const required: [string, string][] = [
    ["Application Number", form.applicationNo],
    ["Student Name", form.studentName],
    ["Date of Birth", form.dateOfBirth],
    ["Nationality", form.nationality],
    ["Languages at Home", form.languagesAtHome],
    ["Present Address", form.presentAddress],
    ["Permanent Address", form.permanentAddress],
    ["Parent Name", form.parentName],
    ["Occupation", form.parentOccupation],
    ["Office Address", form.officeAddress],
    ["Parent Phone", form.parentPhone],
    ["WhatsApp", form.parentWhatsapp],
  ];
  const done = required.filter(([, v]) => String(v ?? "").trim()).length;
  const className = classOptions.find((o) => o.value === form.classId)?.label;

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          <Section step={1} title="Application & IDs" description="Reference numbers for this application.">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <InputField label="Application Number" value={form.applicationNo} onChange={set("applicationNo")} required />
              <InputField label="RS Solutions No (optional)" value={form.fedenaNo} onChange={set("fedenaNo")} />
              <InputField label="PEN Number (optional)" value={form.penNumber} onChange={set("penNumber")} />
              <InputField label="APAAR ID (optional)" value={form.apaarId} onChange={set("apaarId")} />
            </div>
          </Section>

          <Section step={2} title="Student details" description="Who is applying, and for which class.">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <InputField label="Student Name" value={form.studentName} onChange={set("studentName")} required />
              <InputField label="Date of Birth" type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} required />
              <Select
                label="Gender"
                value={form.gender}
                onChange={(v) => onFormChange((p) => ({ ...p, gender: v as Gender }))}
                options={GENDERS}
              />
              <Select
                label="Class"
                value={form.classId}
                onChange={onClassIdChange}
                options={
                  classOptions.length > 1
                    ? classOptions
                    : [{ label: classes.length === 0 ? "No classes in school" : "Unassigned", value: "" }]
                }
              />
              <Select
                label="Boarding Type"
                value={form.boardingType}
                onChange={(v) => onFormChange((p) => ({ ...p, boardingType: v as BoardingType }))}
                options={BOARDING}
              />
              <Select
                label="Residency Type"
                value={form.residencyType}
                onChange={set("residencyType")}
                options={[
                  { label: "Day Scholar", value: "Day Scholar" },
                  { label: "Hostel", value: "Hosteller" },
                  { label: "RTE", value: "RTE" },
                ]}
              />
              <InputField label="ADHAAR ID (optional)" value={form.aadharNo} onChange={set("aadharNo")} />
              <InputField label="PAN Number (optional)" value={form.panNumber} onChange={set("panNumber")} />
              <InputField label="Nationality" value={form.nationality} onChange={set("nationality")} required />
              <InputField label="Languages at Home" value={form.languagesAtHome} onChange={set("languagesAtHome")} required />
              <InputField label="Caste (optional)" value={form.caste} onChange={set("caste")} />
              <InputField label="Religion (optional)" value={form.religion} onChange={set("religion")} />
            </div>
          </Section>

          <Section
            step={3}
            title="Fees (record only)"
            description="Tuition for enrolled students comes from the school admin global fee structure for each class, not from this form."
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <InputField
                label="Application Fee (optional, record only)"
                value={form.applicationFee}
                onChange={set("applicationFee")}
                placeholder="e.g. 500"
              />
              <InputField
                label="Admission Fee (optional, record only)"
                value={form.admissionFee}
                onChange={set("admissionFee")}
                placeholder="e.g. 5000"
              />
            </div>
          </Section>

          <Section step={4} title="Address" description="Where the student lives.">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <InputField label="Present Address" value={form.presentAddress} onChange={set("presentAddress")} required />
              <InputField label="Permanent Address" value={form.permanentAddress} onChange={set("permanentAddress")} required />
            </div>
          </Section>

          <Section step={5} title="Parent Details" description="Primary contact for this application.">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <InputField label="Parent Name" value={form.parentName} onChange={set("parentName")} required />
              <InputField label="Occupation" value={form.parentOccupation} onChange={set("parentOccupation")} required />
              <InputField label="Parent Phone" value={form.parentPhone} onChange={set("parentPhone")} required />
              <InputField label="WhatsApp" value={form.parentWhatsapp} onChange={set("parentWhatsapp")} required />
              <InputField label="Parent Email" value={form.parentEmail} onChange={set("parentEmail")} />
              <InputField label="Aadhar Number (optional)" value={form.bankAccountNo} onChange={set("bankAccountNo")} />
              <div className="md:col-span-2">
                <InputField label="Office Address" value={form.officeAddress} onChange={set("officeAddress")} required />
              </div>
            </div>
          </Section>

          <Section step={6} title="Mother Details" description="Optional.">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <InputField label="Mother Name" value={form.motherName} onChange={set("motherName")} />
              <InputField label="Phone Number" value={form.motherPhone} onChange={set("motherPhone")} />
              <InputField label="Aadhar Number" value={form.motherAadharNo} onChange={set("motherAadharNo")} />
              <InputField label="Email ID" value={form.motherEmail} onChange={set("motherEmail")} />
            </div>
          </Section>
        </div>

        {/* Summary + actions */}
        <aside className="space-y-4 xl:sticky xl:top-4">
          <div className="overflow-hidden rounded-2xl border border-line bg-elev-1">
            <div className="relative bg-sidebar px-5 pb-5 pt-5 text-white">
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-accent" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                {editId ? "Edit Admission Application" : "Admission Form"}
              </p>
              <p className="mt-2 truncate text-lg font-semibold">{form.studentName.trim() || "New applicant"}</p>
              <p className="truncate text-xs text-white/65">
                {[className && className !== "Unassigned" ? className : null, form.applicationNo ? `App. ${form.applicationNo}` : null]
                  .filter(Boolean)
                  .join(" · ") || "Class not selected"}
              </p>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-fg">Required fields</span>
                <span className="text-xs font-medium text-fg-subtle tabular-nums">
                  {done}/{required.length}
                </span>
              </div>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-elev-3">
                <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(done / required.length) * 100}%` }} />
              </div>
              <ul className="mt-4 max-h-56 space-y-2 overflow-y-auto pr-1">
                {required.map(([label, v]) => {
                  const ok = Boolean(String(v ?? "").trim());
                  return (
                    <li key={label} className="flex items-center gap-2 text-xs">
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full ${
                          ok ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-elev-2 text-fg-faint"
                        }`}
                      >
                        <Check size={10} strokeWidth={3} />
                      </span>
                      <span className={ok ? "text-fg" : "text-fg-subtle"}>{label}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-5 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleSaveClick}
                  disabled={submitting}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-hover disabled:opacity-60"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {submitting ? "Saving..." : editId ? "Update" : "Save"}
                </button>
                {editId && (
                  <button
                    type="button"
                    onClick={onCancelEdit}
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-line-strong bg-surface px-4 text-sm font-semibold text-fg transition-colors hover:bg-elev-2"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          {message && (
            <div
              role={messageTone === "success" ? "status" : "alert"}
              className={`rounded-xl border px-4 py-3 text-sm ${
                messageTone === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
                  : "border-red-200 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
              }`}
            >
              {message}
            </div>
          )}
        </aside>
      </div>
    </motion.div>
  );
}
