import { ChecklistItemCard } from "@/components/ChecklistItemCard";
import { IconTile } from "@/components/IconTile";
import { getCategoryVisual } from "@/components/categoryIcons";
import type { ChecklistCategoryDefinition, ChecklistItem } from "@/types/checklist";

export function ChecklistSection({
  category,
  items,
  completedIds,
  onToggle
}: {
  category: ChecklistCategoryDefinition;
  items: ChecklistItem[];
  completedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  const completedCount = items.filter((item) => completedIds.has(item.id)).length;
  const sortedItems = [...items].sort((a, b) => Number(completedIds.has(a.id)) - Number(completedIds.has(b.id)));
  const visual = getCategoryVisual(category.title);

  return (
    <section aria-labelledby={category.id}>
      <div className="mb-2.5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <IconTile icon={visual.icon} tone={visual.tone} />
          <div>
            <h2 className="text-2xl font-black tracking-normal text-ink" id={category.id}>
              {category.title}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-600">{category.summary}</p>
          </div>
        </div>
        <p className="text-sm font-black text-slate-500">
          {completedCount}/{items.length} done
        </p>
      </div>

      <div className="grid gap-2">
        {sortedItems.map((item) => (
          <ChecklistItemCard
            completed={completedIds.has(item.id)}
            item={item}
            key={item.id}
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  );
}
