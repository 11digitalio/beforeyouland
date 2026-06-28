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
import { CaretDown, Check } from "@phosphor-icons/react/dist/ssr";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChecklistDragPreview, ChecklistItemCard } from "@/components/ChecklistItemCard";
import type { ChecklistCategoryDefinition, ChecklistItem } from "@/types/checklist";

export function ChecklistSection({
  category,
  items,
  allItemsComplete,
  completedIds,
  collapsingIds,
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
  reducedMotion: boolean;
  onCollapseComplete: (id: string) => void;
  onReorder: (category: string, visibleIncompleteIds: string[]) => void;
  onToggle: (id: string) => void;
  reorderMode: boolean;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showCompletedSection, setShowCompletedSection] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
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
    if (!allItemsComplete) setShowCompletedSection(false);
  }, [allItemsComplete]);

  if (sectionCollapseReady && !showCompletedSection) {
    return (
      <section aria-labelledby={category.id}>
        <button
          aria-expanded="false"
          className="flex min-h-11 w-full items-center gap-2 rounded-[10px] border border-[#E5E5EA] bg-white px-3 py-2 text-left transition-colors hover:bg-[#FAFAFA]"
          onClick={() => setShowCompletedSection(true)}
          type="button"
        >
          <span className="min-w-0 flex-1 truncate text-[16px] font-semibold text-[#1D1D1F]" id={category.id}>
            {category.title}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-medium text-[#007AFF]">
            <Check aria-hidden="true" size={14} />
            Complete
          </span>
          <CaretDown aria-hidden="true" className="shrink-0 text-[#8E8E93]" size={13} />
        </button>
      </section>
    );
  }

  return (
    <section aria-labelledby={category.id}>
      <div className="mb-2 px-1">
          <div className="min-w-0">
            <h2 className="text-[21px] font-semibold leading-6 tracking-[-0.01em] text-[#1D1D1F]" id={category.id}>
              {category.title} <span className="text-[13px] font-normal text-[#8E8E93]">{completedCount}/{items.length}</span>
            </h2>
            <p className="mt-0.5 hidden max-w-2xl text-[13px] leading-[18px] text-[#6E6E73] sm:block">{category.summary}</p>
          </div>
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
          <div className="min-w-0 overflow-x-clip rounded-[11px] border border-[#E5E5EA] bg-white" ref={listRef}>
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
    </section>
  );
}
