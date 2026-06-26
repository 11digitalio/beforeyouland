"use client";

import { ArrowSquareOut, CaretDown, CaretUp, Check } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { Badge, priorityLabels, timingLabels } from "@/components/Badge";
import type { ChecklistItem } from "@/types/checklist";

export function ChecklistItemCard({
  item,
  completed,
  onToggle
}: {
  item: ChecklistItem;
  completed: boolean;
  onToggle: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded((current) => !current);

  return (
    <article
      className={[
        "print-card cursor-pointer rounded-[1.35rem] bg-paper p-3 shadow-card transition-all duration-300 ease-out sm:p-3.5",
        completed ? "complete-settle opacity-60" : "hover:-translate-y-0.5 hover:shadow-soft"
      ].join(" ")}
      onClick={toggleExpanded}
    >
      <div className="flex gap-2.5">
        <button
          aria-label={completed ? `Mark ${item.title} incomplete` : `Mark ${item.title} complete`}
          className={[
            "no-print",
            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-2xl border-2 transition active:scale-95",
            completed
              ? "border-pine bg-pine text-white shadow-tile"
              : "border-black/10 bg-linen/80 text-transparent hover:border-pine/35 hover:bg-greenSoft focus-visible:text-pine"
          ].join(" ")}
          onClick={(event) => {
            event.stopPropagation();
            onToggle(item.id);
          }}
          type="button"
        >
          {completed ? <Check aria-hidden="true" size={18} weight="bold" /> : <Check aria-hidden="true" size={14} weight="bold" />}
        </button>

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
