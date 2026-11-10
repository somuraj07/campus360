import { ChevronDown, Clock, Plus } from "lucide-react";
import PageHeader from "../../../common/PageHeader";
import { EmptyState, btnClass } from "../../../common/ui";
import TimellyLoader from "../../../common/TimellyLoader";
import { useTeacherLeaveState } from "./shared";
import { LeaveApplicationForm } from "./shared";
import { LeaveHistorySection } from "./shared";

export default function TeacherLeave() {
  const {
    showForm,
    setShowForm,
    formData,
    setFormData,
    myLeaves,
    loading,
    submitLoading,
    error,
    editingLeave,
    handleSubmit,
    handleEdit,
    handleCancel,
    closeForm,
  } = useTeacherLeaveState();

  return (
    <div className="w-full space-y-5 pb-10 text-fg">
      {/* 1. Header Section */}
      <PageHeader
        eyebrow="Leave"
        title={showForm ? (editingLeave ? "Edit Leave Request" : "Apply New Leave") : "My Leave Application"}
        subtitle={showForm ? "Please fill in the details below" : "Apply for leave and track your status"}
        rightSlot={
          !showForm ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className={btnClass("primary")}
            >
              <Plus size={16} />
              <span>New Leave</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={closeForm}
              className={btnClass("secondary")}
            >
              <ChevronDown size={16} />
              <span>Cancel</span>
            </button>
          )
        }
      />
      {/* GLOBAL PAGE LOADING */}
      {loading && !showForm && myLeaves.length === 0 && (
        <TimellyLoader title="Loading leaves" steps={["Requests", "History", "Status"]} />
      )}

      {/* 2. The Form */}
      {showForm && (
        <LeaveApplicationForm
          editingLeave={editingLeave}
          error={error}
          formData={formData}
          setFormData={setFormData}
          submitLoading={submitLoading}
          onSubmit={handleSubmit}
        />
      )}

      {/* 3. Leave History Section */}
      {myLeaves.length > 0 && !showForm && (
        <LeaveHistorySection myLeaves={myLeaves} onEdit={handleEdit} onCancel={handleCancel} />
      )}

      {!loading && myLeaves.length === 0 && !showForm && (
        <div className="rounded-2xl border border-line bg-elev-1">
          <EmptyState icon={Clock} title="No leave applications yet" description="Apply for your first leave with New Leave." />
        </div>
      )}
    </div>
  );
}
