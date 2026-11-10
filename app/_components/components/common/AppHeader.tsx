"use client";

import { Bell, Search, Settings } from "lucide-react";
import SectionHeader from "./SectionHeader";
import NotificationPanel from "./NotificationPanel";
import { ThemeToggleButton } from "./ThemeToggle";
import ProfileModal from "./ProfileModal";
import { AVATAR_URL } from "../../constants/images";
import { useAppHeaderState, AppHeaderMobileSearch } from "./shared/app-header";

export type HeaderProfile = {
  name: string;
  subtitle?: string;
  image?: string | null;
  email?: string;
  phone?: string;
  userId?: string;
  address?: string;
  status?: string;
};

interface AppHeaderProps {
  title: string;
  profile?: HeaderProfile;
  /** When true, do not show search and notification icons (e.g. Super Admin) */
  hideSearchAndNotifications?: boolean;
}

export default function AppHeader({ title, profile, hideSearchAndNotifications = false }: AppHeaderProps) {
  const {
    pathname,
    showProfile,
    setShowProfile,
    showNotifications,
    setShowNotifications,
    showSearch,
    setShowSearch,
    searchQuery,
    modalProfile,
    unreadCount,
    isSuperAdminPanel,
    fetchUnreadCount,
    onNotificationSnapshot,
    displayName,
    avatarUrl,
    openSettings,
    handleSearch,
    handleSearchSubmit,
    handleKeyDown,
  } = useAppHeaderState({ profile, hideSearchAndNotifications });

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-surface/95 supports-[backdrop-filter]:bg-surface/85 supports-[backdrop-filter]:backdrop-blur">
        <div className="flex h-14 items-center justify-between gap-2 px-3 sm:px-4 md:h-16 md:px-6">
          {/* LEFT: page title + greeting */}
          <div className="min-w-0 flex-1">
            <SectionHeader title={title} />
            <p className="hidden truncate pl-1 text-xs text-fg-subtle md:block">
              Welcome back, <span className="font-medium text-fg-muted">{displayName.split(" ")[0]}</span>
            </p>
          </div>

          {/* RIGHT: actions */}
          <div className="flex flex-shrink-0 items-center gap-0.5 sm:gap-1">
            {!hideSearchAndNotifications && (
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-fg-muted transition hover:bg-elev-2 hover:text-fg md:hidden"
                onClick={() => setShowSearch(true)}
                aria-label="Search"
              >
                <Search size={19} />
              </button>
            )}

            {!hideSearchAndNotifications && (
              <button
                type="button"
                onClick={() => {
                  setShowNotifications(true);
                  fetchUnreadCount();
                }}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-fg-muted transition hover:bg-elev-2 hover:text-fg"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell size={19} />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white ring-2 ring-surface">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
            )}

            <ThemeToggleButton />

            {!isSuperAdminPanel && (
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-fg-muted transition hover:bg-elev-2 hover:text-fg"
                onClick={openSettings}
                title="Settings"
                aria-label="Settings"
              >
                <Settings size={19} />
              </button>
            )}

            <span aria-hidden className="mx-1.5 hidden h-7 w-px bg-line sm:block" />

            <button
              type="button"
              onClick={() => setShowProfile(true)}
              className="flex flex-shrink-0 items-center gap-2.5 rounded-xl p-1 transition hover:bg-elev-2 sm:pr-3"
              title="My profile"
            >
              <img
                src={avatarUrl}
                alt="Profile"
                className="h-9 w-9 rounded-full object-cover ring-1 ring-line"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = AVATAR_URL;
                }}
              />
              <span className="hidden max-w-[10rem] truncate text-sm font-medium text-fg sm:block">
                {displayName}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* PANELS */}
      {showNotifications && (
        <NotificationPanel
          parentPortal={Boolean(pathname?.includes("/parent"))}
          onSnapshot={onNotificationSnapshot}
          onClose={() => {
            setShowNotifications(false);
            fetchUnreadCount();
          }}
        />
      )}

      {showProfile && (
        <ProfileModal
          profile={modalProfile ? {
            name: modalProfile.name,
            image: modalProfile.image,
            role: modalProfile.subtitle,
            email: modalProfile.email,
            phone: modalProfile.phone,
            userId: modalProfile.userId,
            address: modalProfile.address,
            status: modalProfile.status,
          } : undefined}
          onClose={() => setShowProfile(false)}
          onOpenSettings={() => {
            setShowProfile(false);
            openSettings();
          }}
        />
      )}

      {/* MOBILE SEARCH PLACEHOLDER - only when search is shown */}
      {!hideSearchAndNotifications && showSearch && (
        <AppHeaderMobileSearch
          searchQuery={searchQuery}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          onSubmit={() => {
            handleSearchSubmit(searchQuery);
            setShowSearch(false);
          }}
          onClose={() => setShowSearch(false)}
        />
      )}
    </>
  );
}
