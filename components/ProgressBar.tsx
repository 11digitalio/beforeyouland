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
        "mt-2 h-2 overflow-hidden rounded-full bg-linen",
        celebrating ? "progress-milestone" : ""
      ].join(" ")}
    >
      <div
        aria-label={`${safeValue}% completed`}
        className={[
          "h-full rounded-full bg-pine",
          reducedMotion ? "" : "transition-[width] duration-500 ease-out"
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
