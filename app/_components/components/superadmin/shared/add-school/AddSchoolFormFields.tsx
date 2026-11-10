import type { ReactNode } from "react";
import {
  School,
  Lock,
  Phone,
  Mail,
  MapPin,
  Hash,
  Map,
  Building2,
  Landmark,
  Globe,
  IndianRupee,
  CalendarClock,
  Users,
  Wallet,
} from "lucide-react";
import { SchoolFormState } from "../../../../interfaces/dashboard";
import type { FormErrors } from "./useAddSchoolState";
import { Field, TextInput } from "../ui";

function Section({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-elev-1">
      <div className="flex items-start gap-4 border-b border-line px-5 py-4 sm:px-6">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-on-primary">
          {step}
        </span>
        <div>
          <h2 className="text-[15px] font-semibold text-fg">{title}</h2>
          <p className="mt-0.5 text-xs text-fg-subtle">{description}</p>
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function BillingOption({
  active,
  onClick,
  icon: Icon,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Users;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${
        active
          ? "border-primary bg-primary/5 ring-4 ring-primary/10"
          : "border-line-strong bg-surface hover:border-primary/40 hover:bg-elev-2"
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          active ? "bg-primary text-on-primary" : "bg-elev-2 text-fg-subtle"
        }`}
      >
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-fg">{title}</span>
        <span className="mt-0.5 block text-xs text-fg-subtle">{description}</span>
      </span>
      <span
        aria-hidden
        className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
          active ? "border-primary" : "border-line-strong"
        }`}
      >
        {active && <span className="h-2 w-2 rounded-full bg-primary" />}
      </span>
    </button>
  );
}

export function AddSchoolFormFields({
  form,
  setForm,
  errors,
  handleChange,
}: {
  form: SchoolFormState;
  setForm: (updater: (prev: SchoolFormState) => SchoolFormState) => void;
  errors: FormErrors;
  handleChange: (field: keyof SchoolFormState) => (value: string) => void;
}) {
  const bind = (field: keyof SchoolFormState) => ({
    value: (form[field] as string) ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(field)(e.target.value),
  });

  return (
    <div className="space-y-5">
      <Section step={1} title="Basic information" description="The school's name and the admin login password.">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="School name" required error={errors.schoolName}>
            <TextInput icon={School} placeholder="e.g. St. Mary's College" error={errors.schoolName} {...bind("schoolName")} />
          </Field>
          <Field label="Admin password" required error={errors.password} hint="The school admin uses this to sign in.">
            <TextInput
              icon={Lock}
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              error={errors.password}
              {...bind("password")}
            />
          </Field>
        </div>
      </Section>

      <Section step={2} title="Subscription settings" description="Choose how this school pays for RS Solutions.">
        <div role="radiogroup" aria-label="Billing mode" className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <BillingOption
            active={form.billingMode === "PARENT_SUBSCRIPTION"}
            onClick={() => setForm((prev) => ({ ...prev, billingMode: "PARENT_SUBSCRIPTION" }))}
            icon={Users}
            title="Parent Subscription (per annum)"
            description="Parents pay a yearly subscription, with an optional free trial."
          />
          <BillingOption
            active={form.billingMode === "SCHOOL_PAID"}
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                billingMode: "SCHOOL_PAID",
                parentSubscriptionAmount: "",
                parentSubscriptionTrialDays: "",
              }))
            }
            icon={Wallet}
            title="School Paid (no parent subscription)"
            description="The school pays centrally; parents are never charged."
          />
        </div>

        {form.billingMode === "PARENT_SUBSCRIPTION" && (
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Parent Subscription Amount (₹)" hint="Yearly amount parents pay.">
              <TextInput icon={IndianRupee} inputMode="decimal" placeholder="e.g. 2999" {...bind("parentSubscriptionAmount")} />
            </Field>
            <Field label="Free Trial Days" hint="Days before payment is required.">
              <TextInput icon={CalendarClock} inputMode="numeric" placeholder="e.g. 14" {...bind("parentSubscriptionTrialDays")} />
            </Field>
          </div>
        )}
      </Section>

      <Section step={3} title="Contact information" description="Where the platform team can reach the school admin.">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Email" required error={errors.email} hint="Also used as the admin's login ID.">
            <TextInput icon={Mail} type="email" placeholder="example@gmail.com" error={errors.email} {...bind("email")} />
          </Field>
          <Field label="Phone" error={errors.phone}>
            <TextInput icon={Phone} inputMode="tel" placeholder="10-digit contact number" error={errors.phone} {...bind("phone")} />
          </Field>
        </div>
      </Section>

      <Section step={4} title="Address details" description="Shown on receipts and reports.">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Address line" className="md:col-span-2">
            <TextInput icon={MapPin} placeholder="Building, street" {...bind("addressLine")} />
          </Field>
          <Field label="Area / Locality">
            <TextInput icon={Map} placeholder="Enter area / locality" {...bind("area")} />
          </Field>
          <Field label="City">
            <TextInput icon={Building2} placeholder="Enter city" {...bind("city")} />
          </Field>
          <Field label="District">
            <TextInput icon={Landmark} placeholder="Enter district" {...bind("district")} />
          </Field>
          <Field label="State">
            <TextInput icon={Globe} placeholder="Enter state" {...bind("state")} />
          </Field>
          <Field label="Pincode" error={errors.pincode}>
            <TextInput icon={Hash} inputMode="numeric" placeholder="Enter pincode" error={errors.pincode} {...bind("pincode")} />
          </Field>
        </div>
      </Section>
    </div>
  );
}
