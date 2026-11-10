"use client";

import { X } from "lucide-react";
import { StudentRow } from "./types";
import { getAge } from "./utils";
import { AVATAR_URL } from "../../../constants/images";
import { formatStoredAddressForDisplay } from "@/lib/students/studentAddressFormat";
import { formatResidencyTypeForDisplay } from "@/lib/students/residencyDisplay";

type Props = {
  student: StudentRow;
  onClose: () => void;
  onEdit: () => void;
};

export default function StudentDetailsModal({ student, onClose, onEdit }: Props) {
  const name = student.user?.name || student.name || "Student";
  const email = student.user?.email || student.email || "-";
  const photoUrl = student.user?.photoUrl || student.photoUrl || AVATAR_URL;
  const className = student.class?.name || "-";
  const sectionName = student.class?.section || "-";
  const studentId = student.rollNo || student.admissionNumber || student.id.slice(0, 6).toUpperCase();
  const addressDisplay = (() => {
    const f = formatStoredAddressForDisplay(student.address || "");
    return f === "—" ? "-" : f;
  })();

  return (
    <div className="fixed inset-0 bg-overlay flex items-center justify-center z-[100] animate-fadeIn p-4">
      <div className="bg-surface rounded-2xl shadow-pop max-w-2xl w-full animate-scaleIn border border-line max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="sticky top-0 bg-surface px-4 md:px-6 py-4 md:py-5 border-b border-line">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-bold text-fg">Student Details</h2>
            <button onClick={onClose} className="p-2 hover:bg-elev-2 rounded-lg transition-all">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-5">
          <div className="flex items-center gap-4 pb-4 border-b border-line">
            <img
              src={photoUrl}
              alt={name}
              className="h-14 w-14 rounded-2xl object-cover border border-line"
            />
            <div>
              <div className="text-lg font-bold text-fg">{name}</div>
              <div className="text-sm text-fg-muted">{studentId}</div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold border mt-2 bg-primary/10 text-primary border-primary/20">
                {student.status || "Active"}
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-fg-muted mb-3">Academic Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-elev-1 rounded-lg p-3 border border-line">
                <p className="text-xs text-fg-subtle mb-1">Class</p>
                <p className="text-sm font-semibold text-fg">{className}</p>
              </div>
              <div className="bg-elev-1 rounded-lg p-3 border border-line">
                <p className="text-xs text-fg-subtle mb-1">Section</p>
                <p className="text-sm font-semibold text-fg">{sectionName}</p>
              </div>
              <div className="bg-elev-1 rounded-lg p-3 border border-line">
                <p className="text-xs text-fg-subtle mb-1">Gender</p>
                <p className="text-sm font-semibold text-fg">{student.gender || "-"}</p>
              </div>
              <div className="bg-elev-1 rounded-lg p-3 border border-line">
                <p className="text-xs text-fg-subtle mb-1">Age</p>
                <p className="text-sm font-semibold text-fg">{getAge(student.dob)}</p>
              </div>
              <div className="bg-elev-1 rounded-lg p-3 border border-line">
                <p className="text-xs text-fg-subtle mb-1">Residency</p>
                <p className="text-sm font-semibold text-fg">
                  {formatResidencyTypeForDisplay(student.residencyType || "Day Scholar")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 space-y-2">
            <p className="text-xs text-primary mb-1">Parent Information</p>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-xs text-primary mb-1">Parent Name</span>
                <div className="text-sm font-semibold text-fg">{student.fatherName || "-"}</div>
              </div>
              <div>
                <span className="text-xs text-primary mb-1">Email</span>
                <div className="text-sm font-semibold text-fg">{email}</div>
              </div>
              <div>
                <span className="text-xs text-primary mb-1">Phone</span>
                <div className="text-sm font-semibold text-fg">{student.phoneNo || "-"}</div>
              </div>
              <div>
                <span className="text-xs text-primary mb-1">Address</span>
                <div className="text-sm font-semibold text-fg">{addressDisplay}</div>
              </div>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 md:px-6 py-2.5 border border-line
               rounded-xl text-fg-muted font-medium hover:bg-elev-2 transition-all text-sm"
            >
              Close
            </button>
            <button
              onClick={onEdit}
              className="flex-1 px-4 md:px-6 py-2.5 bg-primary hover:bg-primary-hover text-on-primary rounded-xl font-medium transition-all
               text-sm flex items-center justify-center gap-2"
            >
              Edit Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
