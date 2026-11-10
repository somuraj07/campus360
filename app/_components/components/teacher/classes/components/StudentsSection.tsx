"use client";

import { useEffect, useMemo, useState } from "react";
import { Award, ChevronDown, ChevronUp, Mail } from "lucide-react";
import TableLayout from "../../../common/TableLayout";
import SectionHeaderWithSearch from "../../../common/SectionHeaderWithSearch";
import { AVATAR_URL } from "../../../../constants/images";
import type { StudentRow } from "../hooks/useTeacherClasses";
import type { StudentMetrics } from "../hooks/useClassMetrics";
import type { Column } from "../../../../types/superadmin";
import { useRouter } from "next/navigation";

type StudentWithMetrics = StudentRow & {
  metrics: StudentMetrics;
};

type StudentsSectionProps = {
  classTitle: string;
  students: StudentWithMetrics[];
  search: string;
  onSearch: (value: string) => void;
  expandedId: string | null;
  onToggleExpanded: (id: string) => void;
};

const formatPercent = (value: number | null) =>
  value === null ? "--" : `${value.toFixed(1)}%`;

const progressWidth = (value: number | null) =>
  value === null ? "0%" : `${Math.max(6, Math.min(100, value))}%`;

const gradeLabel = (value: string | null) => value ?? "--";

const progressColor = (value: number | null) => {
  if (value === null) return "bg-elev-3";
  if (value >= 92) return "bg-primary";
  if (value >= 85) return "bg-amber-400";
  return "bg-orange-400";
};

const gradePillClass = (grade?: string | null) => {
  const g = grade?.toUpperCase() ?? "";
  if (g === "A+" || g === "A") return "bg-primary/15 text-primary border-primary/30";
  if (g === "B+" || g === "B") return "bg-amber-400/15 text-amber-700 dark:text-amber-300 border-amber-400/30";
  return "bg-elev-2 text-fg border-line-strong";
};

const getPhotoUrl = (student: StudentWithMetrics) =>
  student.user?.photoUrl ||
  student.user?.image ||
  student.photoUrl ||
  AVATAR_URL;

