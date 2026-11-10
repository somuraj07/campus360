"use client";

import { ArrowRightLeft, Plus } from "lucide-react";
import SearchInput from "../../common/SearchInput";
import SelectInput from "../../common/SelectInput";
import SuccessPopups from "../../common/SuccessPopUps";
import { useAssignSectionState, NEW_SECTION_VALUE } from "./shared";
import { StudentAssignPanel } from "./shared";

interface AssignSectionPanelProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

export default function AssignSectionPanel({
  onCancel,
  onSuccess,
}: AssignSectionPanelProps) {
  const {
    selectedClassName,
    setSelectedClassName,
    selectedStudentIds,
    studentSearch,
    setStudentSearch,
    targetSection,
    setTargetSection,
    newSectionName,
    setNewSectionName,
    isLoadingClasses,
    isLoadingStudents,
    isSaving,
    showSuccess,
    setShowSuccess,
    successMessage,
    error,
    classNameOptions,
    sectionOptions,
    resolvedTargetSectionName,
    filteredStudents,
    allVisibleSelected,
    someVisibleSelected,
    toggleStudent,
    toggleAllVisible,
    clearSelection,
    selectionFilteredBySearch,
    canAssign,
    handleAssign,
  } = useAssignSectionState();

  return (
    <div className="rounded-2xl border border-line bg-elev-1 p-5 sm:p-6 animate-fadeIn space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2 text-fg font-semibold">
          <ArrowRightLeft size={18} className="text-primary" />
          Assign Section
        </div>
        <p className="text-xs text-fg-subtle">
          1. Select class → 2. Pick section → 3. Check students → 4. Assign
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <SelectInput
          label="Select Class"
          value={selectedClassName}
          onChange={setSelectedClassName}
          options={
            classNameOptions.length > 1
              ? classNameOptions
              : [
                  {
                    label: isLoadingClasses ? "Loading..." : "No classes found",
                    value: "",
                    disabled: true,
                  },
                ]
          }
        />

        <SelectInput
          label="Assign to Section"
          value={targetSection}
          onChange={(value) => {
            setTargetSection(value);
            if (value !== NEW_SECTION_VALUE) setNewSectionName("");
          }}
          options={sectionOptions}
          disabled={!selectedClassName}
        />

        {targetSection === NEW_SECTION_VALUE && (
          <SearchInput
            label="New Section Name"
            placeholder="e.g. C"
            showSearchIcon={false}
            value={newSectionName}
            onChange={setNewSectionName}
          />
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      {selectedClassName && (
        <StudentAssignPanel
          selectedClassName={selectedClassName}
          filteredStudents={filteredStudents}
          selectedStudentIds={selectedStudentIds}
          selectionFilteredBySearch={selectionFilteredBySearch}
          clearSelection={clearSelection}
          studentSearch={studentSearch}
          onStudentSearchChange={setStudentSearch}
          isLoadingStudents={isLoadingStudents}
          allVisibleSelected={allVisibleSelected}
          someVisibleSelected={someVisibleSelected}
          toggleAllVisible={toggleAllVisible}
          toggleStudent={toggleStudent}
          resolvedTargetSectionName={resolvedTargetSectionName}
          canAssign={canAssign}
          isSaving={isSaving}
          onAssign={() => void handleAssign()}
        />
      )}

      {!selectedClassName && (
        <div className="rounded-xl border border-dashed border-line bg-elev-1 px-4 py-8 text-center text-sm text-fg-subtle">
          <Plus size={20} className="mx-auto mb-2 text-fg-faint" />
          Select a class to view students and assign sections.
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface px-4 text-sm font-semibold text-fg transition-colors hover:bg-elev-2 cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
        >
          Close
        </button>
      </div>

      <SuccessPopups
        open={showSuccess}
        title={successMessage || "Section assigned successfully"}
        onClose={() => {
          setShowSuccess(false);
          onSuccess?.();
        }}
      />
    </div>
  );
}
