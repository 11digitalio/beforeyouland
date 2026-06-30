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
import { IconTile } from "@/components/IconTile";
import { getCategoryVisual } from "@/components/categoryIcons";
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
  const visual = getCategoryVisual(category.title);
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

  if (sectionCollapseReady) {
    return (
      <section aria-labelledby={category.id}>
        <button
          aria-expanded={showCompletedSection}
          className="flex min-h-11 w-full items-center gap-2 rounded-lg border border-black/5 bg-paper px-2.5 py-1.5 text-left transition-colors hover:bg-white"
          onClick={() => setShowCompletedSection((current) => !current)}
          type="button"
        >
          <IconTile className="shadow-none" icon={visual.icon} size="sm" tone={visual.tone} />
          <span className="min-w-0 flex-1 truncate text-sm font-black text-ink" id={category.id}>
            {category.title}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-pine">
            <Check aria-hidden="true" size={14} weight="bold" />
            Complete
          </span>
          {showCompletedSection ? (
            <CaretUp aria-hidden="true" className="shrink-0 text-slate-500" size={15} weight="bold" />
          ) : (
            <CaretDown aria-hidden="true" className="shrink-0 text-slate-500" size={15} weight="bold" />
          )}
        </button>
        {showCompletedSection ? (
          <div className="mt-2 grid min-w-0 gap-2 overflow-x-clip">
            {sortedItems.map((item) => (
              <ChecklistItemCard
                collapsing={false}
                completed
                draggingActive={false}
                item={item}
                key={item.id}
                onCollapseComplete={onCollapseComplete}
                onToggle={onToggle}
                reorderMode={false}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section aria-labelledby={category.id}>
      <div className="mb-2 flex items-start gap-2">
          <IconTile className="shadow-none" icon={visual.icon} size="sm" tone={visual.tone} />
          <div className="min-w-0">
            <h2 className="text-[17px] font-black leading-5 tracking-normal text-ink sm:text-lg sm:leading-6" id={category.id}>
              {category.title} <span className="text-sm font-bold text-slate-500">· {completedCount}/{items.length}</span>
            </h2>
            <p className="mt-0.5 hidden max-w-2xl text-sm leading-5 text-slate-600 sm:block">{category.summary}</p>
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
