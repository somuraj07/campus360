import { RefreshCcw, Search } from "lucide-react";
import { classLabel, type ApprovalRow, type ApprovalStatus } from "./discountApprovalsCache";

export function DiscountApprovalsSearchHeader({
  search,
  setSearch,
  setSearchFocused,
  studentSuggestions,
  onRefresh,
  status,
  setStatus,
  pendingCount,
}: {
  search: string;
  setSearch: (v: string) => void;
  setSearchFocused: (v: boolean) => void;
  studentSuggestions: ApprovalRow[];
  onRefresh: () => void;
  status: ApprovalStatus;
  setStatus: (s: ApprovalStatus) => void;
  pendingCount: number;
}) {
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-fg">Chairman</p>
          <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-[28px]">Discount Approvals</h1>
          <p className="mt-1.5 text-sm text-fg-subtle">Review fee discounts requested by school admin.</p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-faint" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => window.setTimeout(() => setSearchFocused(false), 120)}
              placeholder="Search student..."
              className="h-10 w-full rounded-lg border border-line-strong bg-surface pl-9 pr-3 text-sm text-fg outline-none placeholder:text-fg-faint focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            {studentSuggestions.length > 0 ? (
              <div className="absolute right-0 top-11 z-40 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface shadow-pop">
                {studentSuggestions.map((approval) => {
                  const name = approval.student.user?.name || "Student";
                  const klass = classLabel(approval);
                  const father = approval.student.fatherName?.trim() || "-";
                  return (
                    <button
                      key={approval.student.id}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        setSearch(name);
                        setSearchFocused(false);
                      }}
                      className="w-full border-b border-line-subtle px-4 py-3 text-left last:border-0 hover:bg-elev-2"
                    >
                      <p className="text-sm font-semibold text-fg">{name}</p>
                      <p className="mt-1 text-xs text-fg-subtle">
                        {approval.student.admissionNumber || "-"} | {klass} | Father: {father}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onRefresh}
            aria-label="Refresh approvals"
            title="Refresh"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line-strong bg-surface text-fg-muted hover:bg-elev-2 hover:text-fg"
          >
            <RefreshCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-line bg-elev-2 p-1">
        {(["PENDING", "APPROVED", "REJECTED", "ALL"] as ApprovalStatus[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStatus(item)}
            aria-pressed={status === item}
            className={`shrink-0 rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition ${
              status === item ? "bg-surface text-fg shadow-card" : "text-fg-subtle hover:text-fg"
            }`}
          >
            {item === "ALL" ? "History" : item.charAt(0) + item.slice(1).toLowerCase()}
            {item === "PENDING" && status === "PENDING" ? ` (${pendingCount})` : ""}
          </button>
        ))}
      </div>
    </>
  );
}
