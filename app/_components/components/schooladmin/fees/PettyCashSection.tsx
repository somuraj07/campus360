"use client";

import { Download } from "lucide-react";
import { usePettyCashState, PettyCashForm, PettyCashTable, type FilterType } from "./shared/petty-cash";

export default function PettyCashSection() {
  const {
    loading,
    saving,
    editingId,
    form,
    setForm,
    exportOpen,
    setExportOpen,
    page,
    setPage,
    filterType,
    setFilterType,
    filterDay,
    setFilterDay,
    filterWeek,
    setFilterWeek,
    filterMonth,
    setFilterMonth,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    totalAmount,
    filteredExpenses,
    filteredTotalAmount,
    totalPages,
    paginatedExpenses,
    resetForm,
    submit,
    onEdit,
    onDelete,
    handleExport,
  } = usePettyCashState();

  return (
    <section className="rounded-2xl border border-line bg-elev-1 p-4 sm:p-6">
      <h3 className="text-lg font-semibold">Petty Cash</h3>
      <p className="mt-1 text-sm text-fg-muted">
        Store school expense records with Date, Head of Account, Description, Voucher No, and Cash/Online type.
      </p>

      <PettyCashForm
        form={form}
        onFormChange={setForm}
        saving={saving}
        editingId={editingId}
        onSubmit={() => void submit()}
        onResetForm={resetForm}
      />

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-well p-3 text-sm">
        <div>
          <span className="text-fg-muted">Filtered Total:</span>{" "}
          <span className="font-semibold text-fg">INR {filteredTotalAmount.toLocaleString()}</span>
          <span className="mx-2 text-fg-faint">|</span>
          <span className="text-fg-muted">All Time:</span>{" "}
          <span className="font-semibold text-fg">INR {totalAmount.toLocaleString()}</span>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setExportOpen((prev) => !prev)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface px-4 text-sm font-semibold text-fg transition-colors hover:bg-elev-2 disabled:cursor-not-allowed disabled:opacity-55"
          >
            <Download size={16} />
            Export
          </button>
          {exportOpen ? (
            <div className="absolute right-0 z-20 mt-2 min-w-[160px] overflow-hidden rounded-xl border border-line bg-elev-2 shadow-pop">
              <button
                type="button"
                onClick={() => void handleExport("pdf")}
                className="block w-full px-3 py-2 text-left text-sm text-fg hover:bg-elev-3"
              >
                Export as PDF
              </button>
              <button
                type="button"
                onClick={() => void handleExport("excel")}
                className="block w-full px-3 py-2 text-left text-sm text-fg hover:bg-elev-3"
              >
                Export as Excel
              </button>
              <button
                type="button"
                onClick={() => void handleExport("csv")}
                className="block w-full px-3 py-2 text-left text-sm text-fg hover:bg-elev-3"
              >
                Export as CSV
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 rounded-xl border border-line bg-well p-3 md:grid-cols-5">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as FilterType)}
          className="h-10 rounded-lg border px-3 border-line-strong bg-surface text-sm text-fg placeholder:text-fg-faint transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
        >
          <option value="ALL">All</option>
          <option value="DAY">Day</option>
          <option value="WEEK">Week</option>
          <option value="MONTH">Month</option>
          <option value="RANGE">Date Range</option>
        </select>
        {filterType === "DAY" ? (
          <input
            type="date"
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
            className="h-10 rounded-lg border px-3 border-line-strong bg-surface text-sm text-fg placeholder:text-fg-faint transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
          />
        ) : null}
        {filterType === "WEEK" ? (
          <input
            type="week"
            value={filterWeek}
            onChange={(e) => setFilterWeek(e.target.value)}
            className="h-10 rounded-lg border px-3 border-line-strong bg-surface text-sm text-fg placeholder:text-fg-faint transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
          />
        ) : null}
        {filterType === "MONTH" ? (
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="h-10 rounded-lg border px-3 border-line-strong bg-surface text-sm text-fg placeholder:text-fg-faint transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
          />
        ) : null}
        {filterType === "RANGE" ? (
          <>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-10 rounded-lg border px-3 border-line-strong bg-surface text-sm text-fg placeholder:text-fg-faint transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-10 rounded-lg border px-3 border-line-strong bg-surface text-sm text-fg placeholder:text-fg-faint transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
          </>
        ) : null}
        <div className="flex items-center justify-end text-xs text-fg-muted md:col-span-2">
          Showing {filteredExpenses.length} record(s)
        </div>
      </div>

      <PettyCashTable
        loading={loading}
        filteredExpenses={filteredExpenses}
        paginatedExpenses={paginatedExpenses}
        onEdit={onEdit}
        onDelete={(row) => void onDelete(row)}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </section>
  );
}
