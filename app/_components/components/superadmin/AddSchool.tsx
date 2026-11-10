"use client";

import { Check, RotateCcw, Save, School, ShieldCheck } from "lucide-react";
import SuccessPopups from "../common/SuccessPopUps";
import { useAddSchoolState, AddSchoolFormFields } from "./shared/add-school";
import { SaPage, SaPageHeader, Alert, InitialsAvatar, btnClass } from "./shared/ui";

export default function AddSchool() {
  const {
    form,
    setForm,
    errors,
    loading,
    error,
    showSuccess,
    setShowSuccess,
    hasFieldErrors,
    handleChange,
    handleSignup,
    handleReset,
  } = useAddSchoolState();

  const requiredDone = [form.schoolName.trim(), form.password.trim(), form.email.trim()];
  const completed = requiredDone.filter(Boolean).length;
  const place = [form.area, form.city, form.district, form.state].filter(Boolean).join(", ");
  const isParent = form.billingMode === "PARENT_SUBSCRIPTION";

  const checklist = [
    { label: "School name", done: Boolean(form.schoolName.trim()) },
    { label: "Admin password", done: Boolean(form.password.trim()) },
    { label: "Admin email", done: Boolean(form.email.trim()) },
  ];

  return (
    <SaPage>
      <SaPageHeader
        eyebrow="Schools · Onboarding"
        title="Add New School"
        description="Create a new school and onboard its admin here"
      />

      <form onSubmit={handleSignup} noValidate className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-5">
          {error && <Alert tone="error">{error}</Alert>}
          <AddSchoolFormFields form={form} setForm={setForm} errors={errors} handleChange={handleChange} />
        </div>

        {/* Live summary + actions */}
        <aside className="space-y-4 xl:sticky xl:top-4">
          <div className="overflow-hidden rounded-2xl border border-line bg-elev-1">
            <div className="relative bg-sidebar px-5 pb-5 pt-6 text-white">
              <span aria-hidden className="absolute right-0 top-0 h-full w-1.5 bg-accent" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">Preview</p>
              <div className="mt-3 flex items-center gap-3">
                {form.schoolName.trim() ? (
                  <InitialsAvatar name={form.schoolName} size="lg" onDark />
                ) : (
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 text-white/70">
                    <School size={24} />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold">{form.schoolName.trim() || "New school"}</p>
                  <p className="truncate text-xs text-white/65">{place || "Location not set"}</p>
                </div>
              </div>
            </div>

            <dl className="divide-y divide-line-subtle text-sm">
              <div className="flex items-center justify-between gap-3 px-5 py-3">
                <dt className="text-fg-subtle">Billing</dt>
                <dd className="font-medium text-fg">{isParent ? "Parent subscription" : "School paid"}</dd>
              </div>
              {isParent && (
                <>
                  <div className="flex items-center justify-between gap-3 px-5 py-3">
                    <dt className="text-fg-subtle">Amount / year</dt>
                    <dd className="font-medium text-fg tabular-nums">
                      {form.parentSubscriptionAmount ? `₹${Number(form.parentSubscriptionAmount).toLocaleString("en-IN")}` : "—"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 px-5 py-3">
                    <dt className="text-fg-subtle">Free trial</dt>
                    <dd className="font-medium text-fg">
                      {form.parentSubscriptionTrialDays ? `${form.parentSubscriptionTrialDays} days` : "—"}
                    </dd>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between gap-3 px-5 py-3">
                <dt className="text-fg-subtle">Admin login</dt>
                <dd className="max-w-[11rem] truncate font-medium text-fg">{form.email.trim() || "—"}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-line bg-elev-1 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-fg">Required details</p>
              <span className="text-xs font-medium text-fg-subtle tabular-nums">
                {completed}/{requiredDone.length}
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-elev-3">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${(completed / requiredDone.length) * 100}%` }}
              />
            </div>
            <ul className="mt-4 space-y-2.5">
              {checklist.map((c) => (
                <li key={c.label} className="flex items-center gap-2.5 text-sm">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full ${
                      c.done ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-elev-2 text-fg-faint"
                    }`}
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span className={c.done ? "text-fg" : "text-fg-subtle"}>{c.label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-col gap-2">
              <button type="submit" disabled={loading || error !== "" || hasFieldErrors} className={btnClass("primary")}>
                <Save size={16} />
                {loading ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={handleReset} className={btnClass("secondary")}>
                <RotateCcw size={15} />
                Reset
              </button>
            </div>

            <p className="mt-4 flex items-start gap-2 text-xs text-fg-subtle">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-fg-faint" />
              The school admin account is created together with the school.
            </p>
          </div>
        </aside>
      </form>

      <SuccessPopups
        open={showSuccess}
        title="School Created and Onboarded Successfully!"
        onClose={() => {
          setShowSuccess(false);
          handleReset();
        }}
      />
    </SaPage>
  );
}
