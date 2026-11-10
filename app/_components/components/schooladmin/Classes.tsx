"use client";


import {
  ArrowRightLeft,
  BookOpen,
  Download,
  GraduationCap,
  Layers,
  Plus,
  UserCheck,
  Users,
} from "lucide-react";

import AddClassPanel from "./classes-panels/AddClassPanel";
import AddSectionPanel from "./classes-panels/AddSectionPanel";
import AssignSectionPanel from "./classes-panels/AssignSectionPanel";
import UploadCsvPanel from "./classes-panels/UploadCsvPanel";
import ClassDetailsPanel from "./classes-panels/ClassDetailsPanel";
import EditClassPanel from "./classes-panels/EditClassPanel";
import DeleteClassPanel from "./classes-panels/DeleteClassPanel";
import InlinePanelTable from "../common/InlinePanelTable";
import TimellyLoader from "../common/TimellyLoader";
import { useClassesState, ClassMobileCard } from "./shared/classes";
import {
  SaPage,
  SaPageHeader,
  KpiGrid,
  KpiCard,
  Panel,
  SearchBox,
  EmptyState,
  TablePager,
  btnClass,
} from "../common/ui";

export default function SchoolAdminClassesTab() {
  const {
    activeAction,
    setActiveAction,
    search,
    setSearch,
    activeRowId,
    setActiveRowId,
    panelMode,
    setPanelMode,
    mobileEdit,
    setMobileEdit,
    totalClasses,
    totalStudents,
    totalTeachers,
    avgSize,
    isLoading,
    isReportDownloading,
    loadError,
    setCurrentPage,
    savingClassId,
    refreshAfterMutation,
    filteredRows,
    totalPages,
    safePage,
    startIndex,
    endIndex,
    pagedRows,
    closePanel,
    tableColumns,
    handleReportClick,
    saveClassChanges,
  } = useClassesState();

  const toggleAction = (a: "class" | "section" | "assign") => setActiveAction(activeAction === a ? "none" : a);
  const actionClass = (a: "class" | "section" | "assign", primary = false) =>
    activeAction === a ? btnClass("primary") : btnClass(primary ? "primary" : "secondary");

  return (
    <SaPage>
      <SaPageHeader
        eyebrow="Academics"
        title="Classes Management"
        description="Manage all classes, sections, and class teachers"
        actions={
          <>
            <button type="button" onClick={handleReportClick} disabled={isReportDownloading} className={btnClass("secondary")}>
              <Download size={16} />
              {isReportDownloading ? "Downloading..." : "Report"}
            </button>
            <button type="button" onClick={() => toggleAction("assign")} className={actionClass("assign")} aria-pressed={activeAction === "assign"}>
              <ArrowRightLeft size={16} />
              Assign Section
            </button>
            <button type="button" onClick={() => toggleAction("section")} className={actionClass("section")} aria-pressed={activeAction === "section"}>
              <Layers size={16} />
              Add Section
            </button>
            <button type="button" onClick={() => toggleAction("class")} className={actionClass("class", true)} aria-pressed={activeAction === "class"}>
              <Plus size={16} />
              Add Class
            </button>
          </>
        }
      />

      {activeAction === "class" && (
        <AddClassPanel
          onCancel={() => setActiveAction("none")}
          onSuccess={() => {
            setActiveAction("none");
            refreshAfterMutation();
          }}
        />
      )}
      {activeAction === "section" && (
        <AddSectionPanel
          onCancel={() => setActiveAction("none")}
          onSuccess={() => {
            setActiveAction("none");
            refreshAfterMutation();
          }}
        />
      )}
      {activeAction === "assign" && (
        <AssignSectionPanel onCancel={() => setActiveAction("none")} onSuccess={() => refreshAfterMutation()} />
      )}
      {activeAction === "csv" && <UploadCsvPanel onCancel={() => setActiveAction("none")} onSuccess={refreshAfterMutation} />}

      {isLoading ? (
        <TimellyLoader compact title="Loading classes" steps={["Class list", "Student totals", "Teachers"]} />
      ) : (
        <KpiGrid>
          <KpiCard label="Total Classes" value={totalClasses} icon={BookOpen} hint="Across all grades" />
          <KpiCard label="Total Students" value={totalStudents.toLocaleString("en-IN")} icon={Users} tone="sky" hint="Enrolled in classes" />
          <KpiCard label="Avg Size" value={avgSize} icon={GraduationCap} tone="gold" hint="Students per class" />
          <KpiCard label="Teachers" value={totalTeachers} icon={UserCheck} tone="green" hint="On staff" />
        </KpiGrid>
      )}

      <Panel
        title="All Classes"
        description={isLoading ? undefined : `${filteredRows.length} class${filteredRows.length === 1 ? "" : "es"}`}
        actions={<SearchBox value={search} onChange={setSearch} placeholder="Search classes..." className="w-full sm:w-72" />}
        bodyClassName="p-0"
      >
        {/* Desktop table with inline panels */}
        <div className="hidden overflow-x-auto lg:block">
          <InlinePanelTable
            columns={tableColumns}
            data={pagedRows}
            emptyText={loadError ?? "No classes found"}
            activeRowId={activeRowId}
            panelKey={panelMode}
            renderPanel={(row) => {
              if (panelMode === "view") return <ClassDetailsPanel row={row} onClose={closePanel} />;
              if (panelMode === "edit") return <EditClassPanel row={row} onClose={closePanel} onSuccess={refreshAfterMutation} />;
              if (panelMode === "delete") {
                return (
                  <DeleteClassPanel
                    row={row}
                    onCancel={closePanel}
                    onConfirm={() => {
                      closePanel();
                      refreshAfterMutation();
                    }}
                  />
                );
              }
              return null;
            }}
          />
        </div>

        {/* Mobile/tablet cards */}
        <div className="space-y-3 p-4 lg:hidden">
          {filteredRows.length === 0 && !isLoading && <EmptyState icon={BookOpen} title={loadError ?? "No classes found"} />}
          {isLoading && <TimellyLoader compact bare title="Loading classes" steps={["Classes", "Sections", "Teachers"]} />}
          {pagedRows.map((row) => (
            <ClassMobileCard
              key={row.id}
              row={row}
              isEditing={activeRowId === row.id && panelMode === "edit"}
              mobileEdit={mobileEdit}
              onMobileEditChange={setMobileEdit}
              onStartEdit={() => {
                setActiveRowId(row.id);
                setPanelMode("edit");
                setMobileEdit({
                  className: row.name,
                  section: row.section.replace("Section ", ""),
                });
              }}
              onCloseEdit={closePanel}
              onSave={async () => {
                const className = mobileEdit?.className ?? row.name;
                const section = mobileEdit?.section ?? row.section.replace("Section ", "");
                const normalizedSection = section === "—" || section === "â€”" ? "" : section;
                const ok = await saveClassChanges({
                  id: row.id,
                  name: className,
                  section: normalizedSection,
                });
                if (ok) {
                  closePanel();
                  refreshAfterMutation();
                }
              }}
              savingClassId={savingClassId}
            />
          ))}
        </div>

        <TablePager
          page={safePage}
          totalPages={totalPages}
          total={filteredRows.length}
          pageSize={Math.max(1, endIndex - startIndex)}
          onChange={(p) => setCurrentPage(p)}
        />
      </Panel>
    </SaPage>
  );
}
