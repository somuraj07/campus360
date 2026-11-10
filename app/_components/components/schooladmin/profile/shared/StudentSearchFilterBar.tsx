import SelectInput from "../../../common/SelectInput";
import { StudentSearchAutocomplete } from "../components/StudentSearchAutocomplete";
import type { StudentOption } from "./types";

type SelectOption = { label: string; value: string };

export function StudentSearchFilterBar({
  students,
  searchQuery,
  onSearchChange,
  onSelectStudent,
  selectedId,
  onSelectedIdChange,
  filterClass,
  onFilterClassChange,
  filterSection,
  onFilterSectionChange,
  filterStatus,
  onFilterStatusChange,
  statusOptions,
  classOptions,
  sectionOptions,
  studentSelectOptions,
}: {
  students: StudentOption[];
  searchQuery: string;
  onSearchChange: (v: string) => void;
  onSelectStudent: (student: StudentOption) => void;
  selectedId: string | null;
  onSelectedIdChange: (id: string | null) => void;
  filterClass: string;
  onFilterClassChange: (v: string) => void;
  filterSection: string;
  onFilterSectionChange: (v: string) => void;
  filterStatus: "all" | "active" | "inactive";
  onFilterStatusChange: (v: "all" | "active" | "inactive") => void;
  statusOptions: SelectOption[];
  classOptions: SelectOption[];
  sectionOptions: SelectOption[];
  studentSelectOptions: SelectOption[];
}) {
  return (
    <div className="relative isolate z-20 min-w-0 overflow-visible rounded-2xl border border-line bg-elev-1">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <h2 className="text-[15px] font-semibold text-fg">Find a student</h2>
        <span className="text-xs text-fg-subtle">{students.length.toLocaleString("en-IN")} students</span>
      </div>
      <div className="p-5">
      <div className="grid grid-cols-1 gap-4 overflow-visible sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <div className="relative z-20 min-w-0">
          <StudentSearchAutocomplete
            students={students}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onSelectStudent={onSelectStudent}
            selectedId={selectedId}
            classFilter={filterClass}
            sectionFilter={filterSection}
            statusFilter={filterStatus}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-fg">Filter by Status</label>
          <SelectInput
            value={filterStatus}
            onChange={(v) => onFilterStatusChange(v as "all" | "active" | "inactive")}
            options={statusOptions}
            bgColor="black"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-fg">Filter by Class</label>
          <SelectInput
            value={filterClass}
            onChange={onFilterClassChange}
            options={classOptions}
            bgColor="black"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-fg">Filter by Section</label>
          <SelectInput
            value={filterSection}
            onChange={onFilterSectionChange}
            options={sectionOptions}
            bgColor="black"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-fg">Students List</label>
          <SelectInput
            value={selectedId ?? ""}
            onChange={(value) => onSelectedIdChange(value || null)}
            options={[{ label: "Select student", value: "" }, ...studentSelectOptions]}
            bgColor="black"
          />
        </div>
      </div>
      </div>
    </div>
  );
}
