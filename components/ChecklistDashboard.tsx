"use client";

import { ArrowCounterClockwise, CaretDown, ShareFat, SquaresFour } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useMemo, useState } from "react";
import { ChecklistSection } from "@/components/ChecklistSection";
import { FilterBar } from "@/components/FilterBar";
import { IconTile } from "@/components/IconTile";
import { ProgressBar } from "@/components/ProgressBar";
import { getCategoryVisual } from "@/components/categoryIcons";
import { trackEvent } from "@/lib/analytics";
import type {
  ChecklistCategoryDefinition,
  ChecklistItem,
  ChecklistTiming
} from "@/types/checklist";

const STORAGE_KEY = "before-you-land:tokyo:completed-items";

type TimingFilter = ChecklistTiming | "all";

export function ChecklistDashboard({
  categories,
  items
}: {
  categories: ChecklistCategoryDefinition[];
  items: ChecklistItem[];
}) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [timingFilter, setTimingFilter] = useState<TimingFilter>("all");
  const [shareLink, setShareLink] = useState<string>("");
  const [shareStatus, setShareStatus] = useState<string>("");

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage?.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) {
        setCompletedIds(new Set(saved.filter((id): id is string => typeof id === "string")));
      }
    } catch {
      setCompletedIds(new Set());
    }
  }, []);

  const completedCount = useMemo(
    () => items.filter((item) => completedIds.has(item.id)).length,
    [completedIds, items]
  );
  const progress = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const visibleItems = useMemo(
    () =>
      items.filter((item) => {
        const matchesCategory = activeCategory === "all" || item.category === activeCategory;
        const matchesTiming = timingFilter === "all" || item.timing === timingFilter;
        return matchesCategory && matchesTiming;
      }),
    [activeCategory, items, timingFilter]
  );

  const sections = useMemo(
    () =>
      categories
        .map((category) => ({
          category,
          items: visibleItems.filter((item) => item.category === category.title)
        }))
        .filter((section) => section.items.length > 0),
    [categories, visibleItems]
  );

  function toggleItem(id: string) {
    const wasCompleted = completedIds.has(id);
    const next = new Set(completedIds);

    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    setCompletedIds(next);
    try {
      window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
    } catch {
      // Some embedded browser contexts block localStorage; keep the in-page state usable.
    }

    trackEvent(wasCompleted ? "checklist_item_uncompleted" : "checklist_item_completed", {
      item_id: id,
      destination: "tokyo"
    });
  }

  function resetChecklist() {
    setCompletedIds(new Set());
    try {
      window.localStorage?.removeItem(STORAGE_KEY);
    } catch {
      // Some embedded browser contexts block localStorage; keep the in-page state usable.
    }
    setShareLink("");
    setShareStatus("");
  }

  async function shareChecklist() {
    trackEvent("share_clicked", { destination: "tokyo" });
    const shareData = {
      title: "Tokyo Pre-Landing Checklist",
      text: "Everything to handle before landing in Tokyo.",
      url: window.location.href
    };

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        setShareLink("");
        setShareStatus("");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    if (await writeClipboardText(window.location.href)) {
      setShareLink("");
      setShareStatus("Link copied");
    } else {
      setShareLink(window.location.href);
      setShareStatus("Link ready to copy");
    }
  }

  return (
    <div className="mt-5 min-w-0 lg:mt-7">
      <div className="no-print mb-3 min-w-0 lg:hidden">
        <div className="relative">
          <select
            aria-label="Category"
            className="min-h-12 w-full appearance-none rounded-[1.25rem] border border-black/5 bg-paper py-3 pl-4 pr-11 text-[15px] font-black leading-none text-ink shadow-card outline-none transition focus:border-pine/30 focus:bg-white"
            id="mobile-category-filter"
            onChange={(event) => setActiveCategory(event.target.value)}
            value={activeCategory}
          >
            <option value="all">All categories ({items.length})</option>
            {categories.map((category) => {
              const count = items.filter((item) => item.category === category.title).length;
              return (
                <option className="text-[15px]" key={category.id} value={category.title}>
                  {category.title} ({count})
                </option>
              );
            })}
          </select>
          <CaretDown
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
            size={17}
            weight="bold"
          />
        </div>
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-5">
        <aside className="no-print hidden lg:sticky lg:top-5 lg:block lg:self-start">
          <div className="rounded-[1.75rem] bg-paper p-3 shadow-card">
            <div className="flex items-center gap-2 px-2 py-1">
              <IconTile icon={SquaresFour} size="sm" tone="blue" />
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                Categories
              </p>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <button
                aria-pressed={activeCategory === "all"}
                className={categoryButtonClasses(activeCategory === "all")}
                onClick={() => setActiveCategory("all")}
                type="button"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <IconTile
                    className="shadow-none"
                    icon={SquaresFour}
                    size="sm"
                    tone={activeCategory === "all" ? "cream" : "blue"}
                  />
                  <span className="truncate">All sections</span>
                </span>
                <span>{items.length}</span>
              </button>
              {categories.map((category) => {
                const count = items.filter((item) => item.category === category.title).length;
                const visual = getCategoryVisual(category.title);
                const active = activeCategory === category.title;
                return (
                  <button
                    aria-pressed={active}
                    className={categoryButtonClasses(active)}
                    key={category.id}
                    onClick={() => setActiveCategory(category.title)}
                    type="button"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <IconTile
                        className="shadow-none"
                        icon={visual.icon}
                        size="sm"
                        tone={active ? "cream" : visual.tone}
                      />
                      <span className="truncate">{category.title}</span>
                    </span>
                    <span>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-4">
          <div className="no-print sticky top-2 z-20 max-w-full rounded-[1.35rem] bg-paper/94 p-3 shadow-card backdrop-blur sm:p-4 lg:rounded-[1.5rem]">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-black text-slate-600">
                    {completedCount} of {items.length} completed
                  </p>
                  <p className="shrink-0 text-sm font-black text-pine">{progress}%</p>
                </div>
                <ProgressBar value={progress} />
                <p className="mt-1.5 text-[11px] font-semibold leading-4 text-slate-500">
                  Progress saves automatically on this device.
                </p>
              </div>

              <button
                aria-label="Share this checklist"
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-3 text-sm font-black text-white shadow-tile transition hover:bg-pine"
                onClick={shareChecklist}
                type="button"
              >
                <IconTile className="shadow-none" icon={ShareFat} size="sm" tone="cream" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>

            <FilterBar setTimingFilter={setTimingFilter} timingFilter={timingFilter} />

            {shareStatus ? <p className="mt-2 text-sm font-semibold text-pine">{shareStatus}</p> : null}
            {shareLink ? (
              <input
                className="mt-2 w-full rounded-full border border-black/5 bg-linen px-3 py-2 text-sm font-semibold text-slate-600"
                onFocus={(event) => event.currentTarget.select()}
                readOnly
                value={shareLink}
              />
            ) : null}
          </div>

          {sections.length > 0 ? (
            <div className="print-grid space-y-6">
              {sections.map((section) => (
                <ChecklistSection
                  category={section.category}
                  completedIds={completedIds}
                  items={section.items}
                  key={section.category.id}
                  onToggle={toggleItem}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-paper p-10 text-center shadow-card">
              <h2 className="text-2xl font-black tracking-normal text-ink">No checklist items match.</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
                Adjust the category or timing filters to bring tasks back into view.
              </p>
            </div>
          )}

          <div className="no-print flex justify-end pt-1">
            <button
              className="inline-flex min-h-9 items-center gap-2 rounded-full bg-transparent px-3 text-xs font-black text-slate-500 transition hover:bg-roseSoft hover:text-roseInk"
              onClick={resetChecklist}
              type="button"
            >
              <ArrowCounterClockwise aria-hidden="true" size={15} weight="bold" />
              Reset checklist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function categoryButtonClasses(active: boolean) {
  return [
    "flex min-w-0 items-center justify-between gap-3 rounded-full px-3 py-2.5 text-left text-sm font-black transition",
    active
      ? "bg-ink text-white shadow-tile"
      : "bg-linen/70 text-slate-600 hover:bg-white hover:text-ink"
  ].join(" ");
}

async function writeClipboardText(text: string) {
  if (copyTextWithTextarea(text)) {
    return true;
  }

  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Clipboard API can be blocked in stricter browser contexts.
  }

  return false;
}

function copyTextWithTextarea(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.fontSize = "16px";
  textarea.style.height = "1px";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.width = "1px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, text.length);

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}
