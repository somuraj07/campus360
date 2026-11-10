"use client";

import { useState } from "react";
import Link from "next/link";
import {
  School,
  Users,
  TrendingUp,
  GraduationCap,
  Plus,
  Download,
  Trash2,
  ChevronDown,
  MailCheck,
  AlertTriangle,
} from "lucide-react";
import { formatAmount } from "../../utils/format";
import BackupEmailPanel from "./BackupEmailPanel";
import {
  useSchoolsState,
  SchoolMobileCard,
  DeleteSchoolModal,
  SchoolProfileDrawer,
  SCHOOLS_PAGE_SIZE,
} from "./shared/schools";
import {
  SaPage,
  SaPageHeader,
  KpiGrid,
  KpiCard,
  Panel,
  SearchBox,
  DataTable,
  Th,
  Td,
  TablePager,
  InitialsAvatar,
  EmptyState,
  LoadingBlock,
  Alert,
  btnClass,
} from "./shared/ui";

export interface SchoolRow {
  slNo: number;
  id: string;
  name: string;
  address: string;
  location: string;
  studentCount: number;
  teacherCount: number;
  classCount: number;
  turnover: number;
  admin: {
    id: string;
    name: string;
    email: string;
    mobile: string;
    role: string;
    photoUrl?: string | null;
  } | null;
}

type SchoolsProps = {
  /** "remove" tab: same list, copy emphasizes permanent school deletion. */
  variant?: "default" | "remove";
};

