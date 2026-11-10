"use client";
import TimellyLoader from "../common/TimellyLoader";
import { Clock, CheckCircle, UserCheck, FileText } from "lucide-react";
import { SaPage, SaPageHeader, KpiGrid, KpiCard, Panel, Segmented } from "../common/ui";
import { useTeacherLeavesState, LeaveCardList, LeaveTable, ConditionalApprovalModal } from "./shared/teacher-leaves";

export default function SchoolTeacherLeavesTab() {
  const {
    pendingLeaves,
    allLeaves,
    activeTab,
    setActiveTab,
    loading,
    showConditionalModal,
    setShowConditionalModal,
    selectedLeaveId,
    setSelectedLeaveId,
    conditionalMessage,
    setConditionalMessage,
    actionId,
    currentMonthLabel,
    approveLeave,
    conditionalApproveLeave,
    rejectLeave,
    approvedToday,
    currentMonthLeaves,
    teachersOnLeaveToday,
    approvedLeaves,
    rejectedLeaves,
  } = useTeacherLeavesState();

  if (loading && pendingLeaves.length === 0 && allLeaves.length === 0) {
    return (
      <TimellyLoader
        title="Loading teacher leaves"
        steps={["Pending requests", "Leave history", "Approvals"]}
      />
    );
  }

  const visibleLeaves =
    activeTab === "PENDING" ? pendingLeaves : activeTab === "APPROVED" ? approvedLeaves : rejectedLeaves;
  const openConditional = (id: string) => {
    setSelectedLeaveId(id);
    setShowConditionalModal(true);
  };

  return (
    <SaPage>
      <SaPageHeader
        eyebrow="Staff"
        title="Teacher Leave Management"
        description={loading ? "Refreshing leave requests..." : "Review and manage teacher leave requests"}
      />

      <KpiGrid>
        <KpiCard label="Pending Requests" value={pendingLeaves.length} icon={Clock} tone="gold" hint="Awaiting your decision" />
        <KpiCard label="Approved Today" value={approvedToday.length} icon={CheckCircle} tone="green" hint="Decided today" />
        <KpiCard label="Teachers on Leave" value={teachersOnLeaveToday.length} icon={UserCheck} tone="sky" hint="Away today" />
        <KpiCard label="Total Requests" value={currentMonthLeaves.length} icon={FileText} hint={currentMonthLabel} />
      </KpiGrid>

      <Panel
        title="Leave Requests"
        description={`${visibleLeaves.length} ${activeTab.toLowerCase()} request${visibleLeaves.length === 1 ? "" : "s"}`}
        actions={
          <Segmented
            value={activeTab}
            onChange={setActiveTab}
            options={[
              { value: "PENDING", label: `Pending (${pendingLeaves.length})` },
              { value: "APPROVED", label: `Approved (${approvedLeaves.length})` },
              { value: "REJECTED", label: `Rejected (${rejectedLeaves.length})` },
            ]}
          />
        }
        bodyClassName="p-0"
      >
        <div className="p-4 md:hidden">
          <LeaveCardList
            leaves={visibleLeaves}
            status={activeTab}
            actionId={actionId}
            onApprove={approveLeave}
            onReject={rejectLeave}
            onConditional={openConditional}
          />
        </div>
        <div className="hidden md:block">
          <LeaveTable
            leaves={visibleLeaves}
            status={activeTab}
            actionId={actionId}
            onApprove={approveLeave}
            onReject={rejectLeave}
            onConditional={openConditional}
          />
        </div>
      </Panel>

      {showConditionalModal && (
        <ConditionalApprovalModal
          conditionalMessage={conditionalMessage}
          onConditionalMessageChange={setConditionalMessage}
          onCancel={() => setShowConditionalModal(false)}
          onConfirm={() => void conditionalApproveLeave()}
          confirmDisabled={actionId === selectedLeaveId}
        />
      )}
    </SaPage>
  );
}
