"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, FileText, Filter, Plus, Upload, UserCheck, UserX, Users, X } from "lucide-react";
import UploadCsvPanel from "./students/UploadCsvPanel";
import AddStudentForm from "./students/AddStudentForm";
import StudentDetailsModal from "./students/StudentDetailsModal";
import StudentMobileCard from "./students/StudentMobileCard";
import DeleteConfirmation from "../common/DeleteConfirmation";
import { buildStudentColumns } from "./students/studentColumns";
import useStudentPage from "./students/useStudentPage";
import { getAge, toStudentForm } from "./students/utils";
import { ClassItem, type StudentStatusFilter } from "./students/types";
import {
  SaPage,
  SaPageHeader,
  KpiGrid,
  KpiCard,
  Panel,
  Segmented,
  SearchBox,
  SelectInput as KitSelect,
  ColumnsTable,
  TablePager,
  EmptyState,
  btnClass,
} from "../common/ui";
import SuccessPopups from "../common/SuccessPopUps";
import TimellyLoader from "../common/TimellyLoader";

type Props = {
  classes?: ClassItem[];
  reload?: () => void;
};

const EMPTY_CLASSES: ClassItem[] = [];

export default function StudentsManagementPage({ classes, reload }: Props) {
  const stableClasses = classes ?? EMPTY_CLASSES;
  const page = useStudentPage({ classes: stableClasses, reload });
  const [tablePage, setTablePage] = useState(1);
  const pageSize = 25;
  const totalPages = Math.max(1, Math.ceil(page.filteredStudents.length / pageSize));
  const safePage = Math.min(tablePage, totalPages);
  const pagedStudents = useMemo(
    () =>
      page.filteredStudents.slice(
        (safePage - 1) * pageSize,
        safePage * pageSize
      ),
    [page.filteredStudents, safePage]
  );

  useEffect(() => {
    setTablePage(1);
  }, [page.searchQuery, page.selectedClass, page.selectedSection, page.statusFilter]);

  const columns = buildStudentColumns({
    onView: page.openView,
    onEdit: page.openEdit,
    onDelete: page.openDelete,
  });

  const tableTitle =
    page.statusFilter === "All"
      ? `All Students (${page.filteredStudents.length})`
      : `${page.statusFilter} Students (${page.filteredStudents.length})`;


  const total = page.totalCount ?? (page.activeCount ?? 0) + (page.inactiveCount ?? 0);
  const fmt = (n: number | null | undefined) => (n == null ? "—" : n.toLocaleString("en-IN"));

  return (
    <SaPage>
      <SaPageHeader
        eyebrow="Academics"
        title="Students"
        description="Manage records, active/inactive status, and exports"
        actions={
          <>
            <button type="button" onClick={page.handleDownloadExcel} disabled={page.exportingDetails} className={btnClass("secondary")}>
              <Download size={16} />
              {page.exportingDetails ? "Excel…" : "Excel"}
            </button>
            <button type="button" onClick={page.handleDownloadPdf} disabled={page.exportingPdf} className={btnClass("secondary")}>
              <FileText size={16} />
              {page.exportingPdf ? "PDF…" : "PDF"}
            </button>
            <button
              type="button"
              onClick={() => page.setShowUploadPanel((prev) => !prev)}
              className={page.showUploadPanel ? btnClass("primary") : btnClass("secondary")}
              aria-pressed={page.showUploadPanel}
            >
              <Upload size={16} />
              Upload CSV
            </button>
            <button type="button" onClick={() => page.setShowAddForm((prev) => !prev)} className={btnClass("primary")}>
              {page.showAddForm ? <X size={16} /> : <Plus size={16} />}
              {page.showAddForm ? "Close Form" : "Add Student"}
            </button>
          </>
        }
      />

      <KpiGrid>
        <KpiCard label="Total Students" value={fmt(total)} icon={Users} hint="Active and inactive" />
        <KpiCard label="Active" value={fmt(page.activeCount)} icon={UserCheck} tone="green" hint="Can access the portal" />
        <KpiCard label="Inactive" value={fmt(page.inactiveCount)} icon={UserX} tone="red" hint="No portal access" />
        <KpiCard
          label="Showing"
          value={page.filteredStudents.length.toLocaleString("en-IN")}
          icon={Filter}
          tone="gold"
          hint={page.selectedClass ? `Class ${page.selectedClass}${page.selectedSection ? ` ${page.selectedSection}` : ""}` : "In current filter"}
        />
      </KpiGrid>

      {page.showUploadPanel && (
        <UploadCsvPanel
          uploadFile={page.uploadFile}
          onFileChange={page.setUploadFile}
          uploading={page.uploading}
          onCancel={() => page.setShowUploadPanel(false)}
          onUpload={page.handleUpload}
        />
      )}

      {page.editStudent && (
        <AddStudentForm
          form={page.editForm}
          errors={page.editErrors}
          classOptions={page.formClassOptions}
          sectionOptions={page.formSectionOptions}
          classesLoading={page.classesLoading}
          ageLabel={getAge(page.editForm.dob)}
          saving={page.editSaving}
          title={`Edit Student: ${page.editStudent.user?.name || page.editStudent.name || "Student"}`}
          subtitle="Update all available student fields"
          submitLabel="Save Changes"
          editMode
          onFieldChange={page.handleEditChange}
          onCancel={page.closeEdit}
          onReset={() => page.setEditForm(toStudentForm(page.editStudent!))}
          onSave={page.handleEditSave}
        />
      )}

      {page.showAddForm && (
        <AddStudentForm
          form={page.form}
          errors={page.errors}
          classOptions={page.formClassOptions}
          sectionOptions={page.formSectionOptions}
          classesLoading={page.classesLoading}
          ageLabel={getAge(page.form.dob)}
          saving={page.saving}
          onFieldChange={page.handleFormChange}
          onCancel={() => page.setShowAddForm(false)}
          onReset={page.handleResetForm}
          onSave={page.handleSaveStudent}
        />
      )}

      <Panel bodyClassName="p-0">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-line px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="mr-1 text-[15px] font-semibold text-fg">{tableTitle}</h2>
            <Segmented<StudentStatusFilter>
              value={page.statusFilter}
              onChange={page.setStatusFilter}
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
                { value: "All", label: "All" },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 xl:flex xl:items-center">
            <KitSelect
              aria-label="Class"
              value={page.selectedClass}
              onChange={(e) => page.setSelectedClass(e.target.value)}
              className="h-10 xl:w-44"
            >
              {page.filterClassOptions.map((o) => (
                <option key={`${o.value}-${o.label}`} value={o.value}>
                  {o.label}
                </option>
              ))}
            </KitSelect>
            <KitSelect
              aria-label="Section"
              value={page.selectedSection}
              onChange={(e) => page.setSelectedSection(e.target.value)}
              className="h-10 xl:w-40"
            >
              {page.filterSectionOptions.map((o) => (
                <option key={`${o.value}-${o.label}`} value={o.value}>
                  {o.label}
                </option>
              ))}
            </KitSelect>
            <SearchBox
              value={page.searchQuery}
              onChange={page.setSearchQuery}
              placeholder="Search students..."
              className="xl:w-64"
            />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          {page.tableLoading && pagedStudents.length === 0 ? (
            <TimellyLoader compact bare title="Loading students" steps={["Roster", "Filters", "Ready"]} />
          ) : (
            <ColumnsTable columns={columns} data={pagedStudents} rowKey={(r) => r.id} emptyText="No students found" minWidth={980} />
          )}
        </div>

        {/* Mobile */}
        <div className="space-y-3 p-4 md:hidden">
          {page.tableLoading && pagedStudents.length === 0 ? (
            <TimellyLoader compact bare title="Loading students" steps={["Roster", "Filters", "Ready"]} />
          ) : pagedStudents.length === 0 ? (
            <EmptyState icon={Users} title="No students found" />
          ) : (
            pagedStudents.map((student, index) => (
              <StudentMobileCard
                key={student.id}
                student={student}
                index={index}
                onView={page.openView}
                onEdit={page.openEdit}
                onDelete={page.openDelete}
              />
            ))
          )}
        </div>

        <TablePager
          page={safePage}
          totalPages={totalPages}
          total={page.filteredStudents.length}
          pageSize={pageSize}
          onChange={setTablePage}
        />
      </Panel>

      {page.viewStudent && (
        <StudentDetailsModal
          student={page.viewStudent}
          onClose={page.closeView}
          onEdit={() => {
            if (!page.viewStudent) return;
            page.openEdit(page.viewStudent);
            page.closeView();
          }}
        />
      )}

      <DeleteConfirmation
        isOpen={!!page.deleteStudent}
        userName={
          page.deleteStudent?.user?.name ||
          page.deleteStudent?.name ||
          "this student"
        }
        onCancel={page.closeDelete}
        onConfirm={async () => {
          await page.handleDelete();
        }}
      />

      <SuccessPopups
        open={page.showSuccess}
        title="Student Added Successfully"
        description="The student has been added and assigned to the class."
        onClose={() => page.setShowSuccess(false)}
      />
    </SaPage>
  );
}
