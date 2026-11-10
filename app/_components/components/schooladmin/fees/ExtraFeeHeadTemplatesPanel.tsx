"use client";

import { useCallback, useEffect, useState } from "react";
import PrimaryButton from "../../common/PrimaryButton";
import { invalidateAssignCatalogCache } from "@/lib/fees/assignFeeCatalogCache";
import {
  createExtraFeeHeadTemplate,
  deleteExtraFeeHeadTemplate,
  fetchExtraFeeHeadTemplates,
  updateExtraFeeHeadTemplate,
} from "@/lib/api/extraFeeHeadTemplates";
import { fieldClass, fieldLabelClass } from "../../common/ui";

const inputClass = fieldClass;

const labelClass = fieldLabelClass;

type Template = { id: string; name: string; amount: number; splitIntoTwoInstallments: boolean };

function sanitizeMoneyInput(raw: string): string {
  if (!raw) return "";
  const cleaned = raw.replace(/[^\d.]/g, "");
  const dot = cleaned.indexOf(".");
  if (dot === -1) return cleaned;
  const intPart = cleaned.slice(0, dot).replace(/\D/g, "");
  const frac = cleaned.slice(dot + 1).replace(/\D/g, "").slice(0, 2);
  return frac.length > 0 ? `${intPart}.${frac}` : `${intPart}.`;
}

