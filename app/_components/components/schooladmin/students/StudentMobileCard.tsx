"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { AVATAR_URL } from "../../../constants/images";
import { StudentRow } from "./types";
import { getAge } from "./utils";
import { formatResidencyTypeForDisplay } from "@/lib/students/residencyDisplay";

const getResidencyLabel = (value?: string) => {
  const raw = (value || "").trim();
  if (!raw) return "-";
  return formatResidencyTypeForDisplay(raw);
};

type Props = {
  student: StudentRow;
  index: number;
  onView: (student: StudentRow) => void;
  onEdit: (student: StudentRow) => void;
  onDelete: (student: StudentRow) => void;
};

export default function StudentMobileCard({
  student,
  index,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const name = student.user?.name || student.name || "Student";
  const photoUrl = student.user?.photoUrl || student.photoUrl || AVATAR_URL;
  const studentId =
    student.rollNo || student.admissionNumber || student.id.slice(0, 6).toUpperCase();
  const isInactive = student.status === "Inactive";
  const classLabel = student.class?.name
    ? `${student.class.name}${student.class.section ? ` · ${student.class.section}` : ""}`
    : "No class";

  return (
    <article
      style={{ animationDelay: `${index * 40}ms` }}
      className="somu rounded-2xl p-5 animate-fadeIn"
    >
      <div className="flex items-start gap-3">
        <img
          src={photoUrl}
          alt={name}
          className="h-12 w-12 rounded-xl object-cover border border-line shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-primary truncate">{classLabel}</p>
          <h3 className="text-lg font-semibold text-fg truncate">{name}</h3>
          <p className="text-sm text-fg-muted truncate">
            ID {studentId} · {getResidencyLabel(student.residencyType)}
          </p>
        </div>
        <span
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border ${
            isInactive
              ? "border-red-400/30 bg-red-400/10 text-red-700 dark:text-red-300"
              : "border-primary/30 bg-primary/10 text-primary"
          }`}
        >
          {student.status || "Active"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl border border-line bg-well px-3 py-2">
          <p className="text-[11px] text-fg-subtle">Gender</p>
          <p className="font-semibold text-fg">{student.gender || "—"}</p>
        </div>
        <div className="rounded-xl border border-line bg-well px-3 py-2">
          <p className="text-[11px] text-fg-subtle">Age</p>
          <p className="font-semibold text-fg">{getAge(student.dob)}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onView(student)}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-line-strong py-2.5 text-xs font-semibold text-fg hover:bg-elev-2 transition"
        >
          <Eye size={14} /> View
        </button>
        <button
          type="button"
          onClick={() => onEdit(student)}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-primary/40 py-2.5 text-xs font-semibold text-primary hover:bg-primary/10 transition"
        >
          <Pencil size={14} /> Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(student)}
          className="inline-flex items-center justify-center rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2.5 text-red-700 dark:text-red-300 hover:bg-red-500/20 transition"
          aria-label="Delete student"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </article>
  );
}
