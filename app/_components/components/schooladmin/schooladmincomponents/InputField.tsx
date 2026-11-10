"use client";

import React from "react";
import { Search } from "lucide-react";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  required?: boolean;
  bgColor?: "black" | "white";
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  error?: string;
}

export default function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  icon,
  required = false,
  bgColor = "black",
  inputMode,
  autoComplete,
  error,
}: InputFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-fg">
        {label}
        {required ? <span className="ml-0.5 text-red-600 dark:text-red-400">*</span> : null}
      </label>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-fg-faint">
            {icon}
          </span>
        ) : null}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputMode={inputMode}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          className={`h-11 w-full rounded-lg border ${icon ? "pl-10" : "pl-3.5"} pr-3.5 text-sm text-fg transition placeholder:text-fg-faint focus:outline-none focus:ring-4 ${
            bgColor === "black" ? "bg-surface" : "bg-elev-2"
          } ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
              : "border-line-strong hover:border-fg-faint focus:border-primary focus:ring-primary/10"
          }`}
          placeholder={placeholder}
        />
      </div>
      {error ? (
        <p className="text-xs text-red-700 dark:text-red-400 mt-1.5" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-fg-subtle">
        <Search className="w-4 h-4" />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-line-strong bg-surface pl-9 pr-3 text-sm text-fg outline-none transition placeholder:text-fg-faint focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
    </div>
  );
}
