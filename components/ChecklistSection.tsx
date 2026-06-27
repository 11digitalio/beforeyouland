import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { ChecklistItemCard } from "@/components/ChecklistItemCard";
import { IconTile } from "@/components/IconTile";
import { getCategoryVisual } from "@/components/categoryIcons";
import type { ChecklistCategoryDefinition, ChecklistItem } from "@/types/checklist";

export function ChecklistSection({
  category,
  items,
  completedIds,
  settlingIds,
  reducedMotion,
  onReorder,
  onToggle
}: {
  category: ChecklistCategoryDefinition;
  items: ChecklistItem[];
  completedIds: Set<string>;
  settlingIds: Set<string>;
  reducedMotion: boolean;
  onReorder: (category: string, visibleIncompleteIds: string[]) => void;
  onToggle: (id: string) => void;
}) {
  const completedCount = items.filter((item) => completedIds.has(item.id)).length;
  const sortedItems = [...items].sort(
    (a, b) =>
      Number(completedIds.has(a.id) && !settlingIds.has(a.id)) -
      Number(completedIds.has(b.id) && !settlingIds.has(b.id))
  );
  const visual = getCategoryVisual(category.title);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;

    const incompleteIds = items
      .filter((item) => !completedIds.has(item.id))
      .map((item) => item.id);
    const oldIndex = incompleteIds.indexOf(String(active.id));
    const newIndex = incompleteIds.indexOf(String(over.id));

    if (oldIndex < 0 || newIndex < 0) return;
    onReorder(category.title, arrayMove(incompleteIds, oldIndex, newIndex));
  }

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

      <DndContext
        collisionDetection={closestCenter}
        id={`checklist-${category.id}`}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={sortedItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid gap-2">
            {sortedItems.map((item) => (
              <ChecklistItemCard
                completed={completedIds.has(item.id)}
                item={item}
                key={item.id}
                onToggle={onToggle}
                reducedMotion={reducedMotion}
                settling={settlingIds.has(item.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
}
