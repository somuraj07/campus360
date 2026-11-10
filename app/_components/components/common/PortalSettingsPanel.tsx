"use client";

import { Save } from "lucide-react";
import ParentSettingsView from "../settings/ParentSettingsView";
import SchoolAdminSettingsView from "../settings/SchoolAdminSettingsView";
import TeacherSettingsView from "../settings/TeacherSettingsView";
import type { CommonSettingsProps, PortalVariant } from "../settings/portalSettingsTypes";
import ParentTimellyLoader from "../parent/ParentTimellyLoader";
import PageHeader from "./PageHeader";
import { btnClass } from "./ui";
import TimellyLoader from "./TimellyLoader";
import { usePortalSettingsState, getSettingsSubtitle } from "./shared/portal-settings";
import { ThemeSegmentedControl } from "./ThemeToggle";

export default function PortalSettingsPanel({ portal }: { portal: PortalVariant }) {
  const {
    loading,
    saving,
    passwordSaving,
    uploading,
    form,
    setForm,
    passwords,
    setPasswords,
    prefs,
    setPrefs,
    toggleNotification,
    fileInputRef,
    handleUploadAvatar,
    handleCancel,
    handleSaveAll,
    canSave,
  } = usePortalSettingsState(portal);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        {portal === "parent" ? (
          <ParentTimellyLoader preset="settings" className="w-full max-w-2xl" />
        ) : (
          <TimellyLoader
            title="Loading settings"
            steps={["Profile", "Preferences", "Security"]}
          />
        )}
      </div>
    );
  }

  const viewProps: CommonSettingsProps = {
    form,
    setForm,
    passwords,
    setPasswords,
    prefs,
    setPrefs,
    toggleNotification,
    fileInputRef,
    handleUploadAvatar,
    uploading,
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] pb-10">
      <PageHeader eyebrow="Account" title="Settings" subtitle={getSettingsSubtitle(portal)} />
      <section className="mb-5 flex flex-col gap-3 rounded-2xl border border-line bg-elev-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-fg">Appearance</h2>
          <p className="mt-0.5 text-xs text-fg-subtle">Light, dark, or follow your device setting.</p>
        </div>
        <ThemeSegmentedControl />
      </section>
      {portal === "teacher" && <TeacherSettingsView {...viewProps} />}
      {portal === "schooladmin" && <SchoolAdminSettingsView {...viewProps} />}
      {portal === "parent" && <ParentSettingsView {...viewProps} />}

      <div className="mt-8 flex justify-end gap-3">
        {portal === "parent" && (
          <button
            type="button"
            onClick={handleCancel}
            className={btnClass("secondary")}
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={!canSave || saving || passwordSaving}
          className={btnClass("primary")}
        >
          <Save size={16} />
          {saving || passwordSaving ? "Saving..." : portal === "teacher" ? "Save All Settings" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
