import type { ChecklistPriority, ChecklistTiming } from "@/types/checklist";

type BadgeTone = "required" | "recommended" | "optional" | "before-flight" | "at-airport" | "after-arrival";

const toneClasses: Record<BadgeTone, string> = {
  required: "border-neutral-400 text-neutral-700",
  recommended: "border-neutral-300 text-neutral-600",
  optional: "border-neutral-200 text-neutral-500",
  "before-flight": "border-neutral-300 text-neutral-600",
  "at-airport": "border-neutral-300 text-neutral-600",
  "after-arrival": "border-neutral-300 text-neutral-600"
};

export const priorityLabels: Record<ChecklistPriority, string> = {
  required: "Must-do",
  recommended: "Helpful",
  optional: "Optional"
};

export const timingLabels: Record<ChecklistTiming, string> = {
  "before-flight": "Before flight",
  "at-airport": "At airport",
  "after-arrival": "After arrival"
};

export function Badge({
  tone,
  children
}: {
  tone: BadgeTone;
  children: React.ReactNode;
}) {
  return (
    <span className={`inline-flex items-center rounded-sm border px-1.5 py-px text-[10px] font-semibold leading-4 ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}
