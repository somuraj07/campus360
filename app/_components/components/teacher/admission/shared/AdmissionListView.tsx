import { CheckCircle, ChevronDown, Download, IndianRupee, Loader2, Printer, Search, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import DataTable from "../../../common/TableLayout";
import SearchInput from "../../../common/SearchInput";
import InputField from "../../../schooladmin/schooladmincomponents/InputField";
import { Select } from "./PresentationalBits";
import { BOARDING, GRADES } from "./constants";
import { classLabel, displayResidencyType, formatBoardingLabel, formatGradeLabel, formatInrCell } from "./utils";
import type { Column } from "../../../../types/superadmin";
import type { AdmissionRow, FeeType } from "./types";

type Filters = { gradeSought: string; boardingType: string; from: string; to: string; classId: string };
type ListPhase = "all" | "pending" | "upcoming" | "approved";

export function AdmissionListView({
  message,
  messageTone,
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  classes,
  showExportMenu,
  onToggleExportMenu,
  onExport,
  listPhase,
  onListPhaseChange,
  tableColumns,
  rows,
  loading,
  page,
  totalPages,
  onPageChange,
  goToStudentDetails,
  workflowBusyId,
  onEnroll,
  onWarmAssignCatalog,
  onOpenAssignFeesDialog,
  onOpenPaymentDialog,
  onPrintFeeReceipt,
  onEditRow,
  onDeleteRow,
}: {
  message: string | null;
  messageTone: "success" | "error";
  search: string;
  onSearchChange: (v: string) => void;
  filters: Filters;
  onFiltersChange: (update: (p: Filters) => Filters) => void;
  classes: { id: string; name: string; section: string | null }[];
  showExportMenu: boolean;
  onToggleExportMenu: () => void;
  onExport: (format: "xlsx" | "csv" | "print") => void;
  listPhase: ListPhase;
  onListPhaseChange: (phase: "all" | "pending" | "approved") => void;
  tableColumns: Column<AdmissionRow>[];
  rows: AdmissionRow[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (update: (p: number) => number) => void;
  goToStudentDetails: (row: AdmissionRow) => void;
  workflowBusyId: string | null;
  onEnroll: (row: AdmissionRow) => void;
  onWarmAssignCatalog: (row: AdmissionRow) => void;
  onOpenAssignFeesDialog: (row: AdmissionRow) => void;
  onOpenPaymentDialog: (row: AdmissionRow, feeType: FeeType) => void;
  onPrintFeeReceipt: (row: AdmissionRow, feeType: FeeType) => void;
  onEditRow: (row: AdmissionRow) => void;
  onDeleteRow: (row: AdmissionRow) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full min-w-0 max-w-full space-y-4"
    >
      {message && (
        <div
          role={messageTone === "success" ? "status" : "alert"}
          className={`rounded-xl border px-4 py-3 text-sm ${
            messageTone === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
          }`}
        >
          {message}
        </div>
      )}
      <div className="rounded-2xl border border-line bg-elev-1">
        <div className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-[15px] font-semibold text-fg">Applications</h2>
            <div role="tablist" className="inline-flex rounded-xl border border-line bg-elev-2 p-1">
              {(
                [
                  { id: "all" as const, label: "All" },
                  { id: "pending" as const, label: "Pending" },
                  { id: "approved" as const, label: "Enrolled" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={listPhase === tab.id}
                  onClick={() => onListPhaseChange(tab.id)}
                  className={`rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition ${
                    listPhase === tab.id ? "bg-surface text-fg shadow-card" : "text-fg-subtle hover:text-fg"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={onToggleExportMenu}
              aria-expanded={showExportMenu}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface px-4 text-sm font-semibold text-fg transition hover:bg-elev-2 sm:w-auto"
            >
              <Download size={16} />
              Export
              <ChevronDown size={14} className={`transition-transform ${showExportMenu ? "rotate-180" : ""}`} />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 z-20 mt-2 min-w-[220px] overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-pop">
                <button type="button" onClick={() => onExport("xlsx")} className="block w-full px-4 py-2.5 text-left text-sm text-fg hover:bg-elev-2">
                  Export Excel (.xlsx)
                </button>
                <button type="button" onClick={() => onExport("csv")} className="block w-full px-4 py-2.5 text-left text-sm text-fg hover:bg-elev-2">
                  Export CSV (.csv)
                </button>
                <button type="button" onClick={() => onExport("print")} className="block w-full px-4 py-2.5 text-left text-sm text-fg hover:bg-elev-2">
                  Export PDF (Print)
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 px-5 py-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="sm:col-span-2">
            <span className="mb-1.5 block text-[13px] font-medium text-fg">Search</span>
            <SearchInput
              value={search}
              onChange={onSearchChange}
              placeholder="Search by name, phone, aadhar..."
              variant="glass"
              icon={Search}
            />
          </div>
          <Select
            label="Grade"
            value={filters.gradeSought || ""}
            onChange={(v) => onFiltersChange((p) => ({ ...p, gradeSought: v }))}
            options={[{ label: "All", value: "" }, ...GRADES]}
          />
          <Select
            label="Boarding"
            value={filters.boardingType || ""}
            onChange={(v) => onFiltersChange((p) => ({ ...p, boardingType: v }))}
            options={[{ label: "All", value: "" }, ...BOARDING]}
          />
          <div className="sm:col-span-2">
            <Select
              label="Class applied for"
              value={filters.classId || ""}
              onChange={(v) => onFiltersChange((p) => ({ ...p, classId: v }))}
              options={[
                { label: "All", value: "" },
                ...classes.map((c) => ({
                  label: c.section ? `${c.name}-${c.section}` : c.name,
                  value: c.id,
                })),
              ]}
            />
          </div>
          <InputField label="From (created date)" type="date" value={filters.from} onChange={(v) => onFiltersChange((p) => ({ ...p, from: v }))} />
          <InputField label="To (created date)" type="date" value={filters.to} onChange={(v) => onFiltersChange((p) => ({ ...p, to: v }))} />
        </div>
      </div>

      <div className="hidden w-full min-w-0 max-w-full md:block isolate">
        <div className="max-w-full min-w-0 overflow-hidden rounded-2xl border border-line bg-elev-1">
          <DataTable
            columns={tableColumns}
            data={rows}
            loading={loading}
            showMobile={false}
            container={false}
            rounded={false}
            scrollableWide
            stickyFirstColumn
            scrollAreaClassName="relative z-0 max-h-[min(70vh,720px)] overflow-auto scroll-smooth pb-3 [scrollbar-width:thin] [scrollbar-color:var(--line-strong)_transparent] [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-elev-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-elev-3 hover:[&::-webkit-scrollbar-thumb]:bg-elev-3"
            caption="Admission applications for this school"
            containerClassName="max-w-full"
            emptyText="No admission applications match your filters."
            paginationInline
            pagination={{ page, totalPages, onChange: (p: number) => onPageChange(() => p) }}
          />
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {rows.length === 0 ? (
          <div className="rounded-2xl border border-line bg-elev-1 p-6 text-fg-muted text-center">
            No admissions found.
          </div>
        ) : (
          rows.map((r) => (
            <div key={r.id} className="rounded-2xl border border-line bg-elev-1 p-4">
              <div className="text-fg-subtle text-[10px] font-semibold uppercase tracking-wide">App #{r.applicationNo}</div>
              <button
                type="button"
                onDoubleClick={() => goToStudentDetails(r)}
                disabled={!r.studentId}
                title={
                  r.studentId
                    ? "Double-click to open Student Details"
                    : "Enroll first to open Student Details"
                }
                className={`text-left font-semibold mt-0.5 ${
                  r.studentId
                    ? "text-sky-800 dark:text-sky-200 hover:underline cursor-pointer"
                    : "text-fg cursor-default"
                }`}
              >
                {`${r.firstName} ${r.lastName}`.trim()}
              </button>
              <div className="text-fg-subtle text-xs mt-1">
                {classLabel(r)} · {formatGradeLabel(r.gradeSought)} · {formatBoardingLabel(r.boardingType)}
              </div>
              <div className="text-fg-subtle text-xs mt-0.5">{displayResidencyType(r.residencyType)}</div>
              <div className="text-fg-subtle text-xs mt-1">
                {r.parentName} · {r.parentPhone}
              </div>
              <div className="text-fg-subtle text-xs mt-1">Aadhaar: {r.aadharNo}</div>
              <div className="text-fg-subtle text-xs mt-1">
                App: {formatInrCell(r.applicationFee)} · Adm: {formatInrCell(r.admissionFee)}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {r.studentId ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    <CheckCircle size={12} />
                    Enrolled
                  </span>
                ) : (r.workflowStatus ?? "PENDING") === "UPCOMING" ? (
                  <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-sky-500/20 text-sky-800 dark:text-sky-200 border border-sky-500/30">
                    Upcoming
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-200 border border-amber-500/25">
                    Pending
                  </span>
                )}
              </div>
              {!r.studentId && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={workflowBusyId === r.id}
                    onClick={() => onEnroll(r)}
                    className="flex-1 min-w-[120px] px-3 py-2 rounded-xl bg-primary/20 border border-primary/35 text-primary text-xs font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-1"
                  >
                    {workflowBusyId === r.id ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                    {workflowBusyId === r.id ? "Approving..." : "Approve & enroll"}
                  </button>
                </div>
              )}
              {r.studentId && (
                <div className="mt-2">
                  <button
                    type="button"
                    onMouseEnter={() => onWarmAssignCatalog(r)}
                    onFocus={() => onWarmAssignCatalog(r)}
                    onClick={() => onOpenAssignFeesDialog(r)}
                    className="w-full px-3 py-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-800 dark:text-sky-200 text-xs inline-flex items-center justify-center gap-1"
                  >
                    <IndianRupee size={13} />
                    Assign Extra Fees
                  </button>
                </div>
              )}
              <div className="mt-3 flex flex-col gap-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Number(r.applicationFee ?? 0) > 0 && !r.applicationFeePaid && (
                  <button
                    type="button"
                    onClick={() => onOpenPaymentDialog(r, "APPLICATION")}
                    className="w-full px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-300 text-xs"
                  >
                    Pay App Fee
                  </button>
                )}
                {Number(r.admissionFee ?? 0) > 0 && !r.admissionFeePaid && (
                  <button
                    type="button"
                    onClick={() => onOpenPaymentDialog(r, "ADMISSION")}
                    className="w-full px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-300 text-xs"
                  >
                    Pay Adm Fee
                  </button>
                )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                {r.applicationFeePaid && (
                  <button
                    type="button"
                    onClick={() => onPrintFeeReceipt(r, "APPLICATION")}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-primary/15 border border-primary/30 text-primary text-xs"
                    title="Print application fee receipt"
                  >
                    <Printer size={13} />
                    Print App Receipt
                  </button>
                )}
                {r.admissionFeePaid && (
                  <button
                    type="button"
                    onClick={() => onPrintFeeReceipt(r, "ADMISSION")}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-primary/15 border border-primary/30 text-primary text-xs"
                    title="Print admission fee receipt"
                  >
                    <Printer size={13} />
                    Print Adm Receipt
                  </button>
                )}
                </div>

                <div className={`grid gap-2 ${r.studentId ? "grid-cols-1" : "grid-cols-2"}`}>
                <button
                  type="button"
                  onClick={() => onEditRow(r)}
                  className="w-full px-3 py-2 rounded-xl bg-elev-1 border border-line text-fg-muted text-xs"
                >
                  Edit
                </button>
                {!r.studentId && (
                  <button
                    type="button"
                    onClick={() => onDeleteRow(r)}
                    className="w-full px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 text-xs"
                  >
                    Delete
                  </button>
                )}
                </div>
              </div>
            </div>
          ))
        )}
        <div className="flex items-center justify-between text-fg-muted text-sm">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange((p) => Math.max(1, p - 1))}
            className="px-3 py-2 rounded-xl bg-elev-1 border border-line disabled:opacity-50"
          >
            Prev
          </button>
          <span>{`Page ${page} / ${totalPages}`}</span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-2 rounded-xl bg-elev-1 border border-line disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
}
