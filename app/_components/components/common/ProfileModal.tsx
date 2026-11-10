"use client";

import { useEffect } from "react";
import { X, Mail, User, Settings, Phone, MapPin } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { AVATAR_URL } from "../../constants/images";

type ProfileModalProfile = {
  name: string;
  email?: string;
  image?: string | null;
  role?: string;
  phone?: string;
  userId?: string;
  address?: string;
  status?: string;
};

export default function ProfileModal({
  onClose,
  onOpenSettings,
  profile: profileProp,
}: {
  onClose: () => void;
  onOpenSettings?: () => void;
  profile?: ProfileModalProfile;
}) {
  const { data: session } = useSession();
  const name = profileProp?.name ?? session?.user?.name ?? "User";
  const email = profileProp?.email ?? session?.user?.email ?? "";
  const role = profileProp?.role ?? session?.user?.role ?? "";
  const normalizedRole = role.replace(/\s+/g, "_").toUpperCase();
  const isSuperAdmin = normalizedRole === "SUPER_ADMIN" || normalizedRole === "SUPERADMIN";
  const phone = profileProp?.phone ?? session?.user?.mobile ?? "";
  const address = profileProp?.address ?? "";
  const _status = profileProp?.status ?? "ACTIVE";
  const imageUrl = profileProp?.image ?? session?.user?.image ?? AVATAR_URL;
  const roleLabel = formatRole(role);

  const _handleLogout = async () => {
    onClose();
    await signOut({ callbackUrl: "/" });
  };

  const handleSettings = () => {
    onClose();
    onOpenSettings?.();
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="
        fixed inset-0 bg-overlay flex items-center justify-center z-[100] animate-fadeIn
      "
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-elev-1 border
         border-line border-solid rounded-2xl 
         shadow-card 
         max-w-md w-full mx-4 animate-scaleIn overflow-hidden p-6 relative"
        
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 hover:bg-elev-3 rounded-lg transition-all text-fg-muted hover:text-fg z-10"
          aria-label="Close profile modal"
        >
          <X className="text-fg" size={20} />
        </button>

        <div className="flex gap-4 items-center mb-6 relative pb-6 border-b border-line bg-elev-1 -mx-6 -mt-6 px-6 pt-6">
          <img
            src={imageUrl}
            alt={name}
            className="w-16 h-16 rounded-2xl border-2 border-line object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = AVATAR_URL;
            }}
          />
          <div>
            <h2 id="profile-modal-title" className="text-xl font-bold text-fg">{name}</h2>
            <p className="text-primary text-sm font-medium">{roleLabel || "-"}</p>
          </div>
        </div>

        <div className="space-y-4">
          <Info icon={<Mail className="lucide lucide-mail w-5 h-5 text-primary"/>} label="Email" value={email || "-"} />
          <Info icon={<Phone className="lucide lucide-mail w-5 h-5 text-primary"/>} label="Phone" value={phone || "-"} />
          <Info icon={<MapPin className="lucide lucide-mail w-5 h-5 text-primary"/>} label="Address" value={address || "-"} />
          <Info icon={<User className="lucide lucide-mail w-5 h-5 text-primary"/>} label="Role" value={roleLabel || "-"} />
        </div>

        <div className="mt-6 flex flex-col gap-2">
          {!isSuperAdmin && (
            <button
              type="button"
              onClick={handleSettings}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-line-strong bg-surface py-3 font-semibold text-fg transition-colors hover:bg-elev-2"
            >
              <Settings size={18} /> Settings
            </button>
          )}
          {/* <button
            type="button"
            onClick={handleLogout}
            className="w-full py-3 rounded-xl bg-elev-2 text-fg font-medium flex items-center justify-center gap-2 hover:bg-elev-3"
          >
            <LogOut size={18} /> Sign Out
          </button> */}
        </div>
      </div>
    </div>
  );
}

function formatRole(role: string): string {
  if (!role) return "";
  if (role.includes(" ")) return role;
  return role
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-elev-1 border border-line-subtle hover:bg-elev-3 transition-all">
      <div className="p-2.5 bg-primary/18 rounded-xl border border-primary/25">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-fg-muted font-medium uppercase tracking-wider">{label}</p>
        <p className="font-medium text-fg-muted text-sm mt-0.5">{value}</p>
      </div>
    </div>
  );
}
