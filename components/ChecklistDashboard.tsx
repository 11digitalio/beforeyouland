"use client";

import { ArrowCounterClockwise, CaretDown, ShareFat, SquaresFour } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useMemo, useRef, useState } from "react";
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
const ORDER_STORAGE_KEY = "before-you-land:tokyo:item-order:v1";
const MILESTONES = [25, 50, 75, 100];
const FEEDBACK_FORM_URL = "";

type TimingFilter = ChecklistTiming | "all";
type ItemOrder = Record<string, string[]>;

export function ChecklistDashboard({
  categories,
  items
}: {
  categories: ChecklistCategoryDefinition[];
  items: ChecklistItem[];
}) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [collapsingIds, setCollapsingIds] = useState<Set<string>>(new Set());
  const [itemOrder, setItemOrder] = useState<ItemOrder>(() => createDefaultOrder(categories, items));
  const [milestone, setMilestone] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [timingFilter, setTimingFilter] = useState<TimingFilter>("all");
  const [reorderMode, setReorderMode] = useState(false);
  const [shareLink, setShareLink] = useState<string>("");
  const [shareStatus, setShareStatus] = useState<string>("");
  const completedIdsRef = useRef<Set<string>>(new Set());
  const itemOrderRef = useRef<ItemOrder>(itemOrder);
  const milestoneTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage?.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) {
        const nextCompletedIds = new Set(
          saved.filter((id): id is string => typeof id === "string")
        );
        completedIdsRef.current = nextCompletedIds;
        setCompletedIds(nextCompletedIds);
      }
    } catch {
      completedIdsRef.current = new Set();
      setCompletedIds(new Set());
    }

    try {
      const savedOrder = JSON.parse(window.localStorage?.getItem(ORDER_STORAGE_KEY) || "{}");
      const nextOrder = reconcileOrder(savedOrder, categories, items);
      itemOrderRef.current = nextOrder;
      setItemOrder(nextOrder);
    } catch {
      const nextOrder = createDefaultOrder(categories, items);
      itemOrderRef.current = nextOrder;
      setItemOrder(nextOrder);
    }
  }, [categories, items]);

  useEffect(
    () => () => {
      if (milestoneTimerRef.current) clearTimeout(milestoneTimerRef.current);
    },
    []
  );

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
        .map((category) => {
          const orderIndex = new Map(
            (itemOrder[category.title] || []).map((id, index) => [id, index])
          );
          return {
            category,
            items: visibleItems
              .filter((item) => item.category === category.title)
              .sort(
                (a, b) =>
                  (orderIndex.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
                  (orderIndex.get(b.id) ?? Number.MAX_SAFE_INTEGER)
              )
          };
        })
        .filter((section) => section.items.length > 0),
    [categories, itemOrder, visibleItems]
  );

  function toggleItem(id: string) {
    const current = completedIdsRef.current;
    const wasCompleted = current.has(id);
    const next = new Set(current);

    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    completedIdsRef.current = next;
    setCompletedIds(next);
    persistCompletedIds(next);

    if (wasCompleted || reducedMotion) {
      setCollapsingIds((currentIds) => {
        if (!currentIds.has(id)) return currentIds;
        const nextIds = new Set(currentIds);
        nextIds.delete(id);
        return nextIds;
      });
    } else {
      setCollapsingIds((currentIds) => new Set(currentIds).add(id));
    }

    if (!wasCompleted) {
      const beforeProgress = items.length > 0 ? (countCompleted(items, current) / items.length) * 100 : 0;
      const afterProgress = items.length > 0 ? (countCompleted(items, next) / items.length) * 100 : 0;
      const crossedMilestone = MILESTONES.find(
        (value) => beforeProgress < value && afterProgress >= value
      );
      if (crossedMilestone) showMilestone(crossedMilestone);
    }

    trackEvent(wasCompleted ? "checklist_item_uncompleted" : "checklist_item_completed", {
      item_id: id,
      destination: "tokyo"
    });
  }

  function resetChecklist() {
    completedIdsRef.current = new Set();
    setCompletedIds(new Set());
    setCollapsingIds(new Set());
    setMilestone(null);
    if (milestoneTimerRef.current) clearTimeout(milestoneTimerRef.current);
    try {
      window.localStorage?.removeItem(STORAGE_KEY);
    } catch {
      // Some embedded browser contexts block localStorage; keep the in-page state usable.
    }
    setShareLink("");
    setShareStatus("");
  }

  function finishCollapse(id: string) {
    setCollapsingIds((currentIds) => {
      if (!currentIds.has(id)) return currentIds;
      const nextIds = new Set(currentIds);
      nextIds.delete(id);
      return nextIds;
    });
  }

  function showMilestone(value: number) {
    if (milestoneTimerRef.current) clearTimeout(milestoneTimerRef.current);
    setMilestone(value);
    milestoneTimerRef.current = setTimeout(() => {
      setMilestone(null);
      milestoneTimerRef.current = null;
    }, 1400);
  }

  function reorderVisibleItems(category: string, visibleIncompleteIds: string[]) {
    const current = itemOrderRef.current;
    const fullCategoryOrder =
      current[category] ||
      items.filter((item) => item.category === category).map((item) => item.id);
    const visibleIds = new Set(visibleIncompleteIds);
    let visibleIndex = 0;
    const nextCategoryOrder = fullCategoryOrder.map((id) =>
      visibleIds.has(id) ? visibleIncompleteIds[visibleIndex++] : id
    );
    const nextOrder = { ...current, [category]: nextCategoryOrder };

    itemOrderRef.current = nextOrder;
    setItemOrder(nextOrder);
    try {
      window.localStorage?.setItem(ORDER_STORAGE_KEY, JSON.stringify(nextOrder));
    } catch {
      // Some embedded browser contexts block localStorage; keep the in-page order usable.
    }
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
    <div className="mt-3 min-w-0 lg:mt-6">
      <div className="no-print mb-2.5 flex min-w-0 items-center gap-2 lg:mb-3">
        <div className="relative min-w-0 flex-1 lg:hidden">
          <select
            aria-label="Category"
            className="min-h-11 w-full appearance-none rounded-lg border border-black/10 bg-paper py-2 pl-3 pr-9 text-sm font-bold leading-none text-ink outline-none transition focus:border-pine/30 focus:bg-white"
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
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={15}
            weight="bold"
          />
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <button
            aria-pressed={reorderMode}
            className={[
              "inline-flex min-h-11 items-center justify-center rounded-lg px-2.5 text-xs font-bold transition",
              reorderMode
                ? "bg-blueSoft text-blueInk"
                : "border border-black/10 bg-paper text-slate-600 hover:bg-linen"
            ].join(" ")}
            onClick={() => setReorderMode((current) => !current)}
            type="button"
          >
            Reorder
          </button>
          <button
            aria-label="Share this checklist"
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-ink px-2.5 text-xs font-bold text-white transition hover:bg-pine"
            onClick={shareChecklist}
            type="button"
          >
            <ShareFat aria-hidden="true" size={15} weight="bold" />
            <span className="hidden min-[360px]:inline">Share</span>
          </button>
        </div>
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-5">
        <aside className="no-print hidden lg:sticky lg:top-5 lg:block lg:self-start">
          <div className="rounded-xl border border-black/5 bg-paper p-2">
            <div className="flex items-center gap-2 px-2 py-1">
              <IconTile icon={SquaresFour} size="sm" tone="blue" />
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                Categories
              </p>
            </div>
            <div className="mt-2 flex flex-col gap-1">
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

        <div className="min-w-0 space-y-3">
          <div className="no-print sticky top-2 z-40 isolate max-w-full rounded-xl border border-black/10 bg-paper/95 px-2.5 py-2 shadow-tile backdrop-blur-md sm:top-3 sm:px-3">
            <div className="min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-xs font-bold text-slate-600 sm:text-sm">
                    {completedCount} of {items.length} completed
                  </p>
                  <p
                    className={[
                      "shrink-0 text-xs font-black text-pine sm:text-sm",
                      reducedMotion ? "" : "progress-number-change"
                    ].join(" ")}
                    key={progress}
                  >
                    {progress}%
                  </p>
                </div>
                <ProgressBar
                  celebrating={milestone !== null}
                  reducedMotion={reducedMotion}
                  value={progress}
                />
                <p
                  aria-live="polite"
                  className={[
                    "mt-0.5 text-[10px] font-semibold leading-3 sm:text-[11px] sm:leading-4",
                    milestone ? "text-pine" : "text-slate-500",
                    milestone && !reducedMotion ? "milestone-message" : ""
                  ].join(" ")}
                >
                  {milestone
                    ? milestone === 100
                      ? "Checklist complete."
                      : `${milestone}% milestone reached.`
                    : "Progress saves automatically on this device."}
                </p>
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
                  allItemsComplete={items
                    .filter((item) => item.category === section.category.title)
                    .every((item) => completedIds.has(item.id))}
                  category={section.category}
                  collapsingIds={collapsingIds}
                  completedIds={completedIds}
                  items={section.items}
                  key={section.category.id}
                  onCollapseComplete={finishCollapse}
                  onReorder={reorderVisibleItems}
                  onToggle={toggleItem}
                  reorderMode={reorderMode}
                  reducedMotion={reducedMotion}
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

          {FEEDBACK_FORM_URL ? <ChecklistFeedback formUrl={FEEDBACK_FORM_URL} /> : null}

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

function ChecklistFeedback({ formUrl }: { formUrl: string }) {
  const [response, setResponse] = useState<"yes" | "somewhat" | "no" | null>(null);

  return (
    <section className="no-print rounded-[1.35rem] bg-paper p-4 shadow-card" aria-labelledby="checklist-feedback">
      <h2 className="text-base font-black text-ink" id="checklist-feedback">
        Was this checklist useful?
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {(["yes", "somewhat", "no"] as const).map((value) => (
          <button
            aria-pressed={response === value}
            className={[
              "min-h-9 rounded-full px-3 text-sm font-black transition",
              response === value
                ? "bg-ink text-white shadow-tile"
                : "bg-linen text-slate-600 hover:bg-white hover:text-ink"
            ].join(" ")}
            key={value}
            onClick={() => setResponse(value)}
            type="button"
          >
            {value === "yes" ? "Yes" : value === "somewhat" ? "Somewhat" : "No"}
          </button>
        ))}
      </div>
      {response ? (
        <div className="mt-3 border-t border-black/5 pt-3">
          <p className="text-sm font-bold text-slate-600">What was missing or confusing?</p>
          <a
            className="mt-2 inline-flex min-h-9 items-center justify-center rounded-full bg-pine px-4 text-sm font-black text-white transition hover:bg-ink"
            href={formUrl}
            rel="noreferrer"
            target="_blank"
          >
            Share feedback
          </a>
        </div>
      ) : null}
    </section>
  );
}

function categoryButtonClasses(active: boolean) {
  return [
    "flex min-w-0 items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left text-sm font-bold transition",
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

function createDefaultOrder(
  categories: ChecklistCategoryDefinition[],
  items: ChecklistItem[]
): ItemOrder {
  return Object.fromEntries(
    categories.map((category) => [
      category.title,
      items.filter((item) => item.category === category.title).map((item) => item.id)
    ])
  );
}

function reconcileOrder(
  savedOrder: unknown,
  categories: ChecklistCategoryDefinition[],
  items: ChecklistItem[]
): ItemOrder {
  const defaults = createDefaultOrder(categories, items);
  if (!savedOrder || typeof savedOrder !== "object" || Array.isArray(savedOrder)) {
    return defaults;
  }

  const savedRecord = savedOrder as Record<string, unknown>;
  return Object.fromEntries(
    categories.map((category) => {
      const defaultIds = defaults[category.title];
      const validIds = new Set(defaultIds);
      const savedIds = Array.isArray(savedRecord[category.title])
        ? (savedRecord[category.title] as unknown[]).filter(
            (id): id is string => typeof id === "string" && validIds.has(id)
          )
        : [];
      const uniqueSavedIds = Array.from(new Set(savedIds));
      const knownIds = new Set(uniqueSavedIds);
      return [
        category.title,
        [...uniqueSavedIds, ...defaultIds.filter((id) => !knownIds.has(id))]
      ];
    })
  );
}

function persistCompletedIds(completedIds: Set<string>) {
  try {
    window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(Array.from(completedIds)));
  } catch {
    // Some embedded browser contexts block localStorage; keep the in-page state usable.
  }
}

function countCompleted(items: ChecklistItem[], completedIds: Set<string>) {
  return items.filter((item) => completedIds.has(item.id)).length;
}

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return reducedMotion;
}
