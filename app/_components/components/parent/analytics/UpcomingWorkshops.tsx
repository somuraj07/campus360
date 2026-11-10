import { CalendarDays, ChevronRight, Clock3, UserRound, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";

interface Workshop {
  id: string;
  title: string;
  teacher: string;
  dateLabel: string;
  timeLabel: string;
  seatsLabel: string;
  mode: string;
  image: string;
}

interface UpcomingWorkshopsProps {
  workshops: Workshop[];
}

const glass =
  "rounded-2xl border border-line bg-elev-1 shadow-card p-5 sm:p-6";

export default function UpcomingWorkshops({ workshops }: UpcomingWorkshopsProps) {
  const router = useRouter();
  const openWorkshopsTab = () => {
    router.push("/parent?tab=workshops");
  };

  return (
    <div className={glass}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-3xl font-semibold">Upcoming Workshops</h3>
          <p className="text-sm text-fg-muted">Enhance skills with expert-led sessions</p>
        </div>
        <button
          type="button"
          onClick={openWorkshopsTab}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20"
        >
          View All <ChevronRight size={16} />
        </button>
      </div>

      {workshops.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {workshops.map((w) => (
            <div
              key={w.id}
              role="button"
              tabIndex={0}
              onClick={openWorkshopsTab}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openWorkshopsTab();
                }
              }}
              className="overflow-hidden rounded-2xl border border-line bg-elev-1 text-left transition hover:border-primary/30 cursor-pointer"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <img src={w.image} alt={w.title} className="h-full w-full object-cover" />
                <span className="absolute right-3 top-3 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-fg">
                  {w.mode}
                </span>
              </div>

              <div className="space-y-2 px-4 py-4 sm:px-5">
                <h4 className="text-2xl font-semibold text-fg">{w.title}</h4>

                <p className="flex items-center gap-2 text-sm text-fg-muted">
                  <UserRound size={14} className="text-primary" /> {w.teacher}
                </p>
                <p className="flex items-center gap-2 text-sm text-fg-muted">
                  <CalendarDays size={14} className="text-primary" /> {w.dateLabel}
                </p>
                <p className="flex items-center gap-2 text-sm text-fg-muted">
                  <Clock3 size={14} className="text-primary" /> {w.timeLabel}
                </p>

                <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                  <p className="flex items-center gap-2 text-sm text-fg-muted">
                    <UsersRound size={14} className="text-primary" /> {w.seatsLabel}
                  </p>
                  <button className="rounded-full border border-primary/35 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary hover:bg-primary/20">
                    Register
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-elev-1 px-4 py-4 text-sm text-fg-subtle">
          No upcoming workshops
        </div>
      )}
    </div>
  );
}
