"use client";

import { ChevronUp, SquarePen } from "lucide-react";
import { SaPageHeader, btnClass } from "../../../common/ui";

interface ProfileBannerProps {
  isEditMode: boolean;
  onToggleEdit: () => void;
}

export default function ProfileBanner({ isEditMode, onToggleEdit }: ProfileBannerProps) {
  return (
    <SaPageHeader
      eyebrow="Account"
      title="Teacher Profile"
      description="View and manage your professional profile"
      actions={
        <button
          type="button"
          onClick={onToggleEdit}
          aria-pressed={isEditMode}
          className={btnClass(isEditMode ? "secondary" : "primary")}
        >
          {isEditMode ? <ChevronUp size={16} /> : <SquarePen size={16} />}
          {isEditMode ? "Cancel Editing" : "Edit Profile"}
        </button>
      }
    />
  );
}
