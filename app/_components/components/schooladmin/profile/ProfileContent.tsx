"use client";

import { Suspense } from "react";
import { AcademicPerformance } from "./components/AcademicPerformance";
import { FeeTransactions } from "./components/FeeTransactions";
import { FeesBreakdown } from "./components/FeesBreakdown";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { AttendanceTrends } from "./components/AttendanceTrends";
import { Certificates } from "./components/Certificates";
import { getFeeBreakdownCached } from "@/lib/fees/feeBreakdownClientCache";
import { FileSpreadsheet, Users } from "lucide-react";
import BulkExtraFeeByTimellyModal from "./components/BulkExtraFeeByTimellyModal";
import { SaPage, SaPageHeader, Badge, Alert, LoadingBlock, EmptyState, btnClass } from "../../common/ui";
import Spinner from "../../common/Spinner";
import { StudentNameCard } from "./shared";
import { StudentFeesPaymentModal } from "./shared";
import { StudentSearchFilterBar } from "./shared";
import { ProfileStatCards } from "./shared";
import { useStudentDetailsPageState } from "./shared";

/** Academic year runs June–May, e.g. "2026-2027" from June 2026. */
function academicYearLabel(now = new Date()): string {
  const start = now.getMonth() >= 5 ? now.getFullYear() : now.getFullYear() - 1;
  return `${start}-${start + 1}`;
}

