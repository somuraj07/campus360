import { Pencil, Trash2 } from "lucide-react";
import InlinePagination from "../../../schooladmincomponents/InlinePagination";
import type { PettyCashExpense } from "./pettyCashTypes";

export function PettyCashTable({
  loading,
  filteredExpenses,
  paginatedExpenses,
  onEdit,
  onDelete,
  page,
  totalPages,
  onPageChange,
}: {
  loading: boolean;
  filteredExpenses: PettyCashExpense[];
  paginatedExpenses: PettyCashExpense[];
  onEdit: (row: PettyCashExpense) => void;
  onDelete: (row: PettyCashExpense) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (loading) {
    return <p className="mt-4 text-sm text-fg-muted">Loading petty cash records...</p>;
  }

  if (filteredExpenses.length === 0) {
    return <p className="mt-4 text-sm text-fg-muted">No expenses recorded yet.</p>;
  }

  return (
    <>
      <div className="-mx-4 mt-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <table className="min-w-[980px] w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-fg-muted">
              <th className="py-3">Date</th>
              <th className="py-3">Head of Account</th>
              <th className="py-3">Description</th>
              <th className="py-3">Voucher No</th>
              <th className="py-3">Type</th>
              <th className="py-3">Amount (INR)</th>
              <th className="w-24 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedExpenses.map((row) => (
              <tr key={row.id} className="border-b border-line-subtle">
                <td className="py-3 text-fg">
                  {new Date(row.expenseDate).toLocaleDateString("en-IN")}
                </td>
                <td className="py-3 text-fg">{row.headOfAccount || row.itemName}</td>
                <td className="max-w-[460px] py-3 text-fg-muted align-top whitespace-pre-wrap break-words">
                  {row.description || "-"}
                </td>
                <td className="py-3 font-medium text-primary">{`VCR-${row.voucherNo}`}</td>
                <td className="py-3 text-fg">{row.paymentType || "CASH"}</td>
                <td className="py-3 text-fg">₹{Number(row.amount).toLocaleString()}</td>
                <td className="py-3">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(row)}
                      className="rounded-lg p-1.5 hover:bg-elev-3"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(row)}
                      className="rounded-lg p-1.5 text-red-700 dark:text-red-400 hover:bg-red-500/20"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <InlinePagination page={page} totalPages={totalPages} onChange={onPageChange} />
      </div>
    </>
  );
}
