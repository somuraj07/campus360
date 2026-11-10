"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Building2, Mail, Phone, User, Lock, UserCheck, UserX, RefreshCw, UserPlus, Users } from "lucide-react";
import { createChairman, fetchChairmenSchools, type ChairmanSchoolOption } from "@/lib/api/chairmen";
import {
  SaPage,
  SaPageHeader,
  Panel,
  Field,
  TextInput,
  SelectInput,
  Alert,
  Badge,
  SearchBox,
  DataTable,
  Th,
  Td,
  InitialsAvatar,
  EmptyState,
  LoadingBlock,
  Segmented,
  btnClass,
} from "./shared/ui";

type SchoolOption = ChairmanSchoolOption;

type FormState = {
  schoolId: string;
  name: string;
  email: string;
  password: string;
  mobile: string;
};

const emptyForm: FormState = {
  schoolId: "",
  name: "",
  email: "",
  password: "",
  mobile: "",
};

type Filter = "all" | "with" | "without";

export default function AddChairman() {
  const [schools, setSchools] = useState<SchoolOption[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const fetchSchools = useCallback(async () => {
    setLoadingSchools(true);
    setError("");
    try {
      const { ok, data } = await fetchChairmenSchools();
      if (!ok) throw new Error(data.message || "Failed to load chairman schools");
      setSchools(Array.isArray(data.schools) ? data.schools : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load schools");
      setSchools([]);
    } finally {
      setLoadingSchools(false);
    }
  }, []);

  useEffect(() => {
    void fetchSchools();
  }, [fetchSchools]);

  const handleChange = (field: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: field === "mobile" ? value.replace(/\D/g, "").slice(0, 10) : value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.schoolId || !form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("School, chairman name, email and password are required.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    setSaving(true);
    try {
      const { ok, data } = await createChairman(form);
      if (!ok) throw new Error(data.message || "Failed to create chairman");
      setSuccess(data.message || "Chairman account created.");
      setForm(emptyForm);
      await fetchSchools();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create chairman");
    } finally {
      setSaving(false);
    }
  };

  const withChairman = schools.filter((s) => (s.users?.length ?? 0) > 0).length;
  const withoutChairman = schools.length - withChairman;
  const coverage = schools.length ? Math.round((withChairman / schools.length) * 100) : 0;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return schools.filter((s) => {
      const has = (s.users?.length ?? 0) > 0;
      if (filter === "with" && !has) return false;
      if (filter === "without" && has) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        (s.location ?? "").toLowerCase().includes(q) ||
        (s.users ?? []).some((u) => `${u.name ?? ""} ${u.email ?? ""}`.toLowerCase().includes(q))
      );
    });
  }, [schools, query, filter]);

  return (
    <SaPage>
      <SaPageHeader
        eyebrow="Accounts"
        title="Add Chairman"
        description="Create a chairman login for a selected school. Chairman accounts use the normal login page."
      />

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <form onSubmit={handleSubmit} noValidate>
          <Panel
            icon={UserPlus}
            title="Chairman Account"
            description="All fields marked * are required."
            bodyClassName="p-5 sm:p-6"
          >
            <div className="space-y-5">
              {error ? <Alert tone="error">{error}</Alert> : null}
              {success ? <Alert tone="success">{success}</Alert> : null}

              <Field label="School" required>
                <SelectInput
                  icon={Building2}
                  value={form.schoolId}
                  onChange={(event) => handleChange("schoolId")(event.target.value)}
                  disabled={loadingSchools}
                >
                  <option value="">{loadingSchools ? "Loading schools..." : "Select school"}</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                      {school.location ? ` - ${school.location}` : ""}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Chairman Name" required>
                  <TextInput icon={User} placeholder="Chairman name" value={form.name} onChange={(e) => handleChange("name")(e.target.value)} />
                </Field>
                <Field label="Mobile">
                  <TextInput
                    icon={Phone}
                    inputMode="tel"
                    placeholder="10 digit mobile number"
                    value={form.mobile}
                    onChange={(e) => handleChange("mobile")(e.target.value)}
                  />
                </Field>
                <Field label="Chairman Email" required hint="Used to sign in.">
                  <TextInput
                    icon={Mail}
                    type="email"
                    placeholder="chairman@example.com"
                    value={form.email}
                    onChange={(e) => handleChange("email")(e.target.value)}
                  />
                </Field>
                <Field label="Password" required>
                  <TextInput
                    icon={Lock}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => handleChange("password")(e.target.value)}
                  />
                </Field>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-line pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setForm(emptyForm)} className={btnClass("secondary")}>
                  Clear
                </button>
                <button type="submit" disabled={saving || loadingSchools} className={btnClass("primary")}>
                  <UserCheck size={16} />
                  {saving ? "Creating..." : "Create Chairman"}
                </button>
              </div>
            </div>
          </Panel>
        </form>

        {/* Coverage */}
        <aside className="space-y-4 xl:sticky xl:top-4">
          <div className="rounded-2xl border border-line bg-elev-1 p-5">
            <p className="text-sm font-semibold text-fg">Chairman coverage</p>
            <p className="mt-0.5 text-xs text-fg-subtle">Schools that already have a chairman login</p>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-4xl font-semibold tracking-tight text-fg tabular-nums">{coverage}%</span>
              <span className="pb-1 text-xs text-fg-subtle">
                {withChairman} of {schools.length}
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-elev-3">
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${coverage}%` }} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-3">
                <UserCheck size={16} className="text-emerald-700 dark:text-emerald-300" />
                <p className="mt-2 text-xl font-semibold text-fg tabular-nums">{withChairman}</p>
                <p className="text-xs text-fg-subtle">With chairman</p>
              </div>
              <div className="rounded-xl bg-amber-500/10 p-3">
                <UserX size={16} className="text-amber-700 dark:text-amber-300" />
                <p className="mt-2 text-xl font-semibold text-fg tabular-nums">{withoutChairman}</p>
                <p className="text-xs text-fg-subtle">Not created</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <Panel
        icon={Users}
        title="School-wise Chairman List"
        description="Shows every school and the chairman accounts created for it."
        actions={
          <>
            <Segmented<Filter>
              value={filter}
              onChange={setFilter}
              options={[
                { value: "all", label: "All" },
                { value: "with", label: "Assigned" },
                { value: "without", label: "Not created" },
              ]}
            />
            <SearchBox value={query} onChange={setQuery} placeholder="Search school or chairman…" className="w-full sm:w-64" />
            <button
              type="button"
              onClick={() => void fetchSchools()}
              disabled={loadingSchools}
              className={btnClass("secondary")}
              aria-label="Refresh"
              title="Refresh"
            >
              <RefreshCw size={15} className={loadingSchools ? "animate-spin" : ""} />
            </button>
          </>
        }
        bodyClassName="p-0"
      >
        {loadingSchools ? (
          <LoadingBlock label="Loading chairman list..." />
        ) : visible.length === 0 ? (
          <EmptyState title={schools.length === 0 ? "No schools found." : "Nothing matches these filters"} />
        ) : (
          <DataTable
            minWidth={760}
            head={
              <tr>
                <Th>School</Th>
                <Th>Chairman</Th>
                <Th>Contact</Th>
                <Th align="right">Status</Th>
              </tr>
            }
          >
            {visible.map((school) => {
              const chairmen = Array.isArray(school.users) ? school.users : [];
              const schoolCell = (
                <div className="flex items-center gap-3">
                  <InitialsAvatar name={school.name} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-fg">{school.name}</p>
                    <p className="truncate text-xs text-fg-subtle">{school.location || "—"}</p>
                  </div>
                </div>
              );
              if (chairmen.length === 0) {
                return (
                  <tr key={school.id} className="hover:bg-elev-2">
                    <Td>{schoolCell}</Td>
                    <Td className="text-fg-faint">—</Td>
                    <Td className="text-fg-faint">—</Td>
                    <Td align="right">
                      <Badge tone="gold" dot>
                        Not created
                      </Badge>
                    </Td>
                  </tr>
                );
              }
              return chairmen.map((chairman, index) => (
                <tr key={`${school.id}-${chairman.id}`} className="hover:bg-elev-2">
                  <Td>{index === 0 ? schoolCell : null}</Td>
                  <Td className="font-medium text-fg">{chairman.name || "—"}</Td>
                  <Td>
                    <p className="text-fg-muted">{chairman.email || "—"}</p>
                    {chairman.mobile && <p className="text-xs text-fg-subtle tabular-nums">{chairman.mobile}</p>}
                  </Td>
                  <Td align="right">
                    <Badge tone="green" dot>
                      Assigned
                    </Badge>
                  </Td>
                </tr>
              ));
            })}
          </DataTable>
        )}
      </Panel>
    </SaPage>
  );
}
