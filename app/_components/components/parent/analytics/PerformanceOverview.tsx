import React from "react";

const glass = "bg-elev-1 border border-line shadow-card";

interface PerformanceData {
  m: string;
  v: number;
  info: string;
}

interface PerformanceOverviewProps {
  data: PerformanceData[];
  average: number;
}

export default function PerformanceOverview({ data, average }: PerformanceOverviewProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);

  return (
    <div className={`${glass} rounded-2xl p-6 relative`}>
      <div className="flex justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Performance Overview</h3>
          <p className="text-fg-subtle text-sm">
            Last 6 months academic trend
          </p>
        </div>
        <div className="bg-elev-2 px-4 py-2 rounded-xl">
          <div className="text-xl font-bold">{average}%</div>
          <div className="text-[10px] text-fg-subtle">Average</div>
        </div>
      </div>

      <div className="flex items-end justify-between h-56 relative">
        {data.length > 0 ? (
          data.map((d, idx) => (
            <div
              key={d.m}
              className="flex flex-col items-center relative group cursor-pointer"
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Extra Info Box */}
              {hovered === idx && (
                <div className="absolute -top-24 w-40 bg-elev-3 text-on-primary p-3 rounded-lg shadow-pop z-20">
                  <div className="font-semibold text-sm">{d.m}</div>
                  <div className="text-xs mt-1">Avg Score: {d.v}%</div>
                  <div className="text-[10px] mt-1 text-fg-faint">{d.info}</div>
                </div>
              )}

              {/* Bar */}
              <div
                className="w-10 bg-gradient-to-t from-primary to-green-300 rounded-t-xl transition-all duration-300 hover:scale-110"
                style={{ height: `${Math.min(d.v * 2, 200)}px` }}
              />

              {/* Month Label */}
              <span className="text-xs mt-2 text-fg-muted">{d.m}</span>
            </div>
          ))
        ) : (
          <div className="w-full text-center text-fg-subtle py-8">
            No performance data available
          </div>
        )}
      </div>
    </div>
  );
}
