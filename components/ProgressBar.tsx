export function ProgressBar({
  value,
  celebrating = false,
  reducedMotion = false
}: {
  value: number;
  celebrating?: boolean;
  reducedMotion?: boolean;
}) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={[
        "mt-1.5 h-1 overflow-hidden bg-neutral-200",
        celebrating ? "progress-milestone" : ""
      ].join(" ")}
    >
      <div
        aria-label={`${safeValue}% completed`}
        className={[
          "h-full bg-neutral-900",
          reducedMotion ? "" : "transition-[width] duration-200 ease-out"
        ].join(" ")}
        role="progressbar"
        style={{ width: `${safeValue}%` }}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={safeValue}
      />
    </div>
  );
}
