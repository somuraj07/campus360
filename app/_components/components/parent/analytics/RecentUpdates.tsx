import { Bell } from "lucide-react";

interface Update {
  title: string;
  kind: string;
  dateLabel: string;
}

interface RecentUpdatesProps {
  updates: Update[];
  newCount: number;
}

const glassPanel =
  "rounded-2xl border border-line bg-elev-1 shadow-card p-5 sm:p-6";

export default function RecentUpdates({ updates, newCount }: RecentUpdatesProps) {
  return (
    <div className={glassPanel}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Bell size={16} />
          </span>
          <h3 className="text-xl font-semibold">Recent Updates</h3>
        </div>
        <span className="rounded-full border border-line bg-elev-2 px-3 py-1 text-xs font-semibold text-fg">
          {newCount} New
        </span>
      </div>

      <div className="space-y-2.5">
        {updates.length > 0 ? (
          updates.map((update, i) => (
            <div
              key={`${update.title}-${i}`}
              className="flex items-start justify-between gap-3 rounded-2xl border border-line bg-elev-1 px-4 py-3.5"
            >
              <div className="min-w-0 flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-elev-2 text-primary">
                  <Bell size={16} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-fg">{update.title}</p>
                  <p className="truncate text-sm text-fg-muted">{update.kind}</p>
                </div>
              </div>
              <p className="shrink-0 pt-1 text-sm text-fg-muted">{update.dateLabel}</p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-line bg-elev-1 px-4 py-3.5 text-sm text-fg-subtle">
            No recent updates
          </div>
        )}
      </div>
    </div>
  );
}
