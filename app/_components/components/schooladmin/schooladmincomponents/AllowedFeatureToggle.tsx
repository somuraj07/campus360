"use client";

interface FeatureToggleProps {
  label: string;
  description?: string;
  checked?: boolean;
  onChange: () => void;
  className?: string;
  labelClassName?: string;
}

export default function AllowedFeatureToggle({
  label,
  description,
  checked = false,
  onChange,
  className,
  labelClassName,
}: FeatureToggleProps) {
  return (
    <label
      className={[
        "flex items-center justify-between gap-3 rounded-xl border border-line bg-surface p-3.5 cursor-pointer transition hover:border-primary/40",
        className || "",
      ].join(" ")}
    >
      <span>
        <span className={["text-sm text-fg font-medium", labelClassName || ""].join(" ")}>{label}</span>
        {description ? <span className="block text-xs text-fg-muted mt-1">{description}</span> : null}
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={[
          "relative inline-flex h-6 w-12 flex-shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
          checked ? "bg-primary" : "bg-elev-3",
        ].join(" ")}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}
