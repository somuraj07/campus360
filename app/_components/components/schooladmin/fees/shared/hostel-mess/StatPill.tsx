export function StatPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "sky" | "lime" | "amber" | "ok";
}) {
  const toneClass =
    tone === "sky"
      ? "border-sky-500/30 bg-sky-500/10 text-sky-800 dark:text-sky-100"
      : tone === "lime"
        ? "border-primary/30 bg-primary/10 text-primary"
        : tone === "amber"
          ? "border-amber-500/35 bg-amber-500/10 text-amber-800 dark:text-amber-100"
          : tone === "ok"
            ? "border-primary/25 bg-primary/5 text-primary"
            : "border-line bg-elev-1 text-fg";
  return (
    <div className={`rounded-xl border px-3 py-2 text-center min-w-[4.5rem] ${toneClass}`}>
      <div className="text-[10px] font-semibold uppercase tracking-wide opacity-70">{label}</div>
      <div className="text-base font-bold tabular-nums">{value}</div>
    </div>
  );
}
