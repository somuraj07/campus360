"use client";

import { Building2, Clock, Mail, Send } from "lucide-react";
import { Alert, Field, SelectInput, TextInput, btnClass } from "./shared/ui";
import { useCallback, useEffect, useState } from "react";
import { formatScheduleTimeForDisplay } from "@/lib/backupScheduleUtils";
import {
  fetchBackupSchedule,
  saveBackupSchedule,
  sendBackupEmailNow,
  type BackupSchedule,
} from "@/lib/api/backupSchedule";

type SchoolOption = { id: string; name: string };

export default function BackupEmailPanel({ schools }: { schools: SchoolOption[] }) {
  const [schedule, setSchedule] = useState<BackupSchedule>({
    enabled: false,
    scheduleTime: "06:00",
    recipient: "timelly26@gmail.com",
    schoolId: null,
    schoolName: null,
    lastSentAt: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSchedule = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { ok, data } = await fetchBackupSchedule();
      if (!ok) throw new Error(data.message || "Failed to load backup schedule");
      if (data.schedule) setSchedule(data.schedule);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load backup schedule");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSchedule();
  }, [loadSchedule]);

  const saveSchedule = async (patch: Partial<BackupSchedule>) => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const { ok, data } = await saveBackupSchedule(patch);
      if (!ok) throw new Error(data.message || "Failed to save schedule");
      if (data.schedule) setSchedule(data.schedule);
      setMessage("Settings saved (this does not send an email). Use “Send backup now” to email the Excel.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save schedule");
    } finally {
      setSaving(false);
    }
  };

  const handleSendNow = async () => {
    setSending(true);
    setError(null);
    setMessage(null);
    try {
      const { ok, data } = await sendBackupEmailNow({
        recipient: schedule.recipient,
        schoolId: schedule.schoolId,
      });
      if (!ok) throw new Error(data.message || "Failed to send backup email");
      const names = data.schoolsSent?.join(", ") || "school(s)";
      setMessage(`Backup sent to ${schedule.recipient} (${names})`);
      await loadSchedule();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send backup email");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-fg-subtle">Loading backup email settings…</p>;
  }

  const busy = saving || sending;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-fg">Daily automation</p>
          <p className="mt-0.5 max-w-2xl text-xs text-fg-subtle">
            <span className="font-medium text-fg">Send backup now</span> emails immediately. With daily automation on,
            keep the server running — it checks every ~2 minutes and sends{" "}
            <span className="font-medium text-fg">once per day</span> after your IST time.
          </p>
        </div>
        <label className="inline-flex shrink-0 cursor-pointer items-center gap-3">
          <span className="text-sm font-medium text-fg">{schedule.enabled ? "On" : "Off"}</span>
          <span className="relative inline-flex">
            <input
              type="checkbox"
              role="switch"
              aria-label="Daily automation on"
              checked={schedule.enabled}
              disabled={busy}
              onChange={(e) => void saveSchedule({ enabled: e.target.checked })}
              className="peer sr-only"
            />
            <span className="h-6 w-11 rounded-full bg-elev-3 transition peer-checked:bg-primary peer-disabled:opacity-50" />
            <span className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Field label="Daily time (IST)" hint={formatScheduleTimeForDisplay(schedule.scheduleTime)}>
          <TextInput
            icon={Clock}
            type="time"
            value={schedule.scheduleTime}
            disabled={busy}
            onChange={(e) => setSchedule((s) => ({ ...s, scheduleTime: e.target.value }))}
            onBlur={() => void saveSchedule({ scheduleTime: schedule.scheduleTime })}
          />
        </Field>
        <Field label="Recipient email">
          <TextInput
            icon={Mail}
            type="email"
            value={schedule.recipient}
            disabled={busy}
            onChange={(e) => setSchedule((s) => ({ ...s, recipient: e.target.value }))}
            onBlur={() => void saveSchedule({ recipient: schedule.recipient })}
            placeholder="timelly26@gmail.com"
          />
        </Field>
        <Field label="School">
          <SelectInput
            icon={Building2}
            value={schedule.schoolId ?? ""}
            disabled={busy}
            onChange={(e) => {
              const schoolId = e.target.value || null;
              setSchedule((s) => ({ ...s, schoolId }));
              void saveSchedule({ schoolId });
            }}
          >
            <option value="">All active schools</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <div className="flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-fg-subtle">
          {schedule.lastSentAt
            ? `Last sent: ${new Date(schedule.lastSentAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`
            : "No backup sent yet"}
          {!schedule.enabled && (
            <span className="ml-2 font-medium text-amber-700 dark:text-amber-300">· Daily auto-send is off</span>
          )}
        </p>
        <button type="button" onClick={() => void handleSendNow()} disabled={busy} className={btnClass("primary")}>
          {sending ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-primary/30 border-t-on-primary" />
          ) : (
            <Send size={16} />
          )}
          {sending ? "Sending… (can take 1–2 min)" : "Send backup now"}
        </button>
      </div>

      {message && <Alert tone="success">{message}</Alert>}
      {error && <Alert tone="error">{error}</Alert>}
    </div>
  );
}
