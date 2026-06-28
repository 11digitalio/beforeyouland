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
    <div aria-label="When" className="mt-1 min-w-0 border-t border-black/5 pt-1" role="group">
      <div className="grid min-w-0 grid-cols-4 gap-1">
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
    "min-h-10 min-w-0 whitespace-nowrap rounded-md px-1 text-[10px] font-bold transition sm:min-h-11 sm:px-2 sm:text-xs",
    active
      ? "bg-ink text-white shadow-tile"
      : "bg-linen text-slate-600 hover:bg-white hover:text-ink"
  ].join(" ");
}
