"use client";

import { Plus, Pencil, Upload } from "lucide-react";
import type { Class, FeeStructure } from "./types";
import { useFeeStructureConfigState, FeeStructureBulkUploadPanel, FeeStructureEditor } from "./shared/fee-structure";

interface FeeStructureConfigProps {
  classes: Class[];
  structures: FeeStructure[];
  onSuccess: () => void;
}

export default function FeeStructureConfig({
  classes,
  structures,
  onSuccess,
}: FeeStructureConfigProps) {
  const {
    editingId,
    structureClassId,
    setStructureClassId,
    components,
    setComponents,
    saving,
    deleting,
    bulkOpen,
    setBulkOpen,
    bulkFile,
    setBulkFile,
    bulkUploading,
    bulkResult,
    setBulkResult,
    bulkInputRef,
    downloadBulkTemplate,
    handleBulkUpload,
    startEdit,
    startNew,
    cancelEdit,
    handleSave,
    handleDelete,
  } = useFeeStructureConfigState({ classes, onSuccess });

  return (
    <section className="rounded-2xl border border-line bg-elev-1 p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold mb-1">Global Fee Breakdown Configuration</h3>
          <p className="text-sm text-fg-muted">
            Set the fee heads and amounts for each class. Student totals use{" "}
            <span className="text-fg-muted">only the sum of these components</span>, plus any{" "}
            <span className="text-fg-muted">extra fees</span> you configure below. Nothing is added on top
            automatically. Saving updates all students already in that class.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setBulkOpen((v) => !v);
            if (bulkOpen) setBulkResult(null);
          }}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-line-strong bg-elev-1 px-4 py-2.5 text-sm hover:bg-elev-3 sm:w-auto w-full"
        >
          <Upload size={16} />
          {bulkOpen ? "Close bulk upload" : "Bulk upload (Excel)"}
        </button>
      </div>

      {bulkOpen ? (
        <FeeStructureBulkUploadPanel
          bulkInputRef={bulkInputRef}
          bulkFile={bulkFile}
          setBulkFile={setBulkFile}
          bulkUploading={bulkUploading}
          bulkResult={bulkResult}
          onDownloadTemplate={downloadBulkTemplate}
          onUpload={handleBulkUpload}
        />
      ) : null}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {structures.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border border-line bg-elev-1 p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  Class {s.class.name}
                  {s.class.section ? `-${s.class.section}` : ""}
                </p>
                <p className="text-sm text-fg-muted">
                  Total: ₹
                  {(s.components as Array<{ amount: number }>).reduce((a, c) => a + (c.amount || 0), 0)}
                </p>
              </div>
              <button
                onClick={() => startEdit(s)}
                className="p-1.5 rounded-lg hover:bg-elev-3"
              >
                <Pencil size={16} />
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={startNew}
          className="flex items-center gap-2 rounded-xl border border-dashed border-line-strong bg-elev-1 p-4 hover:bg-elev-3"
        >
          <Plus size={20} /> Add class structure
        </button>
      </div>
      {editingId && (
        <FeeStructureEditor
          editingId={editingId}
          classes={classes}
          structureClassId={structureClassId}
          setStructureClassId={setStructureClassId}
          components={components}
          setComponents={setComponents}
          saving={saving}
          deleting={deleting}
          onSave={handleSave}
          onCancel={cancelEdit}
          onDelete={handleDelete}
        />
      )}
    </section>
  );
}
