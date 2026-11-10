"use client";

import { ReactNode } from "react";

type AttendanceButtonVariant =
  | "neutral"
  | "primary"
  | "success"
  | "danger"
  | "warning"
  | "ghost";

interface AttendanceButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: AttendanceButtonVariant;
  size?: "sm" | "md";
  active?: boolean;
  leftIcon?: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const VARIANT_CLASSES: Record<AttendanceButtonVariant, string> = {
  neutral:
    "bg-elev-2 border-line-subtle text-fg hover:bg-elev-3 hover:border-line-strong",
  primary:
    "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50",
  success:
    "bg-primary text-on-primary border-primary hover:bg-primary-hover",
  danger:
    "bg-red-500 text-white border-red-400 hover:bg-red-400",
  warning:
    "bg-amber-400 text-black border-amber-300 hover:bg-amber-300",
  ghost:
    "bg-elev-1 border-line text-fg-muted hover:bg-elev-3 hover:border-line-strong",
};

const SIZE_CLASSES = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-5 text-sm",
};

export default function AttendanceButton({
  children,
  onClick,
  className = "",
  variant = "ghost",
  size = "md",
  active = false,
  leftIcon,
  type = "button",
  disabled = false,
}: AttendanceButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex items-center gap-2 rounded-xl border",
        "font-semibold transition-all duration-200",
        "select-none",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        disabled ? "" : " hover:brightness-110",
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        active ? "" : "",
        className,
      ].join(" ")}
    >
      {leftIcon ? <span className="flex items-center">{leftIcon}</span> : null}
      <span>{children}</span>
    </button>
  );
}
