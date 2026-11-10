import { ArrowRight, Award, Bell, Calendar, FileText, IndianRupee, type LucideIcon } from "lucide-react";
import { Badge, EmptyState, Panel, btnClass } from "@/app/_components/components/common/ui";

interface ListItemProps {
  title: string;
  subtitle: string;
  meta?: string;
  status?: "Approved" | "Pending" | "Confirmed" | "Scheduled";
  type?: "activity" | "teacher" | "workshop";
  activityType?: "certificate" | "leave" | "fee" | "news";
}

const ACTIVITY: Record<string, { Icon: LucideIcon; tone: string }> = {
  certificate: { Icon: Award, tone: "bg-violet-500/10 text-violet-700 dark:text-violet-300" },
  leave: { Icon: FileText, tone: "bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  fee: { Icon: IndianRupee, tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  news: { Icon: Bell, tone: "bg-sky-500/10 text-sky-700 dark:text-sky-300" },
};

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
}

export const SidebarList = ({
  title,
  items,
  subtitle,
  showViewAll = true,
  onViewAllClick,
}: {
  title: string;
  items: ListItemProps[];
  subtitle?: string;
  showViewAll?: boolean;
  onViewAllClick?: () => void;
}) => (
  <Panel
    title={title}
    description={subtitle}
    className="h-full"
    bodyClassName="p-0"
    actions={
      showViewAll && onViewAllClick ? (
        <button type="button" onClick={onViewAllClick} className={btnClass("ghost", "sm")}>
          View All <ArrowRight size={14} />
        </button>
      ) : undefined
    }
  >
    {items.length === 0 ? (
      <EmptyState title="Nothing here right now" />
    ) : (
      <ul className="divide-y divide-line-subtle">
        {items.map((item, idx) => {
          const act = ACTIVITY[item.activityType ?? ""];
          return (
            <li key={idx} className="flex items-center justify-between gap-3 px-5 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                {item.type === "teacher" ? (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-semibold text-primary">
                    {initials(item.title)}
                  </span>
                ) : item.type === "workshop" ? (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Calendar size={16} />
                  </span>
                ) : (
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${act?.tone ?? "bg-elev-2 text-fg-subtle"}`}>
                    {act ? <act.Icon size={16} /> : <FileText size={16} />}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-fg">{item.title}</p>
                  <p className="truncate text-xs text-fg-subtle">{item.subtitle}</p>
                  {item.meta && <p className="mt-0.5 text-[11px] text-fg-faint">{item.meta}</p>}
                </div>
              </div>
              {item.status && (
                <Badge tone={item.status === "Pending" ? "gold" : item.status === "Scheduled" ? "sky" : "green"} dot>
                  {item.status}
                </Badge>
              )}
            </li>
          );
        })}
      </ul>
    )}
  </Panel>
);
