import React from "react";

const glass = "bg-elev-1 border border-line shadow-card";

interface GlassListProps {
  title: string;
  children: React.ReactNode;
}

export default function GlassList({ title, children }: GlassListProps) {
  return (
    <div className={`${glass} rounded-2xl p-5 space-y-3`}>
      <h3 className="font-semibold">{title}</h3>
      {children}
    </div>
  );
}
