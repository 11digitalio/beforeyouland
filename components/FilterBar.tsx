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
    <div aria-label="When" className="mt-1.5 min-w-0 border-t border-black/5 pt-1.5" role="group">
      <div className="-mx-0.5 max-w-full overflow-x-auto px-0.5">
        <div className="flex min-w-max gap-1">
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
    </div>
  );
}

function chipClasses(active: boolean) {
  return [
    "min-h-7 shrink-0 rounded-full px-2 text-[10px] font-black transition min-[390px]:px-2.5 min-[390px]:text-[11px] sm:min-h-8 sm:px-3 sm:text-xs",
    active
      ? "bg-ink text-white shadow-tile"
      : "bg-linen text-slate-600 hover:bg-white hover:text-ink"
  ].join(" ");
}
