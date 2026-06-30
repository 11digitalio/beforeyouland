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
import { CaretDown, CaretUp, Check } from "@phosphor-icons/react/dist/ssr";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChecklistDragPreview, ChecklistItemCard } from "@/components/ChecklistItemCard";
import type { ChecklistCategoryDefinition, ChecklistItem } from "@/types/checklist";

export function ChecklistSection({
  category,
  items,
  allItemsComplete,
  completedIds,
  collapsingIds,
  defaultExpanded,
  reducedMotion,
  onCollapseComplete,
  onReorder,
  onToggle,
  reorderMode
}: {
  category: ChecklistCategoryDefinition;
  items: ChecklistItem[];
  allItemsComplete: boolean;
  completedIds: Set<string>;
  collapsingIds: Set<string>;
  defaultExpanded: boolean;
  reducedMotion: boolean;
  onCollapseComplete: (id: string) => void;
  onReorder: (category: string, visibleIncompleteIds: string[]) => void;
  onToggle: (id: string) => void;
  reorderMode: boolean;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const listRef = useRef<HTMLDivElement>(null);
  const previousAllItemsCompleteRef = useRef(allItemsComplete);
  const completedCount = items.filter((item) => completedIds.has(item.id)).length;
  const sortedItems = [...items].sort(
    (a, b) =>
      Number(completedIds.has(a.id) && !collapsingIds.has(a.id)) -
      Number(completedIds.has(b.id) && !collapsingIds.has(b.id))
  );
  const activeItem = activeId ? items.find((item) => item.id === activeId) : undefined;
  const sectionCollapseReady =
    allItemsComplete && !items.some((item) => collapsingIds.has(item.id));
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

  useEffect(() => {
    if (sectionCollapseReady) setExpanded(false);
    if (previousAllItemsCompleteRef.current && !allItemsComplete) setExpanded(true);
    previousAllItemsCompleteRef.current = allItemsComplete;
  }, [allItemsComplete, sectionCollapseReady]);

  return (
    <section aria-labelledby={category.id} className="border-t border-black/[0.22]">
      <button
        aria-expanded={expanded}
        className="group flex min-h-[5.5rem] w-full items-center gap-3 py-4 text-left transition-colors hover:text-[#f05a28] sm:min-h-24 sm:py-5"
        onClick={() => setExpanded((current) => !current)}
        type="button"
      >
        <span className="min-w-0 flex-1">
          <span
            className="tokyo-condensed-title block text-[29px] uppercase leading-[0.95] text-[#2b2b2b] transition-colors group-hover:text-[#f05a28] min-[380px]:text-[32px] sm:text-[38px]"
            id={category.id}
          >
            {category.title}
          </span>
          <span className="mt-1.5 block text-[10px] font-bold uppercase tracking-[0.1em] text-[#77736c]">
            {completedCount}/{items.length} complete
          </span>
        </span>
        {allItemsComplete ? (
          <span className="inline-flex shrink-0 items-center gap-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#f05a28]">
            <Check aria-hidden="true" size={11} weight="bold" />
            Complete
          </span>
        ) : null}
        {expanded ? (
          <CaretUp aria-hidden="true" className="shrink-0 text-[#77736c]" size={15} weight="bold" />
        ) : (
          <CaretDown aria-hidden="true" className="shrink-0 text-[#77736c]" size={15} weight="bold" />
        )}
      </button>

      {expanded ? (
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
            <div className="min-w-0 overflow-x-clip border-t border-black/[0.22]" ref={listRef}>
              {sortedItems.map((item) => (
                <ChecklistItemCard
                  collapsing={collapsingIds.has(item.id)}
                  completed={completedIds.has(item.id)}
                  draggingActive={activeId !== null}
                  item={item}
                  key={item.id}
                  onCollapseComplete={onCollapseComplete}
                  onToggle={onToggle}
                  reorderMode={reorderMode}
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
      ) : null}
    </section>
  );
}