export default function StudentsSection({
  classTitle,
  students,
  search,
  onSearch,
  expandedId,
  onToggleExpanded,
}: StudentsSectionProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(students.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedStudents = useMemo(
    () => students.slice((safePage - 1) * pageSize, safePage * pageSize),
    [students, safePage]
  );

  useEffect(() => {
    setPage(1);
  }, [search, students.length]);

  const expandedStudent = students.find((s) => s.id === expandedId) ?? null;
  const columns: Column<StudentWithMetrics>[] = [
    {
      header: "Roll No",
      accessor: "rollNo",
      align: "left",
      render: (row: StudentWithMetrics) =>
        row.rollNo ?? row.admissionNumber ?? "--",
    },
    {
      header: "Student Name",
      accessor: "user",
      align: "left",
      render: (row: StudentWithMetrics) => (
        <div className="flex items-center gap-3">
          <img
            src={getPhotoUrl(row)}
            alt={row.user?.name ?? "Student"}
            onError={(e) => {
              e.currentTarget.src = AVATAR_URL;
            }}
            className="w-10 h-10 rounded-xl object-cover border border-line"
          />
          <div>
            <div
              className={`text-sm font-medium text-fg group-hover:text-primary transition-colors ${
                expandedId === row.id ? "text-primary" : "text-fg"
              }`}
            >
              {row.user?.name ?? "Unnamed Student"}
            </div>
            {/* <div className="text-xs text-fg-subtle">
              {row.user?.email ?? "No email"}
            </div> */}
          </div>
        </div>
      ),
    },
    {
      header: "Attendance",
      accessor: "metrics",
      align: "center",
      render: (row: StudentWithMetrics) => (
        <div className="flex items-center justify-center gap-3">
          <div className="h-2 w-28 rounded-full bg-elev-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${progressColor(
                row.metrics.attendancePct
              )}`}
              style={{ width: progressWidth(row.metrics.attendancePct) }}
            />
          </div>
          <span className="text-sm text-fg-muted font-medium">
            {formatPercent(row.metrics.attendancePct)}
          </span>
        </div>
      ),
    },
    {
      header: "Avg Marks",
      accessor: "metrics",
      align: "center",
      render: (row: StudentWithMetrics) =>
        formatPercent(row.metrics.avgMarksPct),
    },
    {
      header: "Grade",
      accessor: "metrics",
      align: "center",
      render: (row: StudentWithMetrics) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border px-2.5 py-1 rounded-lg text-xs font-bold border uppercase tracking-wider
              ${gradePillClass(
            row.metrics.grade
          )}`}
        >
          {gradeLabel(row.metrics.grade)}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      align: "center",
      render: (row: StudentWithMetrics) => {
        const isExpanded = expandedId === row.id;
        return (
          <button
            type="button"
            onClick={() => onToggleExpanded(row.id)}
            className={`p-2 rounded-xl transition-all ${
              isExpanded
                ? "bg-primary text-on-primary"
                : "bg-elev-2 text-fg hover:bg-elev-3"
            }`}
            aria-label="Toggle student details"
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        );
      },
    },
  ];

  return (
    <section className="rounded-2xl border border-line bg-elev-1 mt-3">
      <div className="px-5 pt-5 sm:px-6 sm:pt-6 pb-4 border-b border-line">
        <SectionHeaderWithSearch
          title={`${classTitle} Students`}
          subtitle={`${students.length} students enrolled`}
          searchValue={search}
          onSearch={onSearch}
          searchPlaceholder="Search by name or roll number..."
          searchWidthClassName="md:w-[360px]"
          searchInputClassName="rounded-full bg-elev-1 border-line text-fg placeholder:text-fg-faint"
        />
      </div>

      <div className="hidden md:block">
        <TableLayout
          columns={columns}
          data={pagedStudents}
          emptyText="No students found."
          showMobile={false}
          container={false}
          theadClassName="bg-elev-1"
          thClassName="text-fg-subtle tracking-[0.18em]"
          rowClassName="hover:bg-elev-2"
          tdClassName="py-5"
          pagination={{
            page: safePage,
            totalPages,
            onChange: setPage,
          }}
        />
      </div>

      {expandedStudent && (
        <div className="px-5 pb-5 sm:px-6 sm:pb-6 overflow-hidden bg-elev-1">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-elev-1 rounded-2xl p-5 border border-line-subtle hover:border-line transition-all">
              <div className="font-semibold text-fg mb-4 flex items-center gap-2 text-sm">
                <Mail size={14} className="text-primary lucide lucide-mail w-4 h-4"/>
                Contact Information
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <div className="text-[10px] text-fg-subtle uppercase tracking-wider mb-0.5">Email</div>
                  <div className="text-sm font-medium text-fg">
                    {expandedStudent.user?.email ?? "Not available"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-fg-subtle uppercase tracking-wider mb-0.5">Parent Contact</div>
                  <div className="text-sm font-medium text-fg">
                    {expandedStudent.phoneNo ?? "Not available"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-elev-1 rounded-2xl p-5 border border-line-subtle hover:border-line transition-all">
              <div className="font-semibold text-fg mb-4 flex items-center gap-2 text-sm">
                <Award size={14} className="rounded-lg text-primary lucide lucide-award w-4 h-4"/>
                Performance & Actions
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-fg-muted">Avg Marks</span>
                <span className="text-sm font-bold text-fg">
                  {formatPercent(expandedStudent.metrics.avgMarksPct)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-fg-muted mt-1 mb-2">
                <span className="text-sm text-fg-muted">Attendance</span>
                <span className="text-fg">
                  {formatPercent(expandedStudent.metrics.attendancePct)}
                </span>
              </div>
              <button
                type="button"
                className="mt-auto w-full rounded-full border border-primary/30
                bg-primary/15 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/25 transition"
                onClick={()=>{router.push("/teacher?tab=chat")}}
              >
                Message Parent
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 md:hidden space-y-3 px-5 pb-5 sm:px-6 sm:pb-6">
        {pagedStudents.length === 0 ? (
          <div className="rounded-2xl border border-line bg-elev-1 p-6 text-fg-muted text-center">
            No students found.
          </div>
        ) : (
          pagedStudents.map((student) => (
            <div
              key={student.id}
              className="rounded-2xl border border-line bg-elev-1 p-4"
            >
              <button
                type="button"
                onClick={() => onToggleExpanded(student.id)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={getPhotoUrl(student)}
                    alt={student.user?.name ?? "Student"}
                    onError={(e) => {
                      e.currentTarget.src = AVATAR_URL;
                    }}
                    className="h-10 w-10 rounded-full object-cover border border-line"
                  />
                  <div>
                    <div className="text-fg font-medium">
                      {student.user?.name ?? "Unnamed Student"}
                    </div>
                    <div className="text-xs text-fg-subtle">
                      Roll: {student.rollNo ?? student.admissionNumber ?? "--"}
                    </div>
                  </div>
                </div>
                {expandedId === student.id ? (
                  <ChevronUp size={18} className="text-fg-muted" />
                ) : (
                  <ChevronDown size={18} className="text-fg-muted" />
                )}
              </button>

              {expandedId === student.id && (
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-line bg-elev-1 p-3">
                      <div className="text-xs text-fg-subtle">Avg Marks</div>
                      <div className="text-fg font-semibold">
                        {formatPercent(student.metrics.avgMarksPct)}
                      </div>
                    </div>
                    <div className="rounded-xl border border-line bg-elev-1 p-3">
                      <div className="text-xs text-fg-subtle">Attendance</div>
                      <div className="text-primary font-semibold">
                        {formatPercent(student.metrics.attendancePct)}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-fg-subtle">
                    Contact: {student.phoneNo ?? "Not available"}
                  </div>
                  <div className="text-xs text-fg-subtle">
                    Email: {student.user?.email ?? "Not available"}
                  </div>

                  <button
                    type="button"
                    className="w-full rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition"
                  >
                    Message
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
