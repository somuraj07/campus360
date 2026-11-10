"use client";

import { SaPage, Alert, EmptyState } from "../common/ui";
import TimellyLoader from "../common/TimellyLoader";
import { formatMoney } from "./shared";
import { useDiscountApprovalsState } from "./shared";
import { DiscountApprovalsSearchHeader } from "./shared";
import { DiscountApprovalCard } from "./shared";

export { warmDiscountApprovals } from "./shared";

export default function DiscountApprovals() {
  const {
    status,
    setStatus,
    loading,
    busyId,
    error,
    success,
    search,
    setSearch,
    setSearchFocused,
    reviewRemarks,
    setReviewRemarks,
    fetchApprovals,
    pendingCount,
    visibleDiscountTotal,
    filteredApprovals,
    studentSuggestions,
    review,
  } = useDiscountApprovalsState();

  return (
    <SaPage>
      <DiscountApprovalsSearchHeader
        search={search}
        setSearch={setSearch}
        setSearchFocused={setSearchFocused}
        studentSuggestions={studentSuggestions}
        onRefresh={() => void fetchApprovals({ force: true })}
        status={status}
        setStatus={setStatus}
        pendingCount={pendingCount}
      />

      {error ? (
        <Alert tone="error">{error}</Alert>
      ) : null}
      {success ? (
        <Alert tone="success">{success}</Alert>
      ) : null}

      {loading ? (
        <TimellyLoader
          title="Loading discount approvals"
          steps={["Requests", "Students", "Approval status"]}
          compact
        />
      ) : filteredApprovals.length === 0 ? (
        <div className="rounded-2xl border border-line bg-elev-1">
          <EmptyState
            title={
              search.trim()
                ? "No discount requests match your search"
                : `No ${status === "ALL" ? "history" : status.toLowerCase()} discount requests`
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApprovals.map((approval) => (
            <DiscountApprovalCard
              key={approval.id}
              approval={approval}
              busyId={busyId}
              reviewRemarks={reviewRemarks}
              setReviewRemarks={setReviewRemarks}
              onReview={(id, action) => void review(id, action)}
            />
          ))}
        </div>
      )}
      {!loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-line bg-elev-1 p-4">
            <p className="text-xs text-fg-subtle">Showing</p>
            <p className="mt-1 text-2xl font-semibold text-fg">{filteredApprovals.length}</p>
          </div>
          <div className="rounded-2xl border border-amber-400/20 bg-elev-1 p-4">
            <p className="text-xs text-fg-subtle">Discount Value</p>
            <p className="mt-1 text-lg font-semibold text-amber-800 dark:text-amber-200">{formatMoney(visibleDiscountTotal)}</p>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-elev-1 p-4">
            <p className="text-xs text-fg-subtle">Current Filter</p>
            <p className="mt-1 text-lg font-semibold text-primary">{status === "ALL" ? "History" : status}</p>
          </div>
          <div className="rounded-2xl border border-sky-400/20 bg-elev-1 p-4">
            <p className="text-xs text-fg-subtle">Pending Here</p>
            <p className="mt-1 text-2xl font-semibold text-sky-800 dark:text-sky-200">{pendingCount}</p>
          </div>
        </div>
      ) : null}
    </SaPage>
  );
}
