

"use client";
import { motion } from "framer-motion";

interface TeacherStatCardProps {
  avatar: string; name: string; code: string; percentage: number;
 stats: { label: string; value: number; color: string }[];
  statuses: { label: string; active?: boolean }[];

  onStatusChange?: (label: string) => void;
}

export default function TeacherStatCard({ avatar, name, code, percentage, stats, statuses, onStatusChange }: TeacherStatCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} className="bg-surface rounded-2xl border border-line flex flex-col overflow-hidden hover:border-primary/30 transition-all">
      <div className="p-4 flex items-center justify-between gap-3 bg-elev-1">
        <div className="flex items-center gap-3 min-w-0">
          <img src={avatar} className="w-11 h-11 rounded-full object-cover ring-2 ring-line-strong" alt={name} />
          <div className="truncate">
            <p className="text-fg font-bold text-sm truncate">{name}</p>
            <p className="text-fg-subtle text-[10px] uppercase tracking-tighter">{code}</p>
          </div>
        </div>
        <div className="shrink-0 bg-primary text-on-primary text-[10px] font-black px-2 py-1 rounded-md">{percentage}%</div>
      </div>

      <div className="grid grid-cols-4 gap-1 p-3 bg-well border-b border-line-subtle">
        {stats.map((s, i) => (
          <div key={i} className="text-center">
            <p className={`text-sm font-bold ${s.color || "text-fg"}`}>{s.value}</p>
            <p className="text-[10px] text-fg-faint font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="p-3 grid grid-cols-4 gap-2">
        {statuses.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onStatusChange?.(s.label)}
            className={`h-9 rounded-xl text-xs font-bold transition-all ${
              s.active ? "bg-primary text-on-primary " : "bg-elev-1 text-fg-faint hover:bg-elev-3"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}