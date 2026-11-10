interface ProgressBarProps {
  label: string;
  value: number;
  color: string;
  textColor: string;
}

export default function ProgressBar({
  label,
  value,
  color,
  textColor,
}: ProgressBarProps) {
  return (
    <div className="bg-elev-1 rounded-xl p-3 border border-line-subtle">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-fg-muted">{label}</span>
        <span className={`text-sm font-bold ${textColor}`}>
          {value}%
        </span>
      </div>

      <div className="w-full h-2 bg-elev-2 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

