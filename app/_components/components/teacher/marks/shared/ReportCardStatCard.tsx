export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-elev-1 p-4 flex items-center gap-4">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent ?? "bg-primary/10"}`}
      >
        <Icon size={20} className={accent ? "text-fg" : "text-primary"} />
      </div>
      <div>
        <p className="text-xs text-fg-subtle uppercase tracking-wider">{label}</p>
        <p className="text-xl font-bold text-fg">{value}</p>
        {sub ? <p className="text-[11px] text-fg-subtle">{sub}</p> : null}
      </div>
    </div>
  );
}
