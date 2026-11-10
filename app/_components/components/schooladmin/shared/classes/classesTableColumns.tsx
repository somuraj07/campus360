import { Eye, Pencil, Trash2, Users } from "lucide-react";
import type { SchoolAdminClassRow } from "@/lib/school/loadSchoolAdminFastTabs";

function initials(s: string) {
  return (
    s
      .replace(/^(grade|class|std\.?)\s*/i, "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?"
  );
}

type Mode = "view" | "edit" | "delete";

export function buildClassesTableColumns({
  activeRowId,
  panelMode,
  setActiveRowId,
  setPanelMode,
  closePanel,
}: {
  activeRowId: string | null;
  panelMode: Mode | null;
  setActiveRowId: (id: string) => void;
  setPanelMode: (mode: Mode | null) => void;
  closePanel: () => void;
}) {
  const toggle = (row: SchoolAdminClassRow, mode: Mode) => {
    if (activeRowId === row.id && panelMode === mode) {
      closePanel();
      return;
    }
    setActiveRowId(row.id);
    setPanelMode(mode);
  };
  const isOpen = (row: SchoolAdminClassRow, mode: Mode) => activeRowId === row.id && panelMode === mode;

  const actionBtn =
    "inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-colors";

  return [
    {
      header: "Class",
      render: (row: SchoolAdminClassRow) => (
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
            {initials(row.name)}
          </span>
          <span className="font-semibold text-fg">{row.name}</span>
        </div>
      ),
    },
    {
      header: "Section",
      render: (row: SchoolAdminClassRow) => (
        <span className="inline-flex items-center rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent-fg">
          {row.section}
        </span>
      ),
    },
    {
      header: "Students",
      align: "center" as const,
      render: (row: SchoolAdminClassRow) => (
        <span className="inline-flex items-center gap-1.5 font-semibold text-fg tabular-nums">
          <Users size={14} className="text-fg-faint" />
          {row.students}
        </span>
      ),
    },
    {
      header: "Class Teacher",
      render: (row: SchoolAdminClassRow) => {
        const assigned = row.teacher && row.teacher !== "—" && row.teacher !== "Unassigned";
        return assigned ? (
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-[11px] font-semibold text-sky-700 dark:text-sky-300">
              {initials(row.teacher)}
            </span>
            <div className="min-w-0">
              <div className="truncate font-medium text-fg">{row.teacher}</div>
              <div className="truncate text-xs text-fg-subtle">{row.subject}</div>
            </div>
          </div>
        ) : (
          <span className="text-xs font-medium text-amber-700 dark:text-amber-300">{row.teacher || "Unassigned"}</span>
        );
      },
    },
    {
      header: "Actions",
      align: "right" as const,
      render: (row: SchoolAdminClassRow) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => toggle(row, "view")}
            aria-expanded={isOpen(row, "view")}
            className={`${actionBtn} ${
              isOpen(row, "view") ? "border-primary bg-primary text-on-primary" : "border-line-strong bg-surface text-fg hover:bg-elev-2"
            }`}
            title="View"
          >
            <Eye size={14} />
            View
          </button>
          <button
            type="button"
            onClick={() => toggle(row, "edit")}
            aria-expanded={isOpen(row, "edit")}
            className={`${actionBtn} ${
              isOpen(row, "edit") ? "border-primary bg-primary text-on-primary" : "border-line-strong bg-surface text-fg hover:bg-elev-2"
            }`}
            title="Edit"
          >
            <Pencil size={14} />
            Edit
          </button>
          <button
            type="button"
            onClick={() => toggle(row, "delete")}
            aria-expanded={isOpen(row, "delete")}
            aria-label={`Delete ${row.name}`}
            className={`${actionBtn} ${
              isOpen(row, "delete")
                ? "border-red-600 bg-red-600 text-white"
                : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
            }`}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];
}
