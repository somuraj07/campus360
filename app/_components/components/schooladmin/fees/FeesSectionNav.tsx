"use client";

import { usePathname, useRouter } from "next/navigation";
import { prefetchFeesSection } from "@/lib/fees/loadSchoolFeesPage";
import type { FeesSection } from "@/lib/fees/feesPageRequirements";

/** Fees sub-pages, in nav order. `title`/`description` feed the page header. */
export const FEES_SECTIONS: { slug: string; label: string; title: string; description: string }[] = [
  { slug: "", label: "Overview", title: "Fees Overview", description: "Collection, dues and discounts for the current academic year" },
  { slug: "fees-records", label: "Fee Records", title: "Fee Records", description: "Per-student fee totals, payments and balances" },
  { slug: "petty-cash", label: "Petty Cash", title: "Petty Cash", description: "Small day-to-day expenses and cash in hand" },
  { slug: "offline-payment", label: "Offline Payment", title: "Offline Payment Entry", description: "Record cash, cheque or bank payments made at the school" },
  { slug: "add-extra-fees", label: "Add Extra Fees", title: "Add Extra Fees", description: "Charge additional fee heads to classes or students" },
  { slug: "fee-structure", label: "Fee Structure", title: "Fee Breakdown Configuration", description: "Set the fee heads and amounts for each class" },
  { slug: "extra-fees-catalog", label: "Extra Fees List", title: "Listed Extra Fees", description: "Every extra fee head that has been charged" },
  { slug: "transactions", label: "Transactions & Refunds", title: "Transactions & Refunds", description: "All payments received, with refunds" },
  { slug: "receipt-lookup", label: "Receipt Lookup", title: "Receipt Lookup & History", description: "Find a receipt by number and see its history" },
  { slug: "bulk-fee-edit", label: "Bulk Fee Edit", title: "Bulk Fee Edit", description: "Change fee amounts for many students at once" },
];

export function feesSectionMeta(pathname: string | null) {
  const slug = (pathname ?? "").replace(/^\/schooladmin\/fees\/?/, "").split("/")[0] ?? "";
  return FEES_SECTIONS.find((s) => s.slug === slug) ?? FEES_SECTIONS[0];
}

type FeesSectionNavProps = {
  schoolId?: string | null;
};

export default function FeesSectionNav({ schoolId }: FeesSectionNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const goTo = (slug: string) => {
    const target = slug ? `/schooladmin/fees/${slug}` : "/schooladmin/fees";
    if (pathname !== target) router.push(target);
  };
  const prefetch = (slug: string) => {
    if (schoolId) prefetchFeesSection(schoolId, (slug || "overview") as FeesSection);
  };

  return (
    <nav
      aria-label="Fees sections"
      className="sticky top-2 z-20 rounded-2xl border border-line bg-elev-1/95 p-1.5 shadow-card backdrop-blur sm:top-3"
    >
      <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FEES_SECTIONS.map(({ slug, label }) => {
          const active = pathname === (slug ? `/schooladmin/fees/${slug}` : "/schooladmin/fees");
          return (
            <button
              key={slug || "overview"}
              type="button"
              aria-current={active ? "page" : undefined}
              onMouseEnter={() => prefetch(slug)}
              onFocus={() => prefetch(slug)}
              onClick={() => goTo(slug)}
              className={`shrink-0 whitespace-nowrap rounded-xl px-3.5 py-2 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 ${
                active ? "bg-primary text-on-primary shadow-sm" : "text-fg-muted hover:bg-elev-2 hover:text-fg"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
