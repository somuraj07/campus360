"use client";

import clsx from "clsx";

interface SelectOption {
  label: string;
  value?: string;
  disabled?: boolean;
}

interface SelectInputProps {
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
  bgColor?: "white" | "black";
}

export default function SelectInput({
  value,
  onChange,
  options,
  disabled = false,
  className,
  label,
  error,
  bgColor = "black",
}: SelectInputProps) {
  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label className="mb-1.5 block text-[13px] font-medium text-fg">
          {label}
        </label>
      )}

      <div className="relative w-full">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          aria-invalid={!!error}
          className={clsx(
            "h-11 w-full cursor-pointer appearance-none rounded-lg border bg-surface pl-3.5 pr-10 text-sm text-fg transition",
            "focus:outline-none focus:ring-4",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
              : "border-line-strong hover:border-fg-faint focus:border-primary focus:ring-primary/10",
            bgColor === "white" && "bg-elev-2",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          {options.map((option) => (
            <option
              key={`${option.label}-${option.value ?? option.label}`}
              value={option.value ?? option.label}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown Arrow */}
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-fg-subtle">
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
