import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type Modifier
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { useCallback, useRef, useState } from "react";
import { ChecklistDragPreview, ChecklistItemCard } from "@/components/ChecklistItemCard";
import { IconTile } from "@/components/IconTile";
import { getCategoryVisual } from "@/components/categoryIcons";
import type { ChecklistCategoryDefinition, ChecklistItem } from "@/types/checklist";

export function ChecklistSection({
  category,
  items,
  completedIds,
  collapsingIds,
  reducedMotion,
  onCollapseComplete,
  onReorder,
  onToggle
}: {
  category: ChecklistCategoryDefinition;
  items: ChecklistItem[];
  completedIds: Set<string>;
  collapsingIds: Set<string>;
  reducedMotion: boolean;
  onCollapseComplete: (id: string) => void;
  onReorder: (category: string, visibleIncompleteIds: string[]) => void;
  onToggle: (id: string) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const completedCount = items.filter((item) => completedIds.has(item.id)).length;
  const sortedItems = [...items].sort(
    (a, b) =>
      Number(completedIds.has(a.id) && !collapsingIds.has(a.id)) -
      Number(completedIds.has(b.id) && !collapsingIds.has(b.id))
  );
  const activeItem = activeId ? items.find((item) => item.id === activeId) : undefined;
  const visual = getCategoryVisual(category.title);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const restrictToVerticalList = useCallback<Modifier>(
    ({ draggingNodeRect, overlayNodeRect, transform }) => {
      const listRect = listRef.current?.getBoundingClientRect();
      const activeRect = overlayNodeRect || draggingNodeRect;
      if (!listRect || !activeRect) return { ...transform, x: 0 };

      const minimumY = listRect.top - activeRect.top;
      const maximumY = listRect.bottom - activeRect.bottom;
      return {
        ...transform,
        x: 0,
        y: Math.min(maximumY, Math.max(minimumY, transform.y))
      };
    },
    []
  );

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(String(active.id));
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
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
        modifiers={[restrictToVerticalList]}
        onDragCancel={() => setActiveId(null)}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
        <SortableContext
          items={sortedItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid min-w-0 gap-2 overflow-x-clip" ref={listRef}>
            {sortedItems.map((item) => (
              <ChecklistItemCard
                collapsing={collapsingIds.has(item.id)}
                completed={completedIds.has(item.id)}
                draggingActive={activeId !== null}
                item={item}
                key={item.id}
                onCollapseComplete={onCollapseComplete}
                onToggle={onToggle}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay
          adjustScale={false}
          dropAnimation={null}
          modifiers={[restrictToVerticalList]}
          zIndex={60}
        >
          {activeItem ? <ChecklistDragPreview item={activeItem} /> : null}
        </DragOverlay>
      </DndContext>
    </section>
  );
}
