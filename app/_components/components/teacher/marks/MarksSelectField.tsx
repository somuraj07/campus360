type Props = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  className?: string; // ✅ allow custom styling
};

export function SelectField({
  label,
  value,
  options,
  onChange,
  className = "",
}: Props) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-xs uppercase tracking-widest text-fg-muted">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          h-9 w-full
          bg-well           border border-line
          px-4 text-sm text-fg
          outline-none
          focus:border-line-strong
          transition
          rounded-full
          ${className}
        `}
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-surface">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
