export function ProgressBar({
  value,
  label,
}: {
  value: number;
  label?: string;
}) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className="w-full">
      <progress
        value={safeValue}
        max={100}
        aria-label={label ?? `进度 ${safeValue}%`}
        className="h-2 w-full overflow-hidden rounded-full
          [&::-webkit-progress-bar]:rounded-full
          [&::-webkit-progress-bar]:bg-slate-100
          [&::-webkit-progress-value]:rounded-full
          [&::-webkit-progress-value]:bg-slate-900
          [&::-moz-progress-bar]:rounded-full
          [&::-moz-progress-bar]:bg-slate-900"
      />
    </div>
  );
}
