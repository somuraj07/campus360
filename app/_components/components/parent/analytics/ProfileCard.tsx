import { Trophy } from "lucide-react";

const glass = "bg-elev-1 border border-line shadow-card";

interface ProfileCardProps {
  name: string;
  class: string;
  rollNo: string;
  photoUrl: string | null;
  grade: string;
  score: number;
  rank: number | null;
}

export default function ProfileCard({
  name,
  class: className,
  rollNo,
  photoUrl,
  grade,
  score,
  rank,
}: ProfileCardProps) {
  const avatarUrl = photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

  return (
    <div className={`${glass} rounded-2xl overflow-hidden`}>
      <div className="p-5 bg-yellow-400/10">
        <span className="text-xs text-yellow-700 dark:text-yellow-400">★ Star Student</span>
        <h2 className="text-xl font-bold mt-1">{name}</h2>
        <p className="text-fg-subtle text-sm">{className} • Roll {rollNo || "—"}</p>
      </div>
      <img
        src={avatarUrl}
        alt={name}
        className="w-full h-48 object-cover bg-well"
      />
      <div className="p-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-fg-muted">Overall Performance</span>
          <Trophy className="text-yellow-700 dark:text-yellow-400" size={16} />
        </div>
        <div className="text-green-700 dark:text-green-400 text-2xl font-bold">{grade} {score.toFixed(1)}%</div>
        <div className="w-full h-2 bg-elev-2 rounded mt-2">
          <div className="h-full bg-primary rounded" style={{ width: `${Math.min(score, 100)}%` }} />
        </div>
        {rank && <p className="text-xs text-fg-subtle mt-2">Rank #{rank}</p>}
      </div>
    </div>
  );
}
