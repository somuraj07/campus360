import { CalendarDays, CheckCircle, List, Users } from "lucide-react";
import { KpiCard, KpiGrid } from "../../../common/ui";

export function WorkshopStatTiles({
  stats,
}: {
  stats: { total: number; upcoming: number; participants: number; completed: number };
}) {
  return (
    <KpiGrid>
      <KpiCard label="Total Events" value={stats.total} icon={List} hint="Workshops and events" />
      <KpiCard label="Upcoming" value={stats.upcoming} icon={CalendarDays} tone="sky" hint="Scheduled ahead" />
      <KpiCard label="Participants" value={stats.participants} icon={Users} tone="gold" hint="Total registrations" />
      <KpiCard label="Completed" value={stats.completed} icon={CheckCircle} tone="green" hint="Already held" />
    </KpiGrid>
  );
}
