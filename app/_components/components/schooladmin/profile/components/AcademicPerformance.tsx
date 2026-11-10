import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  data?: Array<{ subject: string; score: number }>;
  rightAction?: ReactNode;
};

export const AcademicPerformance = ({ data = [], rightAction }: Props) => {
  const chartData = data.length > 0 ? data : [];

  return (
    <div className="bg-elev-1 border border-line rounded-2xl p-5 sm:p-6 w-full min-w-0 overflow-hidden">
      <div className="mb-5 flex min-w-0 flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-fg text-[15px] font-semibold flex items-center gap-2 sm:gap-3 min-w-0">
            <TrendingUp className="h-[18px] w-[18px] shrink-0 text-primary" />
            <span className="leading-tight">Academic Performance</span>
          </h3>
          {rightAction ? <div className="w-full sm:w-auto">{rightAction}</div> : null}
        </div>
      </div>

      <div className="h-64 w-full min-h-[200px]">
        {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 4, left: -12, bottom: 8 }}>
            <CartesianGrid 
              vertical={false} 
              strokeDasharray="3 3" 
              stroke="var(--line)" 
            />
            <XAxis
              dataKey="subject"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--fg-subtle)", fontSize: 11 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "var(--fg-subtle)", fontSize: 14 }} 
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Bar
              dataKey="score"
              fill="#0EA5E9"
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-fg-subtle text-sm">No academic data</div>
        )}
      </div>
    </div>
  );
};
