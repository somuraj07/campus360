"use client";

import { SaPage, SaPageHeader, SearchBox, btnClass } from "../../common/ui";
import CreateEventForm from "../../schooladmin/workshops/CreateEventForm";
import EventDetailsModal from "../../schooladmin/workshops/EventDetailsModal";
import DeleteEventModal from "../../schooladmin/workshops/DeleteEventModal";
import { Plus, X } from "lucide-react";
import { useTeacherWorkshopsState } from "./shared";
import { WorkshopStatTiles } from "./shared";
import { WorkshopEventsList } from "./shared";

export default function TeacherWorkshopsTab() {
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
    search,
    setSearch,
    formRef,
    setCurrentPage,
    pageSize,
    handleCreated,
    stats,
    filteredEvents,
    totalPages,
    clampedPage,
    pagedEventsWithStatus,
    handleDeleteConfirm,
  } = useTeacherWorkshopsState();

  const formOpen = activeAction === "workshop";

  return (
    <SaPage>
        <SaPageHeader
          eyebrow="Activities"
          title="Workshops & Events"
          description="Plan, manage, and issue certificates for workshops and events"
          actions={
            <>
              <SearchBox value={search} onChange={setSearch} placeholder="Search events..." className="w-full sm:w-64" />
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
            </>
          }
        />

        <WorkshopStatTiles stats={stats} />

        {activeAction === "workshop" && (
          <div ref={formRef}>
            <CreateEventForm
              onCancel={() => {
                setActiveAction("none");
                setEditingEvent(null);
              }}
              onCreated={handleCreated}
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
        />

        <DeleteEventModal
          open={Boolean(deleteTarget)}
          title={deleteTarget?.title}
          loading={deleteLoading}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
        />

        <WorkshopEventsList
          loadingEvents={loadingEvents}
          events={events}
          eventsError={eventsError}
          filteredEvents={filteredEvents}
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
