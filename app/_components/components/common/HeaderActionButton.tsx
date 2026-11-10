"use client";

import { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  primary?: boolean;
}

export default function HeaderActionButton({
  icon: Icon,
  label,
  onClick,
  primary,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2
        h-10 px-4
        rounded-xl text-sm font-semibold
        transition
        flex-1 sm:flex-none cursor-pointer
        ${primary
          ? "bg-primary text-on-primary hover:bg-primary-hover"
          : "border border-line bg-elev-2 text-fg hover:bg-elev-3"}
      `}
    >
      <Icon size={16} />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}
