export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-fg">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full cursor-pointer rounded-lg border border-line-strong bg-surface px-3.5 text-sm text-fg transition hover:border-fg-faint focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SectionTitle({ title }: { title: string }) {
  return <div className="text-[15px] font-semibold text-fg">{title}</div>;
}
