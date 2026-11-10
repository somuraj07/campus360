"use client";

import { SaPage, SaPageHeader, btnClass } from "../common/ui";
import CreateHub from "./workshops/CreateHub";
import CreateEventForm from "./workshops/CreateEventForm";
import EventDetailsModal from "./workshops/EventDetailsModal";
import DeleteEventModal from "./workshops/DeleteEventModal";
import { Plus, X } from "lucide-react";
import { useWorkshopsAndEventsState, WorkshopsStatTiles, WorkshopsEventsList } from "./shared/workshops-and-events";

export default function WorkshopsAndEventsTab() {
  const {
    activeAction,
    setActiveAction,
    events,
    loadingEvents,
    eventsError,
    detailsOpen,
    setDetailsOpen,
    setSelectedEventId,
    detailsLoading,
    detailsError,
    eventDetails,
    setEventDetails,
    setDetailsError,
    editingEvent,
    setEditingEvent,
    deleteTarget,
    setDeleteTarget,
    deleteLoading,
    formRef,
    setCurrentPage,
    pageSize,
    handleEventUpsert,
    stats,
    totalPages,
    clampedPage,
    pagedEventsWithStatus,
    handleDeleteConfirm,
  } = useWorkshopsAndEventsState();

  const formOpen = activeAction === "workshop";

  return (
    <SaPage>
        <SaPageHeader
          eyebrow="Activities"
          title="Workshops & Events"
          description="Plan, manage, and issue certificates for workshops and events"
          actions={
            <button
              type="button"
              aria-expanded={formOpen}
              className={btnClass(formOpen ? "secondary" : "primary")}
              onClick={() => {
                if (formOpen) {
                  setActiveAction("none");
                  return;
                }
                setEditingEvent(null);
                setActiveAction("workshop");
              }}
            >
              {formOpen ? <X size={16} /> : <Plus size={16} />}
              {formOpen ? "Cancel" : "Create Event"}
            </button>
          }
        />

        <WorkshopsStatTiles stats={stats} />

        <CreateHub events={events} />

        {activeAction === "workshop" && (
          <div ref={formRef}>
            <CreateEventForm
              onCancel={() => {
                setActiveAction("none");
                setEditingEvent(null);
              }}
              onCreated={handleEventUpsert}
              initialEvent={editingEvent}
            />
          </div>
        )}

        <EventDetailsModal
          open={detailsOpen}
          onClose={() => {
            setDetailsOpen(false);
            setSelectedEventId(null);
            setEventDetails(null);
            setDetailsError(null);
          }}
          loading={detailsLoading}
          error={detailsError}
          event={eventDetails}
          showEnrolledStudents
        />

        <DeleteEventModal
          open={Boolean(deleteTarget)}
          title={deleteTarget?.title}
          loading={deleteLoading}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
        />

        <WorkshopsEventsList
          loadingEvents={loadingEvents}
          events={events}
          eventsError={eventsError}
          pagedEventsWithStatus={pagedEventsWithStatus}
          pageSize={pageSize}
          clampedPage={clampedPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          onViewDetails={(eventId) => {
            setSelectedEventId(eventId);
            setDetailsOpen(true);
          }}
          onEdit={(event) => {
            setEditingEvent(event);
            setActiveAction("workshop");
          }}
          onDelete={(event) => setDeleteTarget(event)}
        />
    </SaPage>
  );
}
