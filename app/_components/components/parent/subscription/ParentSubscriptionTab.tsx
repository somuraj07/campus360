"use client";

import { useEffect, useState } from "react";
import { Receipt, ShieldCheck, Clock, CreditCard } from "lucide-react";
import PageHeader from "../../common/PageHeader";
import ParentTimellyLoader from "../ParentTimellyLoader";
import PayButton from "../../common/PayButton";
import {
  fetchParentSubscriptionHistory,
  fetchParentSubscriptionStatus,
} from "@/lib/api/parentSubscription";

type StatusResponse = {
  status: "ACTIVE" | "EXPIRED";
  isTrial: boolean;
  billingMode: string;
  amount: number;
  remainingDays: number | null;
  expiresAt: string | null;
  trialDays?: number;
  deactivated?: boolean;
  message?: string;
};

type HistoryItem = {
  id: string;
  amount: number;
  createdAt: string;
  transactionId: string | null;
};

export default function ParentSubscriptionTab() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [statusResult, historyResult] = await Promise.all([
          fetchParentSubscriptionStatus(),
          fetchParentSubscriptionHistory(),
        ]);
        if (!cancelled) {
          if (statusResult.ok) setStatus(statusResult.data as StatusResponse);
          else setError(statusResult.data.message || "Failed to load subscription status");
          if (historyResult.ok) setHistory(historyResult.data.payments ?? []);
        }
      } catch {
        if (!cancelled) setError("Something went wrong while loading subscription data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <ParentTimellyLoader preset="subscription" className="w-full max-w-2xl" />
      </div>
    );
  }

  if (status?.deactivated) {
    return (
      <div className="max-w-3xl mx-auto mt-6">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <ShieldCheck className="w-8 h-8 text-red-700 dark:text-red-300 mx-auto mb-2" />
          <h2 className="text-lg font-semibold text-fg mb-1">School access deactivated</h2>
          <p className="text-sm text-red-800 dark:text-red-100">
            {status.message ??
              "Your school's RS Solutions access is deactivated. Please contact your school or RS Solutions support for help."}
          </p>
        </div>
      </div>
    );
  }

  const isActive = status?.status === "ACTIVE";
  const showPayButton =
    status &&
    status.billingMode === "PARENT_SUBSCRIPTION" &&
    status.status !== "ACTIVE" &&
    !status.isTrial;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        eyebrow="Account"
        title="Subscription"
        subtitle="Manage your RS Solutions parent subscription"
        compact
      />

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      {status && (
        <section className="rounded-2xl border border-line bg-elev-1 p-4 sm:p-6 flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center">
          <div className="flex-1 space-y-1">
            <h2 className="text-base sm:text-lg font-semibold text-fg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Subscription status
            </h2>
            <p className="text-sm text-fg-muted">
              {status.billingMode === "SCHOOL_PAID"
                ? "Your school has a central RS Solutions subscription. You don't need to pay separately."
                : isActive
                ? status.isTrial
                  ? "Your free trial is active."
                  : "Your parent subscription is active."
                : "Your parent subscription is not active."}
            </p>
            {status.billingMode === "PARENT_SUBSCRIPTION" && (
              <>
                <p className="text-sm text-fg mt-1">
                  <span className="text-fg-muted">Plan amount:&nbsp;</span>
                  <span className="font-semibold">
                    ₹{(status.amount || 0).toLocaleString("en-IN")}
                    <span className="text-xs text-fg-muted">&nbsp;/ year</span>
                  </span>
                </p>
                {typeof status.trialDays === "number" && status.trialDays > 0 && (
                  <p className="text-xs text-fg-muted mt-1">
                    Free trial: <span className="font-semibold text-fg">{status.trialDays} day{status.trialDays > 1 ? "s" : ""}</span>
                  </p>
                )}
                {status.remainingDays != null && status.remainingDays > 0 && (
                  <p className="text-xs text-fg-muted flex items-center gap-1 mt-1">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {status.isTrial ? "Trial ends in" : "Expires in"}{" "}
                    <span className="font-semibold text-fg">
                      {status.remainingDays} day{status.remainingDays > 1 ? "s" : ""}
                    </span>
                  </p>
                )}
              </>
            )}
          </div>

          {showPayButton && (
            <div className="w-full md:w-64">
              <PayButton
                amount={status.amount > 0 ? status.amount : 1}
                endpoint="/api/parent/subscription/create-order"
                returnPath="/parent?tab=subscription"
                onSuccess={() => {
                  window.location.href = "/parent?tab=subscription";
                }}
              />
              <p className="mt-2 text-[11px] text-fg-subtle flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                Secure payment via RS Solutions partner payment gateway.
              </p>
            </div>
          )}
        </section>
      )}

      <section className="rounded-2xl border border-line bg-elev-1 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm sm:text-base font-semibold text-fg flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Subscription invoices
          </h2>
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-fg-subtle py-4">
            No subscription payments found. Once you complete a payment, your invoices will appear
            here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-xs text-fg-muted border-b border-line">
                  <th className="py-2 pr-4 text-left">Date</th>
                  <th className="py-2 pr-4 text-left">Amount</th>
                  <th className="py-2 pr-4 text-left">Order ID</th>
                  <th className="py-2 pr-4 text-left">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {history.map((p) => (
                  <tr key={p.id} className="border-b border-line-subtle last:border-0">
                    <td className="py-2 pr-4 text-fg">
                      {new Date(p.createdAt).toLocaleString("en-IN")}
                    </td>
                    <td className="py-2 pr-4 text-fg">
                      ₹{p.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-2 pr-4 text-fg-muted text-xs">
                      {p.transactionId ?? "-"}
                    </td>
                    <td className="py-2 pr-4">
                      <a
                        href={`/api/payment/receipt?paymentId=${encodeURIComponent(p.id)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

