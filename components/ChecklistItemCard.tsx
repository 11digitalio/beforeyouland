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

  useEffect(() => {
    if (!collapsing) return;
    const timer = window.setTimeout(() => onCollapseComplete(item.id), 180);
    return () => window.clearTimeout(timer);
  }, [collapsing, item.id, onCollapseComplete]);

  if (compactCompleted) {
    return (
      <article
        className={[
          "print-card border-b border-neutral-200 bg-white opacity-55 last:border-b-0",
          isDragging ? "opacity-0 !transition-none" : ""
        ].join(" ")}
        ref={setNodeRef}
        style={sortableStyle}
      >
        <button
          aria-label={`Mark ${item.title} incomplete`}
          className="flex min-h-12 w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-neutral-50 sm:px-4"
          onClick={() => onToggle(item.id)}
          type="button"
        >
          <span className="flex size-[18px] shrink-0 items-center justify-center bg-neutral-900 text-white">
            <Check aria-hidden="true" size={12} weight="bold" />
          </span>
          <span className="min-w-0 flex-1 text-[15px] font-medium leading-5 text-neutral-500 line-through decoration-neutral-400">
            {item.title}
          </span>
        </button>
      </article>
    );
  }

  return (
    <article
      className={[
        "print-card min-w-0 cursor-pointer border-b border-neutral-200 bg-white last:border-b-0",
        expanded && !collapsing ? "max-h-[32rem]" : "max-h-32",
        reducedMotion ? "" : "transition-[opacity,background-color,max-height] duration-150 ease-out",
        collapsing ? "completion-collapsing" : draggingActive ? "" : "hover:bg-neutral-50",
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
      <div className="flex gap-3 px-3 py-2 sm:px-4">
        <div className="relative mt-0.5 size-[18px] shrink-0">
          <button
            aria-label={completed ? `Mark ${item.title} incomplete` : `Mark ${item.title} complete`}
            className={[
              "check-control no-print absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center",
              reducedMotion ? "" : "transition-colors duration-150",
              completed
                ? "is-checked text-white"
                : "text-transparent focus-visible:text-neutral-900"
            ].join(" ")}
            onClick={(event) => {
              event.stopPropagation();
              onToggle(item.id);
            }}
            type="button"
          >
            <span
              className={[
                "flex size-[18px] items-center justify-center border transition-colors duration-150",
                completed
                  ? "border-neutral-900 bg-neutral-900"
                  : "border-neutral-500 bg-white group-hover:border-neutral-900",
                completed ? "checkmark-reveal" : ""
              ].join(" ")}
            >
              <Check aria-hidden="true" size={11} weight="bold" />
            </span>
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <h3
              className={[
                "min-w-0 flex-1 text-[15px] font-semibold leading-5 tracking-[-0.01em] text-neutral-900 sm:text-base",
                completed ? "text-neutral-500 line-through decoration-neutral-400" : ""
              ].join(" ")}
            >
              {item.title}
            </h3>

            {!completed && reorderMode ? (
              <button
                {...attributes}
                {...listeners}
                aria-label={`Reorder ${item.title}`}
                className="no-print -m-2 inline-flex size-11 shrink-0 touch-manipulation cursor-grab items-center justify-center text-neutral-500 transition-colors hover:text-neutral-900 active:cursor-grabbing"
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
              className="no-print -m-2 ml-0 inline-flex size-11 shrink-0 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-900"
              onClick={(event) => {
                event.stopPropagation();
                toggleExpanded();
              }}
              type="button"
            >
              {expanded ? (
                <CaretUp aria-hidden="true" size={14} weight="bold" />
              ) : (
                <CaretDown aria-hidden="true" size={14} weight="bold" />
              )}
            </button>
          </div>

          <div className="mt-1 flex flex-wrap gap-1">
            <Badge tone={item.priority}>{priorityLabels[item.priority]}</Badge>
            <Badge tone={item.timing}>{timingLabels[item.timing]}</Badge>
          </div>

          <div className={expanded ? "mt-2.5 block pb-1" : "hidden print:block"}>
            <p className="text-[13px] leading-5 text-neutral-600">{item.description}</p>
            {item.link ? (
              <a
                className="no-print mt-2 inline-flex min-h-8 max-w-full items-center gap-1.5 border-b border-neutral-400 text-xs font-semibold text-neutral-800 transition-colors hover:border-neutral-900"
                href={item.link.url}
                onClick={(event) => event.stopPropagation()}
                rel="noreferrer"
                target="_blank"
              >
                <span className="truncate">{item.link.label}</span>
                <ArrowSquareOut aria-hidden="true" className="shrink-0" size={12} weight="bold" />
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
    <div className="pointer-events-none flex min-h-16 w-72 max-w-[calc(100vw-2rem)] items-start gap-3 overflow-hidden border border-neutral-300 bg-white px-3 py-2 shadow-lg">
      <span className="mt-0.5 flex size-[18px] shrink-0 items-center justify-center border border-neutral-500 text-transparent">
        <Check aria-hidden="true" size={11} weight="bold" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="max-h-10 overflow-hidden text-[15px] font-semibold leading-5 text-neutral-900">
          {item.title}
        </p>
        <div className="mt-1 flex gap-1.5">
          <Badge tone={item.priority}>{priorityLabels[item.priority]}</Badge>
          <Badge tone={item.timing}>{timingLabels[item.timing]}</Badge>
        </div>
      </div>
      <span className="flex size-8 shrink-0 items-center justify-center text-neutral-600">
        <DotsSixVertical aria-hidden="true" size={16} weight="bold" />
      </span>
    </div>
  );
}
