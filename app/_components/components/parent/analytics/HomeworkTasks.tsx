import { BookOpen } from "lucide-react";

interface HomeworkTask {
  subject: string;
  title: string;
  dueLabel: string;
}

interface HomeworkTasksProps {
  tasks: HomeworkTask[];
  pendingCount: number;
}

const glassPanel =
  "rounded-2xl border border-line bg-elev-1 shadow-card p-5 sm:p-6";

export default function HomeworkTasks({ tasks, pendingCount }: HomeworkTasksProps) {
  return (
    <div className={glassPanel}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BookOpen size={16} />
          </span>
          <h3 className="text-xl font-semibold">Homework Tasks</h3>
        </div>
        <span className="rounded-full border border-line bg-elev-2 px-3 py-1 text-xs font-semibold text-fg">
          {pendingCount} Pending
        </span>
      </div>

      <div className="space-y-2.5">
        {tasks.length > 0 ? (
          tasks.map((task, i) => (
            <div
              key={`${task.subject}-${task.title}-${i}`}
              className="flex items-start justify-between gap-3 rounded-2xl border border-line bg-elev-1 px-4 py-3.5"
            >
              <div className="min-w-0 flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-elev-2 text-primary">
                  <BookOpen size={16} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-fg">{task.subject}</p>
                  <p className="truncate text-sm text-fg-muted">{task.title}</p>
                </div>
              </div>
              <p className="shrink-0 pt-1 text-sm text-fg-muted">{task.dueLabel}</p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-line bg-elev-1 px-4 py-3.5 text-sm text-fg-subtle">
            No upcoming homework
          </div>
        )}
      </div>
    </div>
  );
}
