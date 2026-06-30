import { timingLabels } from "@/components/Badge";
import type { ChecklistTiming } from "@/types/checklist";

type TimingFilter = ChecklistTiming | "all";

const timingOptions: Array<{ value: TimingFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "before-flight", label: timingLabels["before-flight"] },
  { value: "at-airport", label: timingLabels["at-airport"] },
  { value: "after-arrival", label: timingLabels["after-arrival"] }
];

export function FilterBar({
  timingFilter,
  setTimingFilter
}: {
  timingFilter: TimingFilter;
  setTimingFilter: (value: TimingFilter) => void;
}) {
  return (
    <div aria-label="When" className="mt-2 min-w-0" role="group">
      <div className="flex min-w-0 gap-1 overflow-x-auto pb-0.5">
          {timingOptions.map((option) => (
            <button
              aria-pressed={timingFilter === option.value}
              className={chipClasses(timingFilter === option.value)}
              key={option.value}
              onClick={() => setTimingFilter(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
      </div>
    </div>
  );
}

function chipClasses(active: boolean) {
  return [
    "min-h-9 shrink-0 whitespace-nowrap rounded px-2.5 text-[11px] font-semibold transition-colors sm:text-xs",
    active
      ? "bg-neutral-900 text-white"
      : "border border-neutral-300 bg-white text-neutral-600 hover:border-neutral-500 hover:text-neutral-900"
  ].join(" ");
}
