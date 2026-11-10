import type React from "react";
import { CheckCircle, ChevronDown } from "lucide-react";
import { LEAVE_TYPE_OPTIONS } from "./teacherLeaveHelpers";

export function LeaveApplicationForm({
  editingLeave,
  error,
  formData,
  setFormData,
  submitLoading,
  onSubmit,
}: {
  editingLeave: unknown;
  error: string | null;
  formData: { leaveType: string; startDate: string; endDate: string; reason: string };
  setFormData: (v: { leaveType: string; startDate: string; endDate: string; reason: string }) => void;
  submitLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="max-w-6xl mx-auto border border-line rounded-2xl md:rounded-2xl p-5 md:p-8 shadow-card animate-in slide-in-from-top-2 duration-400 bg-elev-1 ">
      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-fg ml-1">
            {editingLeave ? "Edit Leave Request" : "New Leave Request"}
          </h2>
          <div className="w-full h-px bg-elev-2"></div>
        </div>

        {error && (
          <p className="text-red-700 dark:text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-fg-subtle uppercase tracking-[0.2em] ml-1">Leave Type</label>
            <div className="relative">
              <select
                className="w-full bg-well border border-line rounded-xl py-3 px-4 appearance-none text-fg text-sm focus:outline-none focus:border-primary/50 cursor-pointer transition-all"
                value={formData.leaveType}
                onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
              >
                {LEAVE_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-surface">
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-fg-faint pointer-events-none" size={16} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-fg-subtle uppercase tracking-[0.2em] ml-1">From Date</label>
            <input
              type="date"
              required
              className="w-full bg-well border border-line rounded-xl py-3 px-4 text-fg text-sm focus:outline-none focus:border-primary/50 [color-scheme:dark] transition-all"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-fg-subtle uppercase tracking-[0.2em] ml-1">To Date</label>
            <input
              type="date"
              required
              className="w-full bg-well border border-line rounded-xl py-3 px-4 text-fg text-sm focus:outline-none focus:border-primary/50 [color-scheme:dark] transition-all"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-fg-subtle uppercase tracking-[0.2em] ml-1">Reason for Leave</label>
          <textarea
            required
            placeholder="Provide a detailed reason..."
            rows={4}
            className="w-full bg-well border border-line rounded-xl p-4 text-fg text-sm focus:outline-none focus:border-primary/50 resize-none placeholder:text-fg-faint transition-all"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitLoading}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-on-primary px-8 py-4 md:py-3 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-60"
          >
            <CheckCircle size={18} strokeWidth={3} />
            <span>{submitLoading ? "Processing..." : (editingLeave ? "Update Application" : "Submit Application")}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
