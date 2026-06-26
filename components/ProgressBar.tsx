export function ProgressBar({ value }: { value: number }) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className="mt-2 h-2 overflow-hidden rounded-full bg-linen">
      <div
        aria-label={`${safeValue}% completed`}
        className="h-full rounded-full bg-pine transition-all duration-300"
        role="progressbar"
        style={{ width: `${safeValue}%` }}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={safeValue}
      />
    </div>
  );
}
