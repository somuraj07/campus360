import { ArrowRight, Newspaper } from "lucide-react";
import type { SchoolDashboardPayload } from "@/lib/school/loadSchoolDashboard";
import { formatTimeAgo } from "./formatTimeAgo";
import { Panel, btnClass } from "@/app/_components/components/common/ui";

export function DashboardNewsSection({
  latestNews,
  onViewAll,
}: {
  latestNews: SchoolDashboardPayload["latestNews"] | undefined;
  onViewAll: () => void;
}) {
  if (!latestNews || latestNews.length === 0) return null;

  return (
    <Panel
      icon={Newspaper}
      title="Latest News"
      description="Recent announcements and updates"
      actions={
        <button type="button" onClick={onViewAll} className={btnClass("ghost", "sm")}>
          View All <ArrowRight size={14} />
        </button>
      }
      bodyClassName="p-0"
    >
      <ul className="grid grid-cols-1 divide-y divide-line-subtle md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-3">
        {latestNews.map((n) => (
          <li key={n.id} className="flex flex-col p-5">
            <h4 className="line-clamp-2 text-sm font-semibold text-fg">{n.title}</h4>
            <p className="mt-1.5 line-clamp-3 flex-1 text-sm text-fg-muted">{n.description}</p>
            <div className="mt-3 flex items-center justify-between gap-2 text-xs text-fg-subtle">
              <span className="truncate">Posted by {n.postedBy}</span>
              <span className="shrink-0">{formatTimeAgo(n.createdAt)}</span>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