export default function ExtraFeeHeadTemplatesPanel({ onSuccess }: { onSuccess?: () => void }) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newSplitIntoTwoInstallments, setNewSplitIntoTwoInstallments] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editSplitIntoTwoInstallments, setEditSplitIntoTwoInstallments] = useState(false);
  const [rowSavingId, setRowSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { ok, data } = await fetchExtraFeeHeadTemplates();
      if (!ok) throw new Error(typeof data.message === "string" ? data.message : "Failed to load heads");
      const list = Array.isArray(data.templates) ? data.templates : [];
      setTemplates(
        list
          .map((x: { id?: string; name?: string; amount?: number; splitIntoTwoInstallments?: boolean }) => ({
            id: String(x.id ?? ""),
            name: String(x.name ?? "").trim(),
            amount: Number(x.amount),
            splitIntoTwoInstallments: Boolean(x.splitIntoTwoInstallments),
          }))
          .filter((x: Template) => x.id && x.name && Number.isFinite(x.amount) && x.amount > 0)
      );
    } catch (e) {
      console.error(e);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const addHead = async () => {
    const name = newName.trim();
    const amt = Number(newAmount);
    if (!name || !Number.isFinite(amt) || amt <= 0) {
      alert("Enter a head title and a valid amount (₹).");
      return;
    }
    setAdding(true);
    try {
      const { ok, data } = await createExtraFeeHeadTemplate({
        name,
        amount: amt,
        splitIntoTwoInstallments: newSplitIntoTwoInstallments,
      });
      if (!ok) {
        alert(data.message || "Could not save head");
        return;
      }
      setNewName("");
      setNewAmount("");
      setNewSplitIntoTwoInstallments(false);
      invalidateAssignCatalogCache();
      await load();
      onSuccess?.();
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (t: Template) => {
    setEditingId(t.id);
    setEditName(t.name);
    setEditAmount(String(t.amount));
    setEditSplitIntoTwoInstallments(t.splitIntoTwoInstallments);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditAmount("");
    setEditSplitIntoTwoInstallments(false);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const name = editName.trim();
    const amt = Number(editAmount);
    if (!name || !Number.isFinite(amt) || amt <= 0) {
      alert("Enter a valid title and amount.");
      return;
    }
    setRowSavingId(editingId);
    try {
      const { ok, data } = await updateExtraFeeHeadTemplate(editingId, {
        name,
        amount: amt,
        splitIntoTwoInstallments: editSplitIntoTwoInstallments,
      });
      if (!ok) {
        alert(data.message || "Could not update head");
        return;
      }
      invalidateAssignCatalogCache();
      cancelEdit();
      await load();
      onSuccess?.();
    } finally {
      setRowSavingId(null);
    }
  };

  const remove = async (id: string) => {
    if (
      !confirm(
        "Remove this saved fee head? It will disappear from the admission catalog until you create it again."
      )
    ) {
      return;
    }
    setDeletingId(id);
    try {
      const { ok, data } = await deleteExtraFeeHeadTemplate(id);
      if (!ok) {
        alert(data.message || "Could not delete");
        return;
      }
      if (editingId === id) cancelEdit();
      invalidateAssignCatalogCache();
      await load();
      onSuccess?.();
    } finally {
      setDeletingId(null);
    }
  };

  const splitCheckbox = (checked: boolean, onChange: (v: boolean) => void, idPrefix: string) => (
    <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-line bg-well px-3 py-2.5 text-xs text-fg-muted md:col-span-2">
      <input
        id={`${idPrefix}-split-2`}
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-line-strong bg-well text-primary focus:ring-primary/40"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        <span className="font-medium text-fg">Two installments (50% + 50%)</span>
        <span className="mt-0.5 block text-[11px] text-fg-subtle">
          When assigned to a student, show as 1st and 2nd installment on the fee breakdown (same idea as hostel).
        </span>
      </span>
    </label>
  );

  return (
    <section className="rounded-2xl border border-line bg-elev-1 p-5 sm:p-6">
      <header className="mb-6 border-b border-line pb-5">
        <h3 className="text-lg font-semibold tracking-tight text-fg">Custom fee heads (saved templates)</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-fg-muted">
          Add any number of title + amount pairs. They are stored as reusable heads — students are not charged until
          you assign them on <span className="font-medium text-fg-muted">Student Details → Fees → Assign from catalog</span>{" "}
          (or Admission → Assign Fees).
        </p>
      </header>

      <div className="rounded-xl border border-line bg-well p-4 sm:p-5 space-y-4">
        <div className="text-xs font-semibold text-fg">Saved heads</div>
        {loading ? (
          <p className="text-sm text-fg-subtle py-4">Loading…</p>
        ) : templates.length === 0 ? (
          <p className="text-sm text-fg-subtle py-2">No custom heads yet. Add one below.</p>
        ) : (
          <ul className="max-h-64 overflow-y-auto space-y-2 pr-1">
            {templates.map((t) => (
              <li
                key={t.id}
                className="rounded-lg border border-line bg-elev-1 px-3 py-3 text-sm text-fg"
              >
                {editingId === t.id ? (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:items-end">
                    <div>
                      <label className={labelClass}>Head title</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className={inputClass}
                        placeholder="e.g. Books / Sports"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Amount (₹)</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        value={editAmount}
                        onChange={(e) => setEditAmount(sanitizeMoneyInput(e.target.value))}
                        className={inputClass}
                        placeholder="0.00"
                      />
                    </div>
                    {splitCheckbox(editSplitIntoTwoInstallments, setEditSplitIntoTwoInstallments, `edit-${t.id}`)}
                    <div className="flex flex-wrap gap-2 md:col-span-2">
                      <button
                        type="button"
                        onClick={() => void saveEdit()}
                        disabled={rowSavingId === t.id}
                        className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-xs font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-55"
                      >
                        {rowSavingId === t.id ? "Saving…" : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="rounded-xl border border-line-strong px-3 py-2 text-xs text-fg-muted hover:bg-elev-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="font-medium text-fg">{t.name}</span>
                      <span className="text-fg-subtle"> · </span>
                      <span className="text-primary">₹{t.amount.toLocaleString("en-IN")}</span>
                      {t.splitIntoTwoInstallments ? (
                        <span className="ml-2 rounded-md border border-sky-500/30 bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-800 dark:text-sky-200">
                          2 installments
                        </span>
                      ) : null}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(t)}
                        className="rounded-lg border border-line-strong px-3 py-1.5 text-xs text-fg hover:bg-elev-3"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void remove(t.id)}
                        disabled={deletingId === t.id}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-800 dark:text-red-200 hover:bg-red-500/20 disabled:opacity-50"
                      >
                        {deletingId === t.id ? "…" : "Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="border-t border-line pt-4 space-y-3">
          <div className="text-xs font-semibold text-fg">New head</div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:items-end">
            <div>
              <label className={labelClass} htmlFor="new-fee-head-title">
                Head title
              </label>
              <input
                id="new-fee-head-title"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className={inputClass}
                placeholder="e.g. Transport / Lab / Uniform"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="new-fee-head-amount">
                Amount (₹)
              </label>
              <input
                id="new-fee-head-amount"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={newAmount}
                onChange={(e) => setNewAmount(sanitizeMoneyInput(e.target.value))}
                className={inputClass}
                placeholder="0.00"
              />
            </div>
            {splitCheckbox(newSplitIntoTwoInstallments, setNewSplitIntoTwoInstallments, "new")}
            <div className="md:col-span-2">
              <PrimaryButton title={adding ? "Saving…" : "Save head"} loading={adding} onClick={() => void addHead()} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
