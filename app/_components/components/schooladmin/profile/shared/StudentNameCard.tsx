export function StudentNameCard({
  name,
  meta,
  className = "",
}: {
  name: string;
  meta?: string | null;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-line bg-elev-1 px-3 py-2.5 min-w-0 ${className}`}>
      <p className="truncate text-sm font-semibold text-fg">{name}</p>
      {meta ? <p className="mt-0.5 truncate text-xs text-fg-subtle">{meta}</p> : null}
    </div>
  );
}
