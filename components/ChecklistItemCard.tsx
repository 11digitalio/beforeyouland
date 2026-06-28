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
          "print-card rounded-lg border border-black/5 bg-paper opacity-60",
          isDragging ? "opacity-0 !transition-none" : ""
        ].join(" ")}
        ref={setNodeRef}
        style={sortableStyle}
      >
        <button
          aria-label={`Mark ${item.title} incomplete`}
          className="flex min-h-11 w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left transition hover:bg-greenSoft/50 active:bg-greenSoft"
          onClick={() => onToggle(item.id)}
          type="button"
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-pine text-white">
            <Check aria-hidden="true" size={14} weight="bold" />
          </span>
          <span className="min-w-0 flex-1 text-sm font-bold leading-[1.2] text-slate-500 line-through decoration-slate-400">
            {item.title}
          </span>
        </button>
      </article>
    );
  }

  return (
    <article
      className={[
        "print-card min-w-0 cursor-pointer rounded-lg border border-black/5 bg-paper p-2.5",
        expanded && !collapsing ? "max-h-[30rem]" : "max-h-28",
        reducedMotion ? "" : "transition-[opacity,box-shadow,background-color] duration-200 ease-out",
        collapsing ? "completion-collapsing" : draggingActive ? "" : "hover:border-black/10 hover:bg-white",
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
      <div className="flex gap-2">
        <div className="relative size-6 shrink-0">
          <button
            aria-label={completed ? `Mark ${item.title} incomplete` : `Mark ${item.title} complete`}
            className={[
              "check-control no-print absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg",
              reducedMotion ? "" : "transition-colors duration-150",
              completed
                ? "is-checked text-white"
                : "text-transparent focus-visible:text-pine"
            ].join(" ")}
            onClick={(event) => {
              event.stopPropagation();
              onToggle(item.id);
            }}
            type="button"
          >
            <span
              className={[
                "flex size-6 items-center justify-center rounded-md border-2 transition-colors duration-150",
                completed
                  ? "border-pine bg-pine shadow-tile"
                  : "border-black/10 bg-linen/80 group-hover:border-pine/35",
                completed ? "checkmark-reveal" : ""
              ].join(" ")}
            >
              <Check aria-hidden="true" size={completed ? 14 : 11} weight="bold" />
            </span>
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <h3
              className={[
                "min-w-0 flex-1 text-base font-black leading-[1.2] tracking-normal text-ink",
                completed ? "text-slate-500 line-through decoration-slate-400 decoration-2" : ""
              ].join(" ")}
            >
              {item.title}
            </h3>

            {!completed && reorderMode ? (
              <button
                {...attributes}
                {...listeners}
                aria-label={`Reorder ${item.title}`}
                className="no-print -m-2 inline-flex size-11 shrink-0 touch-manipulation cursor-grab items-center justify-center rounded-lg text-slate-500 transition hover:bg-blueSoft hover:text-blueInk active:cursor-grabbing active:scale-95"
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
              className="no-print -m-2 ml-0 inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-greenSoft hover:text-pine active:scale-95"
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

          <div className="mt-1.5 flex flex-wrap gap-1">
            <Badge tone={item.priority}>{priorityLabels[item.priority]}</Badge>
            <Badge tone={item.timing}>{timingLabels[item.timing]}</Badge>
            {item.link ? (
              <a
                className="no-print inline-flex min-h-6 max-w-full items-center gap-1 rounded-full bg-ink px-2 text-[10px] font-black text-white transition hover:bg-soot"
                href={item.link.url}
                onClick={(event) => event.stopPropagation()}
                rel="noreferrer"
                target="_blank"
              >
                <ArrowSquareOut aria-hidden="true" className="shrink-0" size={11} weight="bold" />
                <span className="truncate">{item.link.label}</span>
              </a>
            ) : null}
          </div>

          <div className={expanded ? "mt-2 block" : "hidden print:block"}>
            <p className="text-sm leading-5 text-slate-600">{item.description}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ChecklistDragPreview({ item }: { item: ChecklistItem }) {
  return (
    <div className="pointer-events-none flex h-[4.75rem] w-72 max-w-[calc(100vw-2rem)] items-start gap-2.5 overflow-hidden rounded-[1.25rem] border border-pine/10 bg-paper px-3 py-2.5 shadow-soft">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-2xl border-2 border-black/10 bg-linen/80 text-transparent">
        <Check aria-hidden="true" size={14} weight="bold" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="max-h-10 overflow-hidden text-[0.95rem] font-black leading-5 text-ink">
          {item.title}
        </p>
        <div className="mt-1 flex gap-1.5">
          <Badge tone={item.priority}>{priorityLabels[item.priority]}</Badge>
          <Badge tone={item.timing}>{timingLabels[item.timing]}</Badge>
        </div>
      </div>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-2xl bg-blueSoft text-blueInk">
        <DotsSixVertical aria-hidden="true" size={18} weight="bold" />
      </span>
    </div>
  );
}
