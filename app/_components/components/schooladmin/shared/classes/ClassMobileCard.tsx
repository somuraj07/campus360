import SearchInput from "../../../common/SearchInput";
import SelectInput from "../../../common/SelectInput";
import type { SchoolAdminClassRow } from "@/lib/school/loadSchoolAdminFastTabs";

export function ClassMobileCard({
  row,
  isEditing,
  mobileEdit,
  onMobileEditChange,
  onStartEdit,
  onCloseEdit,
  onSave,
  savingClassId,
}: {
  row: SchoolAdminClassRow;
  isEditing: boolean;
  mobileEdit: { className: string; section: string } | null;
  onMobileEditChange: (next: { className: string; section: string }) => void;
  onStartEdit: () => void;
  onCloseEdit: () => void;
  onSave: () => void;
  savingClassId: string | null;
}) {
  return (
    <div className="mb-3 rounded-2xl border border-line bg-elev-1 p-4 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-fg font-semibold">{row.name}</div>
          <div className="mt-2 inline-flex items-center rounded-full border border-line bg-elev-1 px-3 py-1 text-xs text-fg">
            {row.section}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wide text-fg-subtle">Students</div>
          <div className="text-fg font-semibold text-lg">{row.students}</div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-line bg-well px-3 py-2">
        <div className="text-[11px] uppercase tracking-wide text-fg-subtle">
          Class Teacher
        </div>
        <div className="text-fg font-medium">{row.teacher}</div>
      </div>

      {isEditing ? (
        <div className="mt-4 border-t border-line pt-3 space-y-3">
          <button
            type="button"
            onClick={onCloseEdit}
            className="w-full rounded-xl bg-primary/30 text-primary border border-primary/40 py-2 text-sm font-semibold hover:bg-primary/35 transition cursor-pointer"
          >
            Close
          </button>

          <SearchInput
            label="Class Name"
            value={mobileEdit?.className ?? row.name}
            onChange={(value) =>
              onMobileEditChange({
                className: value,
                section: mobileEdit?.section ?? row.section.replace("Section ", ""),
              })
            }
            placeholder="Class name"
            variant="glass"
          />

          <SelectInput
            label="Section"
            value={mobileEdit?.section ?? row.section.replace("Section ", "")}
            onChange={(value) =>
              onMobileEditChange({
                className: mobileEdit?.className ?? row.name,
                section: value,
              })
            }
            options={[
              { label: "A", value: "A" },
              { label: "B", value: "B" },
              { label: "C", value: "C" },
            ]}
          />

          <button
            type="button"
            className="w-full rounded-xl bg-primary text-on-primary font-semibold py-2.5 hover:bg-primary-hover transition"
            onClick={onSave}
            disabled={savingClassId === row.id}
          >
            {savingClassId === row.id ? "Saving..." : "Save Changes"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onStartEdit}
          className="mt-3 w-full rounded-xl border border-line bg-elev-1 py-2 text-sm font-semibold text-fg hover:bg-elev-3 transition-colors cursor-pointer"
        >
          Edit
        </button>
      )}
    </div>
  );
}
