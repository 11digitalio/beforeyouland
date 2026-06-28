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
      <div className="grid min-w-0 grid-cols-4 rounded-lg bg-[#E9E9EB] p-0.5">
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
    "min-h-9 min-w-0 whitespace-nowrap rounded-md px-1 text-[10px] font-medium transition sm:text-[12px]",
    active
      ? "bg-white text-[#1D1D1F] shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
      : "text-[#6E6E73] hover:text-[#1D1D1F]"
  ].join(" ");
}