function StudentDetailsPageContent() {
  const {
    students,
    selectedId,
    detail,
    feeBreakdown,
    feeBreakdownPending,
    transactionsReady,
    listLoading,
    searchQuery,
    setSearchQuery,
    filterClass,
    setFilterClass,
    filterSection,
    setFilterSection,
    filterStatus,
    setFilterStatus,
    classes,
    bulkExtraFeeOpen,
    setBulkExtraFeeOpen,
    feesModalOpen,
    setFeesModalOpen,
    autoPrintPaymentId,
    setAutoPrintPaymentId,
    sidebarAsideRef,
    showStickyStudentName,
    selectStudent,
    changeSelectedId,
    warmFeeBreakdown,
    refreshFeesForStudent,
    removePaymentForStudent,
    setReloadKey,
    studentSelectOptions,
    isSelectedInactive,
    pageStudentName,
    pageStudentMeta,
    classOptions,
    statusOptions,
    sectionOptions,
    handleSidebarSaved,
  } = useStudentDetailsPageState();

  return (
    <SaPage>
      <SaPageHeader
        eyebrow="Students"
        title="Student Details"
        description="Search, view records, and manage fees."
        actions={
          <>
            <Badge tone="navy">Academic year {academicYearLabel()}</Badge>
            <button type="button" onClick={() => setBulkExtraFeeOpen(true)} className={btnClass("secondary")}>
              <FileSpreadsheet size={16} />
              Bulk extra fees (Excel)
            </button>
          </>
        }
      />
      <BulkExtraFeeByTimellyModal
        open={bulkExtraFeeOpen}
        onClose={() => setBulkExtraFeeOpen(false)}
        onApplied={() => setReloadKey((k) => k + 1)}
      />
      <StudentSearchFilterBar
        students={students}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectStudent={selectStudent}
        selectedId={selectedId}
        onSelectedIdChange={changeSelectedId}
        filterClass={filterClass}
        onFilterClassChange={setFilterClass}
        filterSection={filterSection}
        onFilterSectionChange={setFilterSection}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        statusOptions={statusOptions}
        classOptions={classOptions}
        sectionOptions={sectionOptions}
        studentSelectOptions={studentSelectOptions}
      />

      {listLoading && students.length === 0 && (
        <LoadingBlock label="Loading student list…" />
      )}

      {detail && (
        <>
          {showStickyStudentName && pageStudentName ? (
            <div className="pointer-events-none fixed top-[5.75rem] left-[calc(16rem+1.25rem)] z-30 hidden w-[200px] xl:block">
              <StudentNameCard
                name={pageStudentName}
                meta={pageStudentMeta}
                className="pointer-events-auto border-line bg-elev-2/70 shadow-card "
              />
            </div>
          ) : null}

          {showStickyStudentName && pageStudentName ? (
            <div className="xl:hidden sticky top-0 z-30 -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6 py-2 mb-2 bg-elev-2/95 border-b border-line">
              <StudentNameCard name={pageStudentName} meta={pageStudentMeta} className="bg-transparent border-0 px-0 py-0" />
            </div>
          ) : null}

        <div className="min-w-0 w-full">
          {isSelectedInactive ? (
            <Alert tone="error">
              <span className="font-semibold">Inactive student.</span>{" "}
              This student is inactive — you cannot record new fees, mark attendance, or use the student portal until they are set back to Active. Existing payments and transaction history are unchanged.
            </Alert>
          ) : null}

          <div className="flex flex-col xl:flex-row xl:flex-wrap gap-4 sm:gap-6 md:gap-8 min-w-0 w-full items-start">
            <aside
              ref={sidebarAsideRef}
              className="relative z-10 w-full min-w-0 shrink-0 self-start xl:w-[280px] 2xl:w-[300px]"
            >
            <ProfileSidebar
              studentId={detail.student.id}
              feesRecordingDisabled={isSelectedInactive}
              student={{
                name: detail.student.name,
                id: detail.student.admissionNumber,
                className: detail.student.class?.displayName ?? "-",
                rollNo: detail.student.rollNo,
                age: String(detail.student.age ?? "-"),
                dob: detail.student.dob || "",
                email: detail.student.email,
                phone: detail.student.phone,
                address: detail.student.address || "—",
                photoUrl: detail.student.photoUrl ?? undefined,
              }}
              fatherName={detail.student.fatherName}
              fatherPhone={detail.student.fatherPhone}
              motherName={detail.student.motherName}
              motherPhone={detail.student.motherPhone}
              classId={detail.student.class?.id ?? null}
              classes={classes.map((c) => ({
                id: c.id,
                label: `${c.name}${c.section ? ` - ${c.section}` : ""}`,
              }))}
              gender={detail.student.gender ?? ""}
              residencyType={detail.student.residencyType ?? "Day Scholar"}
              onSaved={handleSidebarSaved}
              onOpenFees={() => {
                if (isSelectedInactive) return;
                warmFeeBreakdown();
                setFeesModalOpen(true);
              }}
              onFeesHover={warmFeeBreakdown}
            />
            </aside>

            <div className="flex-1 min-w-0 w-full xl:basis-[calc(100%-300px-2rem)] 2xl:basis-[calc(100%-320px-2rem)] space-y-4 sm:space-y-6 md:space-y-8">
            <ProfileStatCards detail={detail} feeBreakdown={feeBreakdown} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 min-w-0">
              <AcademicPerformance data={detail.academicPerformance} />
              <AttendanceTrends data={detail.attendanceTrends} />
            </div>
            </div>

            <div className="relative z-0 min-w-0 w-full basis-full space-y-4 sm:space-y-6 md:space-y-8">
            {detail.fee ? (
              <FeesBreakdown
                key={`fees-${detail.student.id}`}
                studentId={detail.student.id}
                classId={detail.student.class?.id ?? null}
                feesRecordingDisabled={isSelectedInactive}
                totalFee={feeBreakdown?.totalAmount ?? detail.fee.totalFee}
                baseTotalFee={
                  feeBreakdown?.dueHeads?.length
                    ? Math.round(
                        feeBreakdown.dueHeads.reduce((s, h) => s + (Number(h.grossAmount) || 0), 0)
                      )
                    : detail.fee.baseTotalFee
                }
                discountPercent={detail.fee.discountPercent}
                amountPaid={feeBreakdown?.amountPaid ?? detail.fee.amountPaid}
                remainingFee={feeBreakdown?.remainingFee ?? detail.fee.remainingFee}
                payments={detail.payments}
                studentName={detail.student.name}
                admissionNumber={detail.student.admissionNumber}
                classDisplayName={detail.student.class?.displayName ?? "-"}
                classSection={detail.student.class?.section ?? null}
                schoolName={detail.student.schoolName}
                discountFeeHeadKey={detail.fee.discountFeeHeadKey}
                discountFeeHeadLabel={detail.fee.discountFeeHeadLabel}
                discountRemarks={detail.fee.discountRemarks}
                discountFixedAmount={detail.fee.discountFixedAmount}
                latestDiscountApproval={detail.fee.discountApprovals?.[0] ?? null}
                discountApprovals={detail.fee.discountApprovals ?? []}
                onFeeModified={(paymentResult) => {
                  if (paymentResult?.payment.id) setAutoPrintPaymentId(paymentResult.payment.id);
                  if (detail.student.id) void refreshFeesForStudent(detail.student.id, paymentResult);
                }}
                residencyType={detail.student.residencyType ?? null}
                initialFeeBreakdown={feeBreakdown}
                feeBreakdownPending={feeBreakdownPending}
              />
            ) : null}

            <FeeTransactions
              key={`txns-${detail.student.id}`}
              fee={detail.fee}
              feeBreakdown={feeBreakdown}
              payments={detail.payments}
              transactionsLoading={!transactionsReady}
              applicationFee={detail.student.applicationFee}
              admissionFee={detail.student.admissionFee}
              studentCreatedAt={detail.student.createdAt}
              studentName={detail.student.name}
              studentId={detail.student.id}
              admissionNumber={detail.student.admissionNumber}
              classDisplayName={detail.student.class?.displayName ?? "-"}
              residencyType={detail.student.residencyType ?? "Day Scholar"}
              parentName={detail.student.fatherName?.trim() || "-"}
              motherName={detail.student.motherName?.trim() || "-"}
              parentPhone={
                detail.student.fatherPhone?.trim() ||
                detail.student.phone?.trim() ||
                "-"
              }
              feesRecordingDisabled={isSelectedInactive}
              autoPrintPaymentId={autoPrintPaymentId}
              onAutoPrintDone={() => setAutoPrintPaymentId(null)}
              onPaymentsChanged={() => {
                if (detail.student.id) void refreshFeesForStudent(detail.student.id);
              }}
              onPaymentDeleted={(result) => {
                if (detail.student.id) removePaymentForStudent(detail.student.id, result);
              }}
            />

            <Certificates certificates={detail.certificates} />
            </div>
          </div>
        </div>
        </>
      )}

      {!detail && selectedId && !listLoading && (
        <div className="text-center py-12 text-fg-muted">Student not found.</div>
      )}

      {feesModalOpen && detail && !isSelectedInactive ? (
        <StudentFeesPaymentModal
          studentId={detail.student.id}
          studentName={detail.student.name}
          initialFeeBreakdown={feeBreakdown ?? getFeeBreakdownCached(detail.student.id)}
          breakdownPending={feeBreakdownPending}
          onClose={() => setFeesModalOpen(false)}
          onSuccess={(result) => {
            setFeesModalOpen(false);
            if (result.payment.id) setAutoPrintPaymentId(result.payment.id);
            void refreshFeesForStudent(detail.student.id, result);
          }}
          onPaymentFailed={(message) => {
            alert(message);
            void refreshFeesForStudent(detail.student.id);
          }}
        />
      ) : null}

      {!detail && !selectedId && !listLoading && students.length === 0 && (
        <EmptyState icon={Users} title="No students found" description="Try a different class, section or status." />
      )}
    </SaPage>
  );
}

export default function StudentDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-fg-muted">
          <Spinner />
        </div>
      }
    >
      <StudentDetailsPageContent />
    </Suspense>
  );
}
