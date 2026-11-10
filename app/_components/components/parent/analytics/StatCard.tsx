import React from "react";

const glass = "bg-elev-1 border border-line shadow-card";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  tag: string;
}

export default function StatCard({ icon, label, value, sub, tag }: StatCardProps) {
  return (
    <div className={`${glass} rounded-2xl p-4 sm:p-5`}>
      <div className="flex justify-between mb-3">
        <div className="bg-elev-2 p-2 rounded-lg">{icon}</div>
        <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
          {tag}
        </span>
      </div>
      <div className="text-fg-muted text-xs">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-fg-subtle">{sub}</div>
    </div>
  );
}
