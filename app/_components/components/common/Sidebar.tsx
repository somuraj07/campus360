"use client";

import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, ChevronRight } from "lucide-react";
import { SidebarItem } from "../../types/sidebar";
import BrandLogo from "./TimellyLogo";
import { AVATAR_URL } from "../../constants/images";
import { useMemo } from "react";
import { addRecentLogin, getRecentLogins } from "../../utils/recentLogins";

const LOGIN_URL = "/admin/login";

type Props = {
  menuItems: SidebarItem[];
  profile?: {
    name: string;
    subtitle?: string;
    image?: string | null;
    email?: string;
  };
  activeTab?: string;
  onLogoutRequest?: () => void;
  enableSwitchAccounts?: boolean;
};

export default function AppSidebar({ menuItems, profile, activeTab = "dashboard", onLogoutRequest, enableSwitchAccounts }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const [accounts, setAccounts] = useState<{ email: string; name: string; userId: string }[]>([]);
  const [liveProfile, setLiveProfile] = useState<{
    name: string;
    subtitle: string;
    image: string;
    email: string;
  } | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const currentEmail = (session?.user as { email?: string })?.email ?? profile?.email;
  const baseProfile = useMemo(
    () => ({
      name:
        profile?.name && profile.name.trim()
          ? profile.name
          : session?.user?.name ?? "User",
      subtitle: profile?.subtitle ?? session?.user?.role ?? "",
      image:
        profile?.image != null && profile.image !== ""
          ? profile.image
          : session?.user?.image ?? AVATAR_URL,
      email: profile?.email ?? session?.user?.email ?? "",
    }),
    [
      profile?.email,
      profile?.image,
      profile?.name,
      profile?.subtitle,
      session?.user?.email,
      session?.user?.image,
      session?.user?.name,
      session?.user?.role,
    ]
  );

  // Save current user to recent logins when in student portal
  useEffect(() => {
    if (enableSwitchAccounts && session?.user) {
      const u = session.user as { email?: string; name?: string; id?: string };
      const email = u.email || profile?.email;
      if (email && u.id) {
        addRecentLogin({
          email,
          name: u.name || profile?.name || "User",
          userId: u.id,
        });
      }
    }
  }, [enableSwitchAccounts, session?.user, profile?.email, profile?.name]);

  useEffect(() => {
    if (profileOpen && enableSwitchAccounts) {
      setAccounts(getRecentLogins());
    }
  }, [profileOpen, enableSwitchAccounts]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitchAccount = (account: { email: string }) => {
    if (account.email === currentEmail) return;
    setProfileOpen(false);
    const url = `${LOGIN_URL}?email=${encodeURIComponent(account.email)}`;
    signOut({ redirect: false }).then(() => {
      window.location.href = url;
    });
  };

  useEffect(() => {
    setLiveProfile((prev) => ({
      ...baseProfile,
      ...prev,
      name: prev?.name?.trim() ? prev.name : baseProfile.name,
      subtitle: prev?.subtitle || baseProfile.subtitle,
      image: prev?.image != null && prev.image !== "" ? prev.image : baseProfile.image,
      email: prev?.email || baseProfile.email,
    }));
  }, [baseProfile]);

  useEffect(() => {
    const onUpdated = (event?: Event) => {
      const detail =
        event && "detail" in event
          ? (event as CustomEvent<{ photoUrl?: string | null; name?: string; email?: string }>).detail
          : undefined;
      setLiveProfile((prev) => ({
        name: detail?.name ?? prev?.name ?? baseProfile.name,
        subtitle: prev?.subtitle ?? baseProfile.subtitle,
        image:
          detail?.photoUrl !== undefined
            ? detail.photoUrl || baseProfile.image
            : prev?.image ?? baseProfile.image,
        email: detail?.email ?? prev?.email ?? baseProfile.email,
      }));
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === "timelly:profile-updated") {
        setLiveProfile((prev) => ({
          name: prev?.name ?? baseProfile.name,
          subtitle: prev?.subtitle ?? baseProfile.subtitle,
          image: prev?.image ?? baseProfile.image,
          email: prev?.email ?? baseProfile.email,
        }));
      }
    };
    window.addEventListener("teacher-profile-updated", onUpdated);
    window.addEventListener("profile-updated", onUpdated);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("teacher-profile-updated", onUpdated);
      window.removeEventListener("profile-updated", onUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, [baseProfile]);

  const displayName = (liveProfile?.name && liveProfile.name.trim())
    ? liveProfile.name
    : baseProfile.name;
  const subtitle = liveProfile?.subtitle ?? baseProfile.subtitle;
  const avatarUrlRaw = (liveProfile?.image != null && liveProfile.image !== "")
    ? liveProfile.image
    : baseProfile.image;
  const avatarUrl =
    typeof avatarUrlRaw === "string" &&
    avatarUrlRaw.includes("/storage/v1/object/")
      ? `/api/media?url=${encodeURIComponent(avatarUrlRaw)}`
      : avatarUrlRaw;

  // Only filter menu items for TEACHER role. Other roles see full menu.
  const allowedFeatures = session?.user?.allowedFeatures ?? [];
  const isTeacher = session?.user?.role === "TEACHER";
  const _isStudent = session?.user?.role === "STUDENT";

  const handleClick = async (item: SidebarItem) => {
    if (item.disabled) {
      return;
    }
    if (item.action === "logout") {
      if (onLogoutRequest) {
        onLogoutRequest();
        return;
      }
      await signOut({ callbackUrl: "/" });
      return;
    }
    if (item.href) {
      router.push(item.href);
      return;
    }
    if (item.tab && pathname) {
      router.push(`${pathname}?tab=${encodeURIComponent(item.tab)}`);
    }
  };

  const isAllowed = (item: SidebarItem) => {
    if (!isTeacher) return true;
    if (!item.tab && !item.permission) return true;
    if (!allowedFeatures || allowedFeatures.length === 0) return true;

    const allowedNormalized = allowedFeatures.map((a: string) => String(a).toLowerCase());
    const tabKey = item.tab ? String(item.tab).toLowerCase() : null;
    const permKey = item.permission ? String(item.permission).toLowerCase() : null;

    if (tabKey && allowedNormalized.includes(tabKey)) return true;
    if (permKey && allowedNormalized.includes(permKey)) return true;
    // Marks / exams aliases (and similar: attendance-view, etc.)
    if (tabKey && allowedNormalized.some((a: string) => a.startsWith(tabKey))) return true;
    return false;
  };

  const { mainItems, bottomItems } = useMemo(() => {
    const allowed = menuItems.filter(isAllowed);
    const bottom = allowed.filter(
      (item) => item.action === "logout" || item.tab === "settings"
    );
    const main = allowed.filter(
      (item) => item.action !== "logout" && item.tab !== "settings"
    );
    return { mainItems: main, bottomItems: bottom };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- isAllowed is an inline closure over isTeacher/allowedFeatures, which are listed
  }, [menuItems, isTeacher, allowedFeatures]);

  const renderItem = (item: SidebarItem, { compact = false }: { compact?: boolean } = {}) => {
    const isActive = item.tab === activeTab;
    const isLogout = item.action === "logout";
    const Icon = item.icon;
    return (
      <button
        type="button"
        key={item.label}
        onClick={() => handleClick(item)}
        disabled={item.disabled}
        aria-current={isActive ? "page" : undefined}
        className={`group relative flex w-full min-w-0 items-center gap-3 rounded-lg px-3 ${
          compact ? "py-2" : "py-2.5"
        } text-left text-[13.5px] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          isLogout
            ? "text-red-200 hover:bg-red-500/15 hover:text-white"
            : isActive
            ? "bg-sidebar-active font-semibold text-sidebar-fg"
            : "font-medium text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-fg"
        }`}
      >
        {isActive && (
          <span aria-hidden className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-full bg-accent" />
        )}
        <Icon
          size={18}
          className={`shrink-0 ${
            isLogout ? "text-red-300" : isActive ? "text-accent" : "text-sidebar-muted group-hover:text-sidebar-fg"
          }`}
        />
        <span className="min-w-0">
          <span className="block truncate">{item.label}</span>
          {item.description && (
            <span className="block truncate text-[11px] font-normal text-sidebar-muted">{item.description}</span>
          )}
        </span>
      </button>
    );
  };

  return (
    <aside className="hidden h-full w-[17rem] shrink-0 flex-col bg-sidebar text-sidebar-fg lg:flex">
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-line px-5">
        <BrandLogo isbrandLogoWhite />
      </div>

      {/* Profile */}
      <div className="px-3 pt-4 pb-3" ref={profileRef}>
        <div className="relative">
          <button
            type="button"
            onClick={() => enableSwitchAccounts && setProfileOpen((o) => !o)}
            className={`w-full rounded-xl border border-sidebar-line bg-white/[0.04] p-2.5 text-left transition ${
              enableSwitchAccounts ? "cursor-pointer hover:bg-sidebar-hover" : "cursor-default"
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                alt=""
                className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-accent/70 ring-offset-2 ring-offset-sidebar"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = AVATAR_URL;
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-sidebar-fg">{displayName}</p>
                <p className="truncate text-[11px] font-medium uppercase tracking-wider text-sidebar-muted">
                  {subtitle}
                </p>
              </div>
              {enableSwitchAccounts && (
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-sidebar-muted transition-transform ${profileOpen ? "rotate-180" : ""}`}
                />
              )}
            </div>
          </button>

          {enableSwitchAccounts && profileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-0 right-0 z-20 mt-2 max-h-[280px] overflow-y-auto rounded-xl border border-line bg-surface py-1.5 text-fg shadow-pop"
            >
              <p className="px-4 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
                Switch account
              </p>
              {accounts.length === 0 ? (
                <p className="px-4 py-3 text-xs text-fg-subtle">No other accounts</p>
              ) : (
                accounts.map((account) => {
                  const isCurrent = account.email === currentEmail;
                  return (
                    <button
                      type="button"
                      key={account.email}
                      onClick={() => handleSwitchAccount(account)}
                      disabled={isCurrent}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                        isCurrent ? "cursor-default" : "hover:bg-elev-2"
                      }`}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-elev-2">
                        <User size={15} className="text-fg-muted" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-fg">{account.name || account.email}</p>
                        <p className="truncate text-[11px] text-fg-subtle">{account.email}</p>
                      </div>
                      {isCurrent ? (
                        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          Current
                        </span>
                      ) : (
                        <ChevronRight size={15} className="shrink-0 text-fg-subtle" />
                      )}
                    </button>
                  );
                })
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav aria-label="Main" className="flex min-h-0 flex-1 flex-col">
        <p className="px-6 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-muted/80">
          Menu
        </p>
        <div className="no-scrollbar flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
          {mainItems.map((item) => renderItem(item))}
        </div>

        {bottomItems.length > 0 && (
          <div className="space-y-0.5 border-t border-sidebar-line px-3 py-3">
            {bottomItems.map((item) => renderItem(item, { compact: true }))}
          </div>
        )}
      </nav>
    </aside>
  );
}
