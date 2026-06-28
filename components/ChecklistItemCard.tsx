"use client";

import { useSortable } from "@dnd-kit/sortable";
import {
  ArrowSquareOut,
  CaretDown,
  CaretUp,
  Check,
  DotsSixVertical
} from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import { Badge, priorityLabels, timingLabels } from "@/components/Badge";
import type { ChecklistItem } from "@/types/checklist";

export function ChecklistItemCard({
  item,
  completed,
  collapsing,
  draggingActive,
  reducedMotion,
  onCollapseComplete,
  onToggle,
  reorderMode
}: {
  item: ChecklistItem;
  completed: boolean;
  collapsing: boolean;
  draggingActive: boolean;
  reducedMotion: boolean;
  onCollapseComplete: (id: string) => void;
  onToggle: (id: string) => void;
  reorderMode: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded((current) => !current);
  const compactCompleted = completed && !collapsing;
  const {
    attributes,
    isDragging,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: item.id,
    disabled: completed || !reorderMode,
    animateLayoutChanges: () => false
  });
  const sortableStyle = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})`
      : undefined,
    transition: reducedMotion || isDragging || !reorderMode ? undefined : transition,
    willChange: isDragging ? "transform" : undefined
  };

  useEffect(() => {
    if (completed) setExpanded(false);
  }, [completed]);

  if (compactCompleted) {
    return (
      <article
        className={[
          "print-card border-b border-[#E5E5EA] bg-white opacity-60 last:border-b-0",
          isDragging ? "opacity-0 !transition-none" : ""
        ].join(" ")}
        ref={setNodeRef}
        style={sortableStyle}
      >
        <button
          aria-label={`Mark ${item.title} incomplete`}
          className="flex min-h-11 w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-[#F9F9F9]"
          onClick={() => onToggle(item.id)}
          type="button"
        >
          <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[#007AFF] text-white">
            <Check aria-hidden="true" size={13} weight="bold" />
          </span>
          <span className="min-w-0 flex-1 text-[15px] font-normal leading-5 text-[#8E8E93] line-through decoration-[#AEAEB2]">
            {item.title}
          </span>
        </button>
      </article>
    );
  }

  return (
    <article
      className={[
        "print-card min-w-0 cursor-pointer border-b border-[#E5E5EA] bg-white px-3 py-2 last:border-b-0",
        expanded && !collapsing ? "max-h-[30rem]" : "max-h-28",
        reducedMotion ? "" : "transition-[opacity,background-color] duration-200 ease-out",
        collapsing ? "completion-collapsing" : draggingActive ? "" : "hover:bg-[#FAFAFA]",
        isDragging ? "opacity-0 !transition-none" : ""
      ].join(" ")}
      onTransitionEnd={(event) => {
        if (
          collapsing &&
          event.target === event.currentTarget &&
          event.propertyName === "max-height"
        ) {
          onCollapseComplete(item.id);
        }
      }}
      onClick={toggleExpanded}
      ref={setNodeRef}
      style={sortableStyle}
    >
      <div className="flex gap-3">
        <div className="relative size-[22px] shrink-0">
          <button
            aria-label={completed ? `Mark ${item.title} incomplete` : `Mark ${item.title} complete`}
            className={[
              "check-control no-print absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg",
              reducedMotion ? "" : "transition-colors duration-150",
              completed
                ? "is-checked text-white"
                : "text-transparent focus-visible:text-[#007AFF]"
            ].join(" ")}
            onClick={(event) => {
              event.stopPropagation();
              onToggle(item.id);
            }}
            type="button"
          >
            <span
              className={[
                "flex size-[22px] items-center justify-center rounded-full border transition-colors duration-150",
                completed
                  ? "border-[#007AFF] bg-[#007AFF]"
                  : "border-[#AEAEB2] bg-white",
                completed ? "checkmark-reveal" : ""
              ].join(" ")}
            >
              <Check aria-hidden="true" size={completed ? 14 : 11} weight="bold" />
            </span>
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-h-7 items-start gap-1">
            <h3
              className={[
                "min-w-0 flex-1 pt-0.5 text-[16px] font-normal leading-[21px] tracking-[-0.005em] text-[#1D1D1F]",
                completed ? "text-[#8E8E93] line-through decoration-[#AEAEB2]" : ""
              ].join(" ")}
            >
              {item.title}
            </h3>

            {!completed && reorderMode ? (
              <button
                {...attributes}
                {...listeners}
                aria-label={`Reorder ${item.title}`}
                className="no-print -my-2 inline-flex size-11 shrink-0 touch-manipulation cursor-grab items-center justify-center rounded-lg text-[#8E8E93] transition hover:bg-[#F2F2F7] active:cursor-grabbing"
                onClick={(event) => event.stopPropagation()}
                ref={setActivatorNodeRef}
                type="button"
              >
                <DotsSixVertical aria-hidden="true" size={16} weight="bold" />
              </button>
            ) : null}

            <button
              aria-expanded={expanded}
              aria-label={expanded ? `Hide details for ${item.title}` : `Show details for ${item.title}`}
                className="no-print -my-2 -mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-[#8E8E93] transition hover:bg-[#F2F2F7] hover:text-[#3A3A3C]"
              onClick={(event) => {
                event.stopPropagation();
                toggleExpanded();
              }}
              type="button"
            >
              {expanded ? (
                <CaretUp aria-hidden="true" size={12} />
              ) : (
                <CaretDown aria-hidden="true" size={12} />
              )}
            </button>
          </div>

          <div className="mt-1 flex flex-wrap gap-1">
            <Badge tone={item.priority}>{priorityLabels[item.priority]}</Badge>
            <Badge tone={item.timing}>{timingLabels[item.timing]}</Badge>
          </div>

          <div className={expanded ? "mt-2 border-t border-[#E5E5EA] pt-2 block" : "hidden print:block"}>
            <p className="text-[14px] leading-5 text-[#6E6E73]">{item.description}</p>
            {item.link ? (
              <a
                className="no-print mt-2 inline-flex min-h-9 max-w-full items-center gap-1 rounded-md bg-[#EEF5FF] px-2.5 text-[13px] font-medium text-[#007AFF] transition hover:bg-[#E2EFFF]"
                href={item.link.url}
                onClick={(event) => event.stopPropagation()}
                rel="noreferrer"
                target="_blank"
              >
                <ArrowSquareOut aria-hidden="true" className="shrink-0" size={12} />
                <span className="truncate">{item.link.label}</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export function ChecklistDragPreview({ item }: { item: ChecklistItem }) {
  return (
    <div className="pointer-events-none flex h-[4.75rem] w-72 max-w-[calc(100vw-2rem)] items-start gap-2.5 overflow-hidden rounded-[10px] border border-[#D1D1D6] bg-white px-3 py-2.5 shadow-[0_5px_18px_rgba(0,0,0,0.12)]">
      <span className="mt-0.5 flex size-[22px] shrink-0 items-center justify-center rounded-full border border-[#AEAEB2] bg-white text-transparent">
        <Check aria-hidden="true" size={14} weight="bold" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="max-h-10 overflow-hidden text-[15px] font-medium leading-5 text-[#1D1D1F]">
          {item.title}
        </p>
        <div className="mt-1 flex gap-1.5">
          <Badge tone={item.priority}>{priorityLabels[item.priority]}</Badge>
          <Badge tone={item.timing}>{timingLabels[item.timing]}</Badge>
        </div>
      </div>
      <span className="flex size-8 shrink-0 items-center justify-center text-[#8E8E93]">
        <DotsSixVertical aria-hidden="true" size={18} weight="bold" />
      </span>
    </div>
  );
}
