"use client";

interface StatusBadgeProps {
  status: "active" | "inactive";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const isActive = status === "active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
        isActive
          ? "bg-primary/15 text-primary border-primary/30"
          : "bg-red-400/15 text-red-700 dark:text-red-400 border-red-400/30"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isActive ? "bg-primary" : "bg-red-400"
        }`}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
