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
  onToggle
}: {
  item: ChecklistItem;
  completed: boolean;
  collapsing: boolean;
  draggingActive: boolean;
  reducedMotion: boolean;
  onCollapseComplete: (id: string) => void;
  onToggle: (id: string) => void;
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
    disabled: completed,
    animateLayoutChanges: () => !reducedMotion
  });
  const sortableStyle = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})`
      : undefined,
    transition: reducedMotion || isDragging ? undefined : transition,
    willChange: isDragging ? "transform" : undefined
  };

  useEffect(() => {
    if (completed) setExpanded(false);
  }, [completed]);

  if (compactCompleted) {
    return (
      <article
        className={[
          "print-card rounded-[1.15rem] bg-paper opacity-60 shadow-card",
          reducedMotion ? "" : "transition-[transform,opacity,box-shadow] duration-300 ease-out",
          isDragging ? "opacity-0 !transition-none" : ""
        ].join(" ")}
        ref={setNodeRef}
        style={sortableStyle}
      >
        <button
          aria-label={`Mark ${item.title} incomplete`}
          className="flex min-h-12 w-full items-center gap-2.5 rounded-[1.15rem] px-3 py-2 text-left transition hover:bg-greenSoft/50 active:bg-greenSoft"
          onClick={() => onToggle(item.id)}
          type="button"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-pine text-white shadow-tile">
            <Check aria-hidden="true" size={16} weight="bold" />
          </span>
          <span className="min-w-0 flex-1 text-sm font-black leading-5 text-slate-500 line-through decoration-slate-400 decoration-2">
            {item.title}
          </span>
        </button>
      </article>
    );
  }

  return (
    <article
      className={[
        "print-card min-w-0 cursor-pointer rounded-[1.35rem] bg-paper p-3 shadow-card sm:p-3.5",
        reducedMotion ? "" : "transition-[opacity,box-shadow,background-color] duration-200 ease-out",
        collapsing ? "completion-collapsing" : draggingActive ? "" : "hover:shadow-soft",
        isDragging ? "opacity-0 !transition-none" : ""
      ].join(" ")}
      onAnimationEnd={(event) => {
        if (
          collapsing &&
          event.target === event.currentTarget &&
          event.animationName === "completion-collapse"
        ) {
          onCollapseComplete(item.id);
        }
      }}
      onClick={toggleExpanded}
      ref={setNodeRef}
      style={sortableStyle}
    >
      <div className="flex gap-2.5">
        <div className="relative mt-0.5 size-8 shrink-0">
          <button
            aria-label={completed ? `Mark ${item.title} incomplete` : `Mark ${item.title} complete`}
            className={[
              "check-control no-print flex size-8 items-center justify-center rounded-2xl border-2 active:scale-95",
              reducedMotion ? "" : "transition-[transform,background-color,border-color,color] duration-200",
              completed
                ? "is-checked border-pine bg-pine text-white shadow-tile"
                : "border-black/10 bg-linen/80 text-transparent hover:border-pine/35 hover:bg-greenSoft focus-visible:text-pine"
            ].join(" ")}
            onClick={(event) => {
              event.stopPropagation();
              onToggle(item.id);
            }}
            type="button"
          >
            <span className={completed ? "checkmark-reveal" : ""}>
              <Check aria-hidden="true" size={completed ? 18 : 14} weight="bold" />
            </span>
          </button>
          {collapsing ? (
            <span aria-hidden="true" className="completion-particles">
              {Array.from({ length: 6 }, (_, index) => (
                <span key={index} />
              ))}
            </span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <h3
              className={[
                "min-w-0 flex-1 text-[0.95rem] font-black leading-5 tracking-normal text-ink sm:text-base",
                completed ? "text-slate-500 line-through decoration-slate-400 decoration-2" : ""
              ].join(" ")}
            >
              {item.title}
            </h3>

            {!completed ? (
              <button
                {...attributes}
                {...listeners}
                aria-label={`Reorder ${item.title}`}
                className="no-print -mt-1 inline-flex size-8 shrink-0 touch-manipulation cursor-grab items-center justify-center rounded-2xl bg-linen text-slate-500 transition hover:bg-blueSoft hover:text-blueInk active:cursor-grabbing active:scale-95"
                onClick={(event) => event.stopPropagation()}
                ref={setActivatorNodeRef}
                type="button"
              >
                <DotsSixVertical aria-hidden="true" size={18} weight="bold" />
              </button>
            ) : null}

            <button
              aria-expanded={expanded}
              aria-label={expanded ? `Hide details for ${item.title}` : `Show details for ${item.title}`}
              className="no-print -mr-1 -mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-2xl bg-linen text-slate-500 transition hover:bg-greenSoft hover:text-pine active:scale-95"
              onClick={(event) => {
                event.stopPropagation();
                toggleExpanded();
              }}
              type="button"
            >
              {expanded ? (
                <CaretUp aria-hidden="true" size={17} weight="bold" />
              ) : (
                <CaretDown aria-hidden="true" size={17} weight="bold" />
              )}
            </button>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge tone={item.priority}>{priorityLabels[item.priority]}</Badge>
            <Badge tone={item.timing}>{timingLabels[item.timing]}</Badge>
            {item.link ? (
              <a
                className="no-print inline-flex max-w-full items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[11px] font-black text-white shadow-tile transition hover:bg-soot"
                href={item.link.url}
                onClick={(event) => event.stopPropagation()}
                rel="noreferrer"
                target="_blank"
              >
                <ArrowSquareOut aria-hidden="true" className="shrink-0" size={13} weight="bold" />
                <span className="truncate">{item.link.label}</span>
              </a>
            ) : null}
          </div>

          <div className={expanded ? "mt-2.5 block" : "hidden print:block"}>
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
