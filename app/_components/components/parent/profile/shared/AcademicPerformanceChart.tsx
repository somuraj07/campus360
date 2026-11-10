import { BarChart3, ChevronDown } from "lucide-react";

export function AcademicPerformanceChart({
  filteredPerformance,
  examTypeOptions,
  examTypeFilter,
  onExamTypeFilterChange,
}: {
  filteredPerformance: Array<{ subject: string; score: number }>;
  examTypeOptions: string[];
  examTypeFilter: string;
  onExamTypeFilterChange: (v: string) => void;
}) {
  if (filteredPerformance.length === 0) return null;

  return (
    <section className="rounded-2xl  border border-line p-8 shadow-card overflow-hidden mt-10">

      {/* Header + Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-fg">
          <BarChart3 className="w-7 h-7 text-primary" />
          Academic Performance
        </h2>

        {examTypeOptions.length > 1 && (
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                const next =
                  examTypeFilter === "ALL" && examTypeOptions.length > 1
                    ? examTypeOptions[1]
                    : "ALL";
                onExamTypeFilterChange(next);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-well border border-line text-xs sm:text-sm font-semibold text-fg"
            >
              {examTypeFilter === "ALL" ? "All exams" : examTypeFilter}
              <ChevronDown className="w-4 h-4 text-fg-muted" />
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-6 min-h-[340px] mt-8">
        {/* Y Axis */}
        <div className="flex flex-col-reverse justify-between text-fg-subtle text-xs font-medium pb-[34px]">
          {[0, 25, 50, 75, 100].map((val) => (
            <span key={val} className="h-0 flex items-center">{val}</span>
          ))}
        </div>

        {/* Chart Area */}
        <div className="relative flex-1">
          {/* Grid Lines */}
          {[0, 25, 50, 75, 100].map((val) => (
            <div
              key={val}
              className="absolute left-0 right-0 border-t border-line-subtle"
              style={{ bottom: `${(val / 100) * 280}px` }}
            />
          ))}

          {/* Bars Area - Strictly for bars and scores */}
          <div className="absolute inset-0 flex items-end justify-around px-2">
            {filteredPerformance.map((item) => (
              <div
                key={item.subject}
                className="flex flex-col items-center justify-end h-full"
                style={{ width: '15%' }}
              >
                {/* Score Label */}
                <span className="text-fg font-bold text-sm mb-2 transition-transform duration-300 group-hover:scale-110">
                  {item.score}
                </span>

                {/* Bar - Fixed at 280px container height, aligned to bottom */}
                <div
                  className="w-full max-w-[60px] rounded-t-xl bg-primary transition-all duration-1000 ease-out hover:bg-primary-hover "
                  style={{
                    height: `${(item.score / 100) * 280}px`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Separate Row for Subject Labels (Outside the Chart Container) */}
      <div className="flex justify-around mt-4 pl-12 pr-2">
        {filteredPerformance.map((item) => (
          <span key={item.subject} className="text-fg-muted text-xs font-medium tracking-wide w-[15%] text-center">
            {item.subject}
          </span>
        ))}
      </div>
    </section>
  );
}
