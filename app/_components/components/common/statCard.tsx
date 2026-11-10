"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  title?: string;
  value?: string | number | ReactNode;
  subtitle?: string; // ✅ NEW
  icon?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children?: ReactNode;
  iconVariant?: "boxed" | "plain";
  showBgIcon?: boolean;
  variant?: "default" | "gradientCentered"; // ✅ NEW
  gradient?: string; // ✅ NEW
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  footer,
  className = "",
  children,
  iconVariant: _iconVariant = "boxed",
  showBgIcon = false,
  variant = "default",
}: StatCardProps) {
  const isCentered = variant === "gradientCentered";

  return (
    <motion.div
      className={`
        relative overflow-hidden
        rounded-2xl
        p-4 sm:p-5
        transition-colors duration-200
        border
        group
        ${
          isCentered
            ? `bg-primary border-transparent text-on-primary`
            : `bg-elev-1 border-line`
        }
        ${className}
      `}
    >
      {/* ================= OPTIONAL BIG BACKGROUND ICON ================= */}
      {showBgIcon && icon && !isCentered && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2 scale-[2.6] text-fg-faint pointer-events-none z-0">
          {icon}
        </div>
      )}

      {/* ================= CONTENT ================= */}
      <div
        className={`relative z-10 ${
          isCentered
            ? "flex flex-col items-center justify-center text-center space-y-3"
            : ""
        }`}
      >
        {/* ================= GRADIENT CENTERED VERSION ================= */}
        {isCentered ? (
          <>
            {icon && (
              <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                {icon}
              </div>
            )}

            {value && (
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight tabular-nums">
                {value}
              </h2>
            )}

            {title && (
              <p className="text-sm opacity-80">
                {title}
              </p>
            )}

            {subtitle && (
              <p className="text-sm text-accent font-medium">
                {subtitle}
              </p>
            )}
          </>
        ) : (
          <>
            {(title || value || icon) && (
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {icon && (
                      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <div className="scale-[0.45]">
                          {icon}
                        </div>
                      </div>
                    )}

                    {title && (
                      <p className="text-fg-subtle text-[13px] font-medium uppercase tracking-wide">
                        {title}
                      </p>
                    )}
                  </div>

                  {value && (
                    <h2 className="text-3xl font-semibold tracking-tight text-fg tabular-nums">
                      {value}
                    </h2>
                  )}
                </div>
              </div>
            )}

            {children}

            {footer && (
              <div className="mt-4 text-sm text-fg-muted">
                {footer}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