export default function Schools({ variant = "default" }: SchoolsProps) {
  const {
    schools,
    loading,
    error,
    search,
    setSearch,
    page,
    setPage,
    modalSchool,
    confirmName,
    setConfirmName,
    deleteBusy,
    deleteError,
    exportingSchoolId,
    totalPages,
    paginatedSchools,
    handleDownloadFeesBackup,
    handleConfirmDeleteSchool,
    openDeleteModal,
    closeDeleteModal,
  } = useSchoolsState();
  const [selected, setSelected] = useState<SchoolRow | null>(null);
  const isRemove = variant === "remove";

  const totals = schools.reduce(
    (acc, s) => ({
      students: acc.students + s.studentCount,
      teachers: acc.teachers + s.teacherCount,
      turnover: acc.turnover + s.turnover,
    }),
    { students: 0, teachers: 0, turnover: 0 }
  );

  const download = (s: SchoolRow) => void handleDownloadFeesBackup(s);
  const requestDelete = (s: SchoolRow) => openDeleteModal(s);

  return (
    <SaPage>
      <SaPageHeader
        eyebrow={isRemove ? "Schools · Danger zone" : "Schools"}
        tone={isRemove ? "danger" : "default"}
        title={isRemove ? "Remove schools" : "Schools"}
        description={
          isRemove
            ? "Delete a school only after you export anything you need. Use Fees backup on each row for a full Excel report."
            : "Schools, admins, students, turnover — download full fees backup (Excel) per school"
        }
        actions={
          !isRemove && (
            <Link href="/superadmin?tab=addschool" className={btnClass("primary")}>
              <Plus size={16} />
              Add school
            </Link>
          )
        }
      />

      {isRemove && (
        <Alert tone="warning">
          <span className="flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            Deleting a school is permanent and removes all of its students, staff, fees and records.
          </span>
        </Alert>
      )}

      {!isRemove && !loading && (
        <KpiGrid>
          <KpiCard label="Schools" value={schools.length.toLocaleString("en-IN")} icon={School} hint={search ? "Matching your search" : "On the platform"} />
          <KpiCard label="Students" value={totals.students.toLocaleString("en-IN")} icon={Users} tone="sky" hint="Enrolled across these schools" />
          <KpiCard label="Teachers" value={totals.teachers.toLocaleString("en-IN")} icon={GraduationCap} tone="gold" hint="Across these schools" />
          <KpiCard label="Turnover" value={formatAmount(totals.turnover, true)} icon={TrendingUp} tone="green" hint="Total fees collected" />
        </KpiGrid>
      )}

      {error && <Alert tone="error">{error}</Alert>}

      <Panel
        title={isRemove ? "Select a school to remove" : "All schools"}
        description={loading ? undefined : `${schools.length} school${schools.length === 1 ? "" : "s"}`}
        actions={<SearchBox value={search} onChange={setSearch} placeholder="Search school, admin, email…" className="w-full sm:w-72" />}
        bodyClassName="p-0"
      >
        {loading ? (
          <LoadingBlock label="Loading schools…" />
        ) : paginatedSchools.length === 0 ? (
          <EmptyState
            icon={School}
            title={search ? "No schools match your search" : "No schools yet"}
            description={search ? "Try a different name, admin or email." : "Onboard your first school to get started."}
            action={
              !search && (
                <Link href="/superadmin?tab=addschool" className={btnClass("primary", "sm")}>
                  <Plus size={14} /> Add school
                </Link>
              )
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block">
              <DataTable
                minWidth={980}
                head={
                  <tr>
                    <Th>School</Th>
                    <Th>Admin</Th>
                    <Th align="right">Students</Th>
                    <Th align="right">Teachers</Th>
                    <Th align="right">Turnover</Th>
                    <Th align="right">
                      <span className="sr-only">Actions</span>
                    </Th>
                  </tr>
                }
              >
                {paginatedSchools.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => setSelected(s)}
                    className="cursor-pointer transition-colors hover:bg-elev-2"
                  >
                    <Td>
                      <div className="flex min-w-0 items-center gap-3">
                        <InitialsAvatar name={s.name} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-fg">{s.name}</p>
                          <p className="truncate text-xs text-fg-subtle">{s.location || s.address || "—"}</p>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <p className="truncate font-medium text-fg">{s.admin?.name ?? "—"}</p>
                      <p className="max-w-[240px] truncate text-xs text-fg-subtle">
                        {[s.admin?.email, s.admin?.mobile].filter(Boolean).join(" · ") || "No contact"}
                      </p>
                    </Td>
                    <Td align="right" className="font-medium text-fg tabular-nums">
                      {s.studentCount.toLocaleString("en-IN")}
                    </Td>
                    <Td align="right" className="text-fg-muted tabular-nums">
                      {s.teacherCount.toLocaleString("en-IN")}
                    </Td>
                    <Td align="right" className="font-semibold text-fg tabular-nums">
                      {formatAmount(s.turnover, true)}
                    </Td>
                    <Td align="right">
                      <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => download(s)}
                          disabled={exportingSchoolId === s.id || deleteBusy}
                          title="Download full fees backup (Excel)"
                          aria-label={`Download fees backup for ${s.name}`}
                          className={btnClass("secondary", "sm")}
                        >
                          {exportingSchoolId === s.id ? (
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-line border-t-primary" />
                          ) : (
                            <Download size={14} />
                          )}
                          Backup
                        </button>
                        <button
                          type="button"
                          onClick={() => requestDelete(s)}
                          disabled={deleteBusy || exportingSchoolId === s.id}
                          title="Delete school and all related data"
                          aria-label={`Delete ${s.name}`}
                          className={btnClass(isRemove ? "danger" : "dangerSoft", "sm")}
                        >
                          <Trash2 size={14} />
                          {isRemove && "Delete"}
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </DataTable>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 p-4 lg:hidden">
              {paginatedSchools.map((s) => (
                <SchoolMobileCard
                  key={s.id}
                  school={s}
                  exportingSchoolId={exportingSchoolId}
                  deleteBusy={deleteBusy}
                  onDownload={download}
                  onRequestDelete={requestDelete}
                  onOpen={setSelected}
                />
              ))}
            </div>

            <TablePager
              page={page}
              totalPages={totalPages}
              total={schools.length}
              pageSize={SCHOOLS_PAGE_SIZE}
              onChange={setPage}
            />
          </>
        )}
      </Panel>

      {!isRemove && !loading && (
        <details className="group overflow-hidden rounded-2xl border border-line bg-elev-1">
          <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MailCheck size={16} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold text-fg">Automated fees backup email</span>
              <span className="block text-xs text-fg-subtle">Schedule a daily Excel backup or send one now</span>
            </span>
            <ChevronDown size={18} className="text-fg-subtle transition group-open:rotate-180" />
          </summary>
          <div className="border-t border-line p-5">
            <BackupEmailPanel schools={schools.map((s) => ({ id: s.id, name: s.name }))} />
          </div>
        </details>
      )}

      <SchoolProfileDrawer
        school={selected}
        onClose={() => setSelected(null)}
        exportingSchoolId={exportingSchoolId}
        deleteBusy={deleteBusy}
        onDownload={download}
        onRequestDelete={(s) => {
          setSelected(null);
          requestDelete(s);
        }}
      />

      {modalSchool && (
        <DeleteSchoolModal
          modalSchool={modalSchool}
          confirmName={confirmName}
          setConfirmName={setConfirmName}
          deleteBusy={deleteBusy}
          deleteError={deleteError}
          onCancel={closeDeleteModal}
          onConfirm={() => void handleConfirmDeleteSchool()}
        />
      )}
    </SaPage>
  );
}
