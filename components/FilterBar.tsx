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
    <div aria-label="When" className="mt-2 min-w-0 border-t border-black/5 pt-2.5" role="group">
      <div className="-mx-0.5 max-w-full overflow-x-auto px-0.5 pb-0.5">
        <div className="flex min-w-max gap-1.5">
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
    "min-h-8 shrink-0 rounded-full px-2.5 text-[11px] font-black transition min-[390px]:px-3 min-[390px]:text-xs sm:min-h-9 sm:text-sm",
    active
      ? "bg-ink text-white shadow-tile"
      : "bg-linen text-slate-600 hover:bg-white hover:text-ink"
  ].join(" ");
}
