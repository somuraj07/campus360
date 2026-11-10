import { Shield } from "lucide-react";
import AllowedFeatureToggle from "../AllowedFeatureToggle";
import type { UserFormErrors } from "../userFormValidation";
import { AVAILABLE_FEATURES_FOR_TEACHERS } from "./userFormHelpers";

export function AccessControlPanel({
  allowedFeatures,
  fieldErrors,
  onToggleFeature,
  onToggleAll,
}: {
  allowedFeatures: string[];
  fieldErrors: UserFormErrors;
  onToggleFeature: (feature: string) => void;
  onToggleAll: () => void;
}) {
  const allSelected = allowedFeatures.length === AVAILABLE_FEATURES_FOR_TEACHERS.length;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-[200px] flex-1">
          <AllowedFeatureToggle label="Select All" checked={allSelected} onChange={onToggleAll} />
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          <Shield size={13} />
          {allowedFeatures.length} of {AVAILABLE_FEATURES_FOR_TEACHERS.length} active
        </span>
      </div>
      {fieldErrors.allowedFeatures ? (
        <p className="text-xs text-red-700 dark:text-red-400" role="alert">
          {fieldErrors.allowedFeatures}
        </p>
      ) : null}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {AVAILABLE_FEATURES_FOR_TEACHERS.map((feature) => (
          <AllowedFeatureToggle
            key={feature.key}
            label={feature.label}
            description={feature.description}
            checked={allowedFeatures.includes(feature.key)}
            onChange={() => onToggleFeature(feature.key)}
          />
        ))}
      </div>
    </div>
  );
}
