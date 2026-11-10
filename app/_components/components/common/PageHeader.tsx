"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: string;
  /** Small label above the title (matches SaPageHeader in common/ui). */
  eyebrow?: string;
  icon?: ReactNode;
  rightSlot?: ReactNode;
  className?: string;
  center?: boolean;
  /** Kept for API compatibility; the header no longer draws a card. */
  transparent?: boolean;
  compact?: boolean;
}

/**
 * Page title row in the portal design-kit style: no card, large title, optional eyebrow,
 * actions aligned right. Prefer `SaPageHeader` from `common/ui` for new pages.
 */
export default function PageHeader({
  title,
  subtitle,
  eyebrow,
  icon,
  rightSlot,
  className = "",
  center = false,
  compact = false,
}: PageHeaderProps) {
  return (
    <header
      className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${
        compact ? "mb-4" : "mb-5 sm:mb-6"
      } ${className}`}
    >
      <div className={`min-w-0 flex-1 ${center ? "flex flex-col items-center text-center" : ""}`}>
        {eyebrow && (
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-fg">{eyebrow}</p>
        )}
        <h1
          className={`flex min-w-0 items-center gap-2.5 font-semibold tracking-tight text-fg ${
            compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-[28px]"
          } ${center ? "justify-center" : ""}`}
        >
          {icon && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {icon}
            </span>
          )}
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 max-w-2xl text-sm text-fg-subtle">{subtitle}</p>}
      </div>

      {rightSlot && (
        <div
          className={`w-full min-w-0 shrink-0 md:w-auto ${
            center ? "flex justify-center md:ml-auto md:justify-end" : ""
          }`}
        >
          {rightSlot}
        </div>
      )}
    </header>
  );
}
