import type { StatCardConfig } from "./useParentAttendanceState";
import { KpiCard, KpiGrid } from "../../../common/ui";

export function AttendanceStatCardsSection({ statCards }: { statCards: StatCardConfig[] }) {
  return (
    <KpiGrid>
      {statCards.map((card) => (
        <KpiCard
          key={card.key}
          label={card.title}
          value={card.value}
          icon={card.icon}
          hint={
            <span className="flex flex-wrap items-center justify-between gap-2">
              <span>{card.footer}</span>
              {card.badge ? <span className={card.badgeClass}>{card.badge}</span> : null}
            </span>
          }
        />
      ))}
    </KpiGrid>
  );
}
