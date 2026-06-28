import type { ChecklistPriority, ChecklistTiming } from "@/types/checklist";

type BadgeTone = "required" | "recommended" | "optional" | "before-flight" | "at-airport" | "after-arrival";

const toneClasses: Record<BadgeTone, string> = {
  required: "bg-[#FFF0F0] text-[#A33232]",
  recommended: "bg-[#F0F0F2] text-[#5C5C61]",
  optional: "bg-[#F0F0F2] text-[#6E6E73]",
  "before-flight": "bg-[#EEF5FF] text-[#1261A6]",
  "at-airport": "bg-[#F0F0F2] text-[#5C5C61]",
  "after-arrival": "bg-[#F0F0F2] text-[#5C5C61]"
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
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[12px] font-medium leading-4 ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}
