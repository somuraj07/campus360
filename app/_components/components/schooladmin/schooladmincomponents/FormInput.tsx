interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  error?: boolean;
}

export default function FormInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  helperText,
  error = false,
}: FormInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-fg mb-2">
        {label} {required && "*"}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-2 rounded-lg bg-elev-2 border
          text-fg placeholder:text-fg-subtle outline-none
          focus:bg-elev-3 focus:border-primary/40 transition
          ${error ? "border-red-400/50" : "border-line-strong"}`}
      />
      {helperText && (
        <p className="text-xs text-fg-muted mt-1">{helperText}</p>
      )}
    </div>
  );
}
