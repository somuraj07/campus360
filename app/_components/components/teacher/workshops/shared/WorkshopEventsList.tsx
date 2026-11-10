import TimellyLoader from "../../../common/TimellyLoader";
import EventCard from "../../../schooladmin/workshops/EventCard";
import type { EventItem } from "@/lib/school/loadSchoolAdminFastTabs";

export function WorkshopEventsList({
  loadingEvents,
  events,
  eventsError,
  filteredEvents,
  pagedEventsWithStatus,
  pageSize,
  clampedPage,
  totalPages,
  setCurrentPage,
  onViewDetails,
  onEdit,
  onDelete,
}: {
  loadingEvents: boolean;
  events: EventItem[];
  eventsError: string | null;
  filteredEvents: EventItem[];
  pagedEventsWithStatus: Array<{ event: EventItem; status: "upcoming" | "completed" }>;
  pageSize: number;
  clampedPage: number;
  totalPages: number;
  setCurrentPage: (updater: (p: number) => number) => void;
  onViewDetails: (eventId: string) => void;
  onEdit: (event: EventItem) => void;
  onDelete: (event: EventItem) => void;
}) {
  return (
    <section className="space-y-4">
      {loadingEvents && events.length === 0 && (
        <TimellyLoader
          compact
          title="Loading events"
          steps={["Workshops", "Registrations", "Schedule"]}
        />
      )}

      {eventsError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {eventsError}
        </div>
      )}

      {!loadingEvents && filteredEvents.length === 0 && !eventsError && (
        <div className="rounded-2xl border border-line bg-elev-1 px-4 py-6 text-sm text-fg-subtle">
          No workshops or events found. Create one above.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {pagedEventsWithStatus.map(({ event, status }) => {
          return (
            <EventCard
              key={event.id}
              title={event.title}
              description={event.description}
              eventDate={event.eventDate}
              location={event.location}
              mode={event.mode}
              registrations={event._count?.registrations ?? 0}
              maxSeats={event.maxSeats}
              teacherName={event.teacher?.name ?? ""}
              status={status}
              photo={event.photo}
              additionalInfo={event.additionalInfo}
              onViewDetails={() => onViewDetails(event.id)}
              onEdit={() => onEdit(event)}
              onDelete={() => onDelete(event)}
            />
          );
        })}
      </div>

      {filteredEvents.length > pageSize && (
        <div className="flex items-center justify-between pt-3">
          <span className="text-xs text-fg-subtle">
            Page {clampedPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={clampedPage === 1}
              className="rounded-full px-4 py-2 text-xs font-semibold border border-line bg-elev-1 text-fg-muted hover:bg-elev-3 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={clampedPage === totalPages}
              className="rounded-full px-4 py-2 text-xs font-semibold border border-line bg-elev-1 text-fg-muted hover:bg-elev-3 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
