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
import { priorityLabels, timingLabels } from "@/components/Badge";
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
          "print-card border-b border-black/[0.14] last:border-b-0",
          isDragging ? "opacity-0 !transition-none" : ""
        ].join(" ")}
        ref={setNodeRef}
        style={sortableStyle}
      >
        <button
          aria-label={`Mark ${item.title} incomplete`}
          className="flex min-h-11 w-full items-center gap-2.5 py-1.5 text-left"
          onClick={() => onToggle(item.id)}
          type="button"
        >
          <span className="flex size-4 shrink-0 items-center justify-center bg-[#f05a28] text-[#edebe6]">
            <Check aria-hidden="true" size={10} weight="bold" />
          </span>
          <span className="min-w-0 flex-1 text-[15px] font-medium leading-5 text-[#77736c] line-through decoration-[#f05a28] decoration-[1.5px]">
            {item.title}
          </span>
        </button>
      </article>
    );
  }

  return (
    <article
      className={[
        "print-card min-w-0 cursor-pointer border-b border-black/[0.14] last:border-b-0",
        expanded && !collapsing ? "max-h-[32rem]" : "max-h-32",
        reducedMotion ? "" : "transition-[opacity,color] duration-150 ease-out",
        collapsing ? "completion-collapsing" : draggingActive ? "" : "",
        isDragging ? "opacity-0 !transition-none" : ""
      ].join(" ")}
      onClick={toggleExpanded}
      ref={setNodeRef}
      style={sortableStyle}
    >
      <div className="flex min-h-11 gap-2.5 py-1.5">
        <div className="relative mt-0.5 size-4 shrink-0">
          <button
            aria-label={completed ? `Mark ${item.title} incomplete` : `Mark ${item.title} complete`}
            className={[
              "check-control no-print absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center",
              reducedMotion ? "" : "transition-colors duration-150",
              completed
                ? "is-checked text-[#edebe6]"
                : "text-transparent focus-visible:text-[#2b2b2b]"
            ].join(" ")}
            onClick={(event) => {
              event.stopPropagation();
              onToggle(item.id);
            }}
            type="button"
          >
            <span
              className={[
                "flex size-4 items-center justify-center border transition-colors duration-150",
                completed
                  ? "border-[#f05a28] bg-[#f05a28]"
                  : "border-[#77736c] bg-transparent group-hover:border-[#2b2b2b]",
                completed ? "checkmark-reveal" : ""
              ].join(" ")}
            >
              <Check aria-hidden="true" size={10} weight="bold" />
            </span>
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <h3
              className={[
                "min-w-0 flex-1 text-[15px] font-medium leading-5 tracking-[-0.01em] text-[#2b2b2b] sm:text-base",
                completed
                  ? "text-[#77736c] line-through decoration-[#f05a28] decoration-[1.5px]"
                  : ""
              ].join(" ")}
            >
              {item.title}
            </h3>

            {!completed && reorderMode ? (
              <button
                {...attributes}
                {...listeners}
                aria-label={`Reorder ${item.title}`}
                className="no-print -m-2 inline-flex size-11 shrink-0 touch-manipulation cursor-grab items-center justify-center text-[#77736c] transition-colors hover:text-[#f05a28] active:cursor-grabbing"
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
              className="no-print -m-2 ml-0 inline-flex size-11 shrink-0 items-center justify-center text-[#77736c] transition-colors hover:text-[#f05a28]"
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

          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.07em] text-[#77736c]">
            <span>{priorityLabels[item.priority]}</span>
            <span aria-hidden="true" className="text-black/30">/</span>
            <span>{timingLabels[item.timing]}</span>
          </div>

          <div className={expanded ? "mt-2 block pb-2 pr-3" : "hidden print:block"}>
            <p className="max-w-2xl text-[13px] leading-[1.45] text-[#77736c]">{item.description}</p>
            {item.link ? (
              <a
                className="no-print mt-1.5 inline-flex min-h-8 max-w-full items-center gap-1 text-[12px] font-semibold text-[#2b2b2b] underline decoration-black/40 underline-offset-2 transition-colors hover:text-[#f05a28]"
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
    <div className="pointer-events-none flex min-h-14 w-72 max-w-[calc(100vw-2rem)] items-start gap-2.5 overflow-hidden border border-black/30 bg-[#edebe6] px-3 py-2">
      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center border border-[#77736c] text-transparent">
        <Check aria-hidden="true" size={10} weight="bold" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="max-h-10 overflow-hidden text-[15px] font-medium leading-5 text-[#2b2b2b]">
          {item.title}
        </p>
        <div className="mt-0.5 flex gap-1.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#77736c]">
          <span>{priorityLabels[item.priority]}</span>
          <span aria-hidden="true">/</span>
          <span>{timingLabels[item.timing]}</span>
        </div>
      </div>
      <span className="flex size-8 shrink-0 items-center justify-center text-[#77736c]">
        <DotsSixVertical aria-hidden="true" size={16} weight="bold" />
      </span>
    </div>
  );
}
