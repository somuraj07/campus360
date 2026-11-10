"use client";

interface EventSelectFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { id: string; name: string }[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function EventSelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Select option",
  disabled = false,
  className,
}: EventSelectFieldProps) {
  return (
    <div className={`space-y-2 ${className ?? ""}`.trim()}>
      <label className="text-sm text-fg-muted">{label}</label>

      <div className="relative">
        <select
          disabled={disabled}
          value={value}
          onChange={onChange}
          className={`
            w-full
            bg-well
            border
            border-line-strong
            disabled:bg-elev-2
            disabled:cursor-not-allowed
            rounded-xl
            px-4 py-3
            pr-10
            text-sm
            text-fg
            focus:outline-none
            focus:ring-0
            focus:border-primary/60
            appearance-none
            ${value === "" ? "text-fg-subtle" : "text-fg"}
          `}
        >
          <option value="">{placeholder}</option>

          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-fg-muted">
          ▾
        </span>
      </div>
    </div>
  );
}
