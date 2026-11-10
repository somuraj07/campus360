"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { refundPayment } from "@/lib/api/refund";

export interface TransactionItem {
  id: string;
  amount: number;
  gateway: string;
  transactionId: string | null;
  hyperpgStatus?: string | null;
  hyperpgStatusId?: number | null;
  hyperpgTxnId?: string | null;
  hyperpgRefunded?: boolean | null;
  hyperpgAmountRefunded?: number | null;
  createdAt: string;
  collectedByName?: string | null;
  collectedByUserId?: string | null;
  student: {
    id: string;
    admissionNumber?: string;
    user?: { name: string | null; email?: string | null };
    class?: { name: string; section: string | null } | null;
  };
  refundable: number;
}

interface RefundModalProps {
  transaction: TransactionItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RefundModal({ transaction, onClose, onSuccess }: RefundModalProps) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  if (!transaction) return null;

  const maxAmount = transaction.refundable;
  const amountNum = parseFloat(amount) || 0;
  const isValid = amountNum > 0 && amountNum <= maxAmount;

  const handleSubmit = async () => {
    if (!isValid) {
      alert("Enter a valid refund amount");
      return;
    }
    setSaving(true);
    try {
      const { ok, data } = await refundPayment({
        paymentId: transaction.id,
        amount: amountNum,
        reason: reason.trim() || undefined,
      });
      if (!ok) {
        alert(data.message || "Failed to process refund");
        return;
      }
      onSuccess();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay ">
      <div className="bg-surface border border-line rounded-2xl shadow-pop w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-line">
          <h3 className="text-lg font-semibold text-fg">Refund Payment</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-elev-3 text-fg-muted hover:text-fg"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-sm text-fg-muted">
            Student: <span className="text-fg font-medium">
              {transaction.student.user?.name || transaction.student.admissionNumber || "-"}
            </span>
          </p>
          <p className="text-sm text-fg-muted">
            Original amount: <span className="text-emerald-700 dark:text-emerald-400">₹{transaction.amount.toLocaleString()}</span>
          </p>
          <p className="text-sm text-fg-muted">
            Max refundable: <span className="text-amber-700 dark:text-amber-400">₹{maxAmount.toLocaleString()}</span>
          </p>
          <div>
            <label className="block text-xs text-fg-muted mb-1">Refund Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={0}
              max={maxAmount}
              step={0.01}
              placeholder={`Up to ${maxAmount.toLocaleString()}`}
              className="h-11 w-full rounded-lg border px-3.5 border-line-strong bg-surface text-sm text-fg placeholder:text-fg-faint transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <div>
            <label className="block text-xs text-fg-muted mb-1">Reason (optional)</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Duplicate payment"
              className="h-11 w-full rounded-lg border px-3.5 border-line-strong bg-surface text-sm text-fg placeholder:text-fg-faint transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>
        <div className="flex gap-2 p-4 border-t border-line">
          <button
            onClick={handleSubmit}
            disabled={!isValid || saving}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-55"
          >
            {saving ? "Processing..." : "Process Refund"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-line-strong text-fg-muted hover:bg-elev-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
