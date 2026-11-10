"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { Column } from "../../../types/superadmin";
import { Badge, InitialsAvatar, btnClass } from "../../common/ui";
import { StudentRow } from "./types";
import { getAge } from "./utils";
import { formatResidencyTypeForDisplay } from "@/lib/students/residencyDisplay";

const getResidencyLabel = (value?: string) => {
  const raw = (value || "").trim();
  if (!raw) return "-";
  return formatResidencyTypeForDisplay(raw);
};

type Actions = {
  onView: (student: StudentRow) => void;
  onEdit: (student: StudentRow) => void;
  onDelete: (student: StudentRow) => void;
};

export const buildStudentColumns = ({
  onView,
  onEdit,
  onDelete,
}: Actions): Column<StudentRow>[] => [
  {
    header: "Student",
    render: (row) => {
      const name = row.user?.name || row.name || "Student";
      const email = row.user?.email || row.email || "";
      const photoUrl = row.user?.photoUrl || row.photoUrl || "";
      return (
        <div className="flex min-w-0 items-center gap-3">
          <InitialsAvatar name={name} src={photoUrl || null} />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-fg">{name}</div>
            <div className="truncate text-xs text-fg-subtle">{email || "-"}</div>
          </div>
        </div>
      );
    },
  },
  {
    header: "Roll No",
    render: (row) => (
      <span className="font-medium text-fg-muted tabular-nums">{row.rollNo || row.id.slice(0, 6).toUpperCase()}</span>
    ),
  },
  {
    header: "Class",
    render: (row) => (
      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
        {row.class?.name || "-"}
        {row.class?.section ? `-${row.class.section}` : ""}
      </span>
    ),
  },
  {
    header: "Gender",
    render: (row) => <span className="text-sm text-fg-muted">{row.gender || "-"}</span>,
    hideOnMobile: true,
  },
  {
    header: "Age",
    render: (row) => <span className="text-sm text-fg-muted tabular-nums">{getAge(row.dob)}</span>,
    hideOnMobile: true,
  },
  {
    header: "Type",
    render: (row) => <span className="text-sm text-fg-muted">{getResidencyLabel(row.residencyType)}</span>,
    hideOnMobile: true,
  },
  {
    header: "Status",
    render: (row) => {
      const status = row.status || "Active";
      return (
        <Badge tone={status === "Inactive" ? "red" : "green"} dot>
          {status}
        </Badge>
      );
    },
  },
  {
    header: "Actions",
    align: "right",
    render: (row) => (
      <div className="flex items-center justify-end gap-1.5">
        <button type="button" onClick={() => onView(row)} className={btnClass("secondary", "sm")} title="View">
          <Eye size={14} />
          View
        </button>
        <button type="button" onClick={() => onEdit(row)} className={btnClass("secondary", "sm")} title="Edit">
          <Pencil size={14} />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(row)}
          className={btnClass("dangerSoft", "sm")}
          title="Delete"
          aria-label={`Delete ${row.user?.name || row.name || "student"}`}
        >
          <Trash2 size={14} />
        </button>
      </div>
    ),
  },
];
