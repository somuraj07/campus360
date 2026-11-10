"use client";

import { Shield } from "lucide-react";
import clsx from "clsx";

interface RoleSelectorProps {
  value: "SCHOOLADMIN" | "TEACHER" | "STUDENT";
  onChange: (role: "SCHOOLADMIN" | "TEACHER" | "STUDENT") => void;
}

const ROLES = [
  { value: "TEACHER", label: "Teacher" },
  // { value: "SCHOOLADMIN", label: "Admin" },
  // { value: "STUDENT", label: "Student" },
] as const;

export default function RoleSelector({
  value,
  onChange,
}: RoleSelectorProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" role="radiogroup" aria-label="User role">
        {ROLES.map((role) => {
          const isActive = value === role.value;

          return (
            <label
              key={role.value}
              className={clsx(
                "flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition",
                isActive
                  ? "border-primary bg-primary/10 text-primary ring-4 ring-primary/10"
                  : "border-line-strong bg-surface text-fg-muted hover:bg-elev-2"
              )}
            >
              <input
                type="radio"
                name="role"
                value={role.value}
                checked={isActive}
                onChange={() => onChange(role.value)}
                className="sr-only"
              />

              <Shield
                size={16}
                className={clsx(
                  "transition-colors",
                  isActive ? "text-primary" : "text-fg-subtle"
                )}
              />

              {role.label}
            </label>
          );
        })}
      </div>
    </div>
  );
}
