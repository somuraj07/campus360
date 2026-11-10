import type { LucideIcon } from "lucide-react";
import HeaderActionButton from "../../../common/HeaderActionButton";

export function ClassesActionButton({
  type,
  Icon,
  label,
  onClick,
  primary,
  disabled,
  activeAction,
}: {
  type: "class" | "section" | "assign" | "csv" | "report";
  Icon: LucideIcon;
  label: string;
  onClick: () => void;
  primary?: boolean;
  disabled?: boolean;
  activeAction: "class" | "section" | "assign" | "csv" | "none";
}) {
  const isActive =
    (type === "class" && activeAction === "class") ||
    (type === "section" && activeAction === "section") ||
    (type === "assign" && activeAction === "assign") ||
    (type === "csv" && activeAction === "csv");

  return (
    <>
      {/* MOBILE */}
      <div className="xl:hidden">
        {isActive ? (
          <HeaderActionButton
            icon={Icon}
            label={label}
            primary={primary}
            onClick={onClick}
          />
        ) : (
          <button
            onClick={() => {
              if (!disabled) onClick();
            }}
            disabled={disabled}
            className={`h-10 w-10 flex items-center justify-center rounded-xl border border-line bg-elev-1 text-fg-muted hover:bg-elev-3 ${
              disabled ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <Icon size={18} />
          </button>
        )}
      </div>

      {/* DESKTOP */}
      <div className="hidden xl:block">
        <HeaderActionButton
          icon={Icon}
          label={label}
          primary={primary}
          onClick={() => {
            if (!disabled) onClick();
          }}
        />
      </div>
    </>
  );
}
