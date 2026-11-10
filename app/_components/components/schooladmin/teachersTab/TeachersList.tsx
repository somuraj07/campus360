"use client";

import { useState } from "react";
import { Eye, Pencil, Trash2, Search } from "lucide-react";
import ShowTeacher from "./ShowTeacher";

/* ================= Types ================= */

export interface TeacherRow {
  id: string;
  teacherId: string;
  name: string;
  avatar: string;
  subject: string;
  attendance: number;
  phone: string;
  status: "Active" | "On Leave";
}

interface Props {
  teachersLoading: boolean;
  filteredTeachers: TeacherRow[];
  pagedTeachers: TeacherRow[];
  attendanceDate: string;
  overallPct: number;
  presentCount: number;
  teachersCount: number;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  page: number;
  totalPages: number;
  setPage: (p: number) => void;
  onDelete: (id: string) => void;
  onEditTeacher: (teacher: TeacherRow) => void;
}

/* ================= Component ================= */

export default function TeachersList({
  teachersLoading,
  filteredTeachers,
  pagedTeachers,
  searchTerm,
  setSearchTerm,
  page,
  totalPages,
  setPage,
  onDelete,
  onEditTeacher,
}: Props) {
  const [viewTeacher, setViewTeacher] =
    useState<TeacherRow | null>(null);

  return (
    <div className="w-full">
      {/* Desktop table */}
      <div className="rounded-2xl overflow-hidden border border-line bg-elev-1 hidden md:block">

        {/* ===== Header ===== */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-line">
          <h2 className="text-xl font-semibold text-fg">
            All Teachers ({filteredTeachers.length})
          </h2>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" />
            <input
              type="text"
              placeholder="Search list..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl 
                bg-well border border-line 
                text-sm text-fg placeholder:text-fg-faint 
                focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* ===== Table ===== */}
        <div className="w-full overflow-x-auto">
          <table className="min-w-[1100px] w-full text-sm text-fg-muted">
            <thead className="text-fg-muted uppercase text-xs tracking-wider">
              <tr className="border-b border-line text-left">
                <th className="px-6 py-4">Teacher ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4 text-center">Attendance</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {pagedTeachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="border-t border-line hover:bg-elev-2 transition-colors"
                >
                  {/* Teacher ID */}
                  <td className="px-6 py-5 text-fg-muted font-medium">
                    {teacher.teacherId}
                  </td>

                  {/* Name + Avatar */}
                  <td className="px-6 py-5 flex items-center gap-4">
                    <img
                      src={teacher.avatar}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <span className="font-semibold text-fg">
                      {teacher.name}
                    </span>
                  </td>

                  {/* Subject */}
                  <td className="px-6 py-5">{teacher.subject}</td>

                  {/* Attendance */}
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-24 h-2 bg-elev-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${teacher.attendance}%` }}
                        />
                      </div>
                      <span className="text-primary font-semibold text-sm">
                        {teacher.attendance}%
                      </span>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-6 py-5">{teacher.phone}</td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold
                        border
                        ${
                          teacher.status === "Active"
                            ? "bg-primary/10 text-primary border-primary/30 "
                            : "bg-orange-400/10 text-orange-700 dark:text-orange-300 border-orange-400/30 shadow-[0_0_10px_rgba(251,146,60,0.4)]"
                        }`}
                    >
                      {teacher.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => setViewTeacher(teacher)}
                        className="text-fg-muted hover:text-primary transition-colors"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => onEditTeacher(teacher)}
                        className="text-fg-muted hover:text-yellow-700 dark:hover:text-yellow-400 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => onDelete(teacher.id)}
                        className="text-fg-muted hover:text-red-700 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {pagedTeachers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-fg-muted"
                  >
                    No teachers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" />
          <input
            type="text"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-elev-1 border border-line text-sm text-fg placeholder:text-fg-faint focus:outline-none focus:border-primary/50"
          />
        </div>
        <h2 className="text-base font-semibold text-fg">
          All Teachers ({filteredTeachers.length})
        </h2>
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-4 py-2">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="px-4 py-2 rounded-xl bg-elev-1 border border-line text-sm font-medium disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-fg-muted">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-xl bg-elev-1 border border-line text-sm font-medium disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
        {teachersLoading ? (
          <div className="py-8 text-center text-fg-muted text-sm">Loading…</div>
        ) : pagedTeachers.length === 0 ? (
          <div className="rounded-2xl border border-line bg-elev-1 p-8 text-center text-fg-muted text-sm">
            No teachers found.
          </div>
        ) : (
          pagedTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="rounded-2xl border border-line bg-elev-1 p-4 sm:p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={teacher.avatar}
                  alt=""
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-line shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-fg truncate">{teacher.name}</h4>
                  <p className="text-xs text-fg-subtle font-mono">{teacher.teacherId}</p>
                  <span
                    className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      teacher.status === "Active"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-orange-400/10 text-orange-700 dark:text-orange-400 border-orange-400/20"
                    }`}
                  >
                    {teacher.status}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="text-fg-muted">{teacher.subject}</span>
                <span className="text-primary font-semibold">{teacher.attendance}%</span>
                <a href={`tel:${teacher.phone}`} className="text-fg-muted hover:text-primary truncate">{teacher.phone}</a>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setViewTeacher(teacher)}
                  className="flex-1 py-2.5 rounded-xl bg-elev-1 hover:bg-elev-3 flex items-center justify-center gap-1.5 text-sm text-fg-muted"
                >
                  <Eye size={16} /> View
                </button>
                <button
                  onClick={() => onEditTeacher(teacher)}
                  className="flex-1 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 flex items-center justify-center gap-1.5 text-sm text-primary border border-primary/20"
                >
                  <Pencil size={16} /> Edit
                </button>
                <button
                  onClick={() => onDelete(teacher.id)}
                  className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/20"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===== Show Modal ===== */}
      {viewTeacher && (
        <ShowTeacher
          teacher={viewTeacher}
          onClose={() => setViewTeacher(null)}
          onEdit={(teacher) => {
            setViewTeacher(null);
            onEditTeacher(teacher);
          }}
        />
      )}
    </div>
  );
}
