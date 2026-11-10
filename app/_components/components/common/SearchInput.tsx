"use client";

import { useEffect, useRef, useState, ComponentType } from "react";
import { LucideProps, Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onIconClick?: () => void;
  placeholder?: string;

  icon?: ComponentType<LucideProps>;
  showSearchIcon?: boolean;
  iconPosition?: "left" | "right";
  iconClickable?: boolean;
  iconAriaLabel?: string;

  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  type?: string;
  label?: string;
  iconClassName?: string;
  error?: string;

  variant?: "default" | "glass"; // 👈 NEW (non-breaking)
}

export default function SearchInput({
  value,
  onChange,
  onKeyDown,
  onIconClick,
  placeholder = "Search...",
  icon,
  showSearchIcon = true,
  iconPosition = "left",
  iconClickable = false,
  iconAriaLabel = "Input icon",
  disabled = false,
  className,
  inputClassName,
  label,
  type = "text",
  iconClassName = "text-fg-muted",
  error,
  variant = "default", // 👈 default safe
}: SearchInputProps) {
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const Icon = icon ?? null;
  const shouldShowIcon = mounted && Icon && showSearchIcon;
  const iconOnRight = iconPosition === "right";
  const shouldRenderIconButton = shouldShowIcon && iconClickable && !disabled;

  const handleIconClick = () => {
    if (onIconClick) {
      onIconClick();
      return;
    }
    if (!inputRef.current) return;
    if (typeof inputRef.current.showPicker === "function") {
      inputRef.current.showPicker();
    }
    inputRef.current.focus();
  };

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  const isGlass = variant === "glass";

  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label className="mb-1.5 block text-[13px] font-medium text-fg">
          {label}
        </label>
      )}

      <div className="relative w-full">

        {shouldShowIcon && !shouldRenderIconButton && (
          <Icon
            size={16}
            className={clsx(
              "absolute top-1/2 -translate-y-1/2",
              iconOnRight ? "right-3.5" : "left-3.5",
              "z-10 pointer-events-none",
              isGlass ? "text-fg-faint" : iconClassName === "text-fg-muted" ? "text-fg-faint" : iconClassName
            )}
          />
        )}
        {shouldRenderIconButton && (
          <button
            type="button"
            onClick={handleIconClick}
            aria-label={iconAriaLabel}
            className={clsx(
              "absolute top-1/2 -translate-y-1/2",
              iconOnRight ? "right-3" : "left-3",
              "z-10 rounded-full p-1.5",
              "text-fg-muted hover:text-fg",
              "hover:bg-elev-3"
            )}
          >
            <Icon size={18} />
          </button>
        )}

        <input
          type={inputType}
          ref={inputRef}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={onKeyDown}
          aria-invalid={!!error}
          className={clsx(
            "h-11 w-full rounded-lg border bg-surface text-sm text-fg transition",
            shouldShowIcon && !iconOnRight ? "pl-10" : "pl-3.5",
            shouldShowIcon && iconOnRight ? "pr-10" : type === "password" ? "pr-10" : "pr-3.5",
            "placeholder:text-fg-faint focus:outline-none focus:ring-4",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
              : "border-line-strong hover:border-fg-faint focus:border-primary focus:ring-primary/10",
            disabled && "cursor-not-allowed opacity-60",
            isGlass && "bg-surface",
            inputClassName
          )}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 inset-y-0 flex items-center text-fg-muted hover:text-fg"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
