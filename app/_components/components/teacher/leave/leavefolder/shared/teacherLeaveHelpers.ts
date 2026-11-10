export const LEAVE_TYPE_OPTIONS = [
  { label: "Sick Leave", value: "SICK" },
  { label: "Casual Leave", value: "CASUAL" },
  { label: "Emergency Leave", value: "UNPAID" },
  { label: "Duty Leave", value: "PAID" },
];

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function leaveTypeLabel(t: string) {
  return LEAVE_TYPE_OPTIONS.find((o) => o.value === t)?.label ?? t;
}

export function statusStyle(s: string) {
  if (s === "APPROVED") return "bg-primary/10 text-primary border-primary/30";
  if (s === "CONDITIONALLY_APPROVED") return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30";
  if (s === "REJECTED") return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30";
  return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30";
}
