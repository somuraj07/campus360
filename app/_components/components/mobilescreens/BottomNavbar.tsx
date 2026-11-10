"use client";

import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { SidebarItem } from "../../types/sidebar";
import { useSession } from "next-auth/react";
import { useAllowedFeatures } from "@/lib/auth/usePermissions";

export default function BottomNavBar({
  menuItems,
  activeTab = "dashboard",
  onMoreClick,
}: {
  menuItems: SidebarItem[];
  activeTab?: string;
  onMoreClick: () => void;
}) {
  const router = useRouter();

  // Filter menu items for teachers based on allowed features
  const { data: session } = useSession();
  const allowed = useAllowedFeatures();

  const filteredMenu = (menuItems || []).filter((item) => {
    // always show action items (logout)
    if (!item.tab && !item.permission) return true;
    if (!session || !session.user) return true;
    if (session.user.role !== "TEACHER") return true;

    // legacy: no allowed list means unrestricted
    if (!allowed || allowed.length === 0) return true;

    const allowedNormalized = (allowed || []).map((a) => String(a).toLowerCase());
    const tabKey = item.tab ? String(item.tab).toLowerCase() : null;
    const permKey = item.permission ? String(item.permission).toLowerCase() : null;

    if (tabKey && allowedNormalized.includes(tabKey)) return true;
    if (permKey && allowedNormalized.includes(permKey)) return true;
    // allow if base of feature present (e.g., 'attendance' in 'attendance-view')
    if (tabKey && allowedNormalized.some(a => a.startsWith(tabKey))) return true;

    return false;
  });

  const tabItems = filteredMenu.filter(item => item.tab);
  const displayedItems = tabItems.slice(0, 4);

  // KEY FIX
  const hasLogout = menuItems.some(item => item.action === "logout");
  const hasMoreItems = tabItems.length > 4 || hasLogout;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_-8px_rgba(23,43,69,0.12)] lg:hidden"
    >
      <div className="flex items-stretch px-1.5 py-1.5">
        {displayedItems.map(item => {
          const Icon = item.icon;
          const isActive = item.tab === activeTab;

          return (
            <button
              type="button"
              key={item.label}
              onClick={() => item.href && router.push(item.href)}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1.5 py-1.5 transition ${
                isActive ? "text-primary font-semibold" : "text-fg-subtle"
              }`}
            >
              <span
                className={`flex h-7 w-12 items-center justify-center rounded-full transition ${
                  isActive ? "bg-primary/10" : ""
                }`}
              >
                <Icon size={19} />
              </span>
              <span
                className="
                  w-full
                  text-[10px]
                  text-center
                  leading-tight
                  truncate
                "
              >
                {item.mobileLabel ?? item.label}
              </span>
            </button>
          );
        })}

        {/* ALWAYS SHOW MORE IF LOGOUT EXISTS */}
        {hasMoreItems && (
          <button
            type="button"
            onClick={onMoreClick}
            className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1.5 py-1.5 text-fg-subtle"
          >
            <span className="flex h-7 w-12 items-center justify-center">
              <MoreHorizontal size={19} />
            </span>
            <span className="w-full text-[10px] text-center leading-tight truncate">
              More
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}
