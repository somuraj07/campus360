"use client";

import { useRouter, useSearchParams } from "next/navigation";

type TabItem = {
  label: string;
  value: string;
};

interface PageTabsProps {
  tabs: TabItem[];
  queryKey?: string; // default = "tab"
  /** When the query param is absent, use this instead of tabs[0].value (e.g. Add User defaults to "add" while first pill is "all"). */
  defaultWhenMissing?: string;
}

export default function PageTabs({
  tabs,
  queryKey = "tab",
  defaultWhenMissing,
}: PageTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawActive =
    searchParams.get(queryKey) ?? defaultWhenMissing ?? tabs[0].value;
  const active =
    rawActive === "add-user"
      ? "add"
      : rawActive === "all-users"
      ? "all"
      : rawActive;

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(queryKey, value);

    if (queryKey === "view" && value === "add") {
      params.delete("userId");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="max-w-full overflow-x-auto">
      <div role="tablist" className="inline-flex rounded-xl border border-line bg-elev-2 p-1">
        {tabs.map((tab) => {
          const isActive = active === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleChange(tab.value)}
              className={`whitespace-nowrap rounded-lg px-4 py-1.5 text-[13px] font-medium transition ${
                isActive ? "bg-surface text-fg shadow-card" : "text-fg-subtle hover:text-fg"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
