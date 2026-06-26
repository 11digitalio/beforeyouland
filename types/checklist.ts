export type ChecklistPriority = "required" | "recommended" | "optional";

export type ChecklistTiming = "before-flight" | "at-airport" | "after-arrival";

export type ChecklistLink = {
  label: string;
  url: string;
};

export type ChecklistItem = {
  id: string;
  title: string;
  description: string;
  priority: ChecklistPriority;
  timing: ChecklistTiming;
  category: string;
  link?: ChecklistLink;
};

export type ChecklistCategoryDefinition = {
  id: string;
  title: string;
  summary: string;
};
