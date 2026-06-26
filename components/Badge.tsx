import type { ChecklistPriority, ChecklistTiming } from "@/types/checklist";

type BadgeTone = "required" | "recommended" | "optional" | "before-flight" | "at-airport" | "after-arrival";

const toneClasses: Record<BadgeTone, string> = {
  required: "bg-roseSoft text-roseInk",
  recommended: "bg-greenSoft text-pine",
  optional: "bg-orangeSoft text-clay",
  "before-flight": "bg-blueSoft text-blueInk",
  "at-airport": "bg-[#eee8db] text-soot",
  "after-arrival": "bg-[#e1f3f1] text-[#0f766e]"
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
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-black ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}
