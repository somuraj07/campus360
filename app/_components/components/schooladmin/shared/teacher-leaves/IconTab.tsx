import type { LucideIcon } from "lucide-react";

export function IconTab({
  label,
  count,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  count: number;
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm ${active
        ? "bg-elev-1 text-primary border-b-2 border-primary"
        : "text-fg-muted hover:text-fg"
        }`}
    >
      <Icon size={16} />
      <span>
        {label} <span className="hidden sm:inline">({count})</span>
        <span className="sm:hidden">({count})</span>
      </span>
    </button>
  );
}
