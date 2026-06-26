export type AnalyticsData = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(eventName: string, data: AnalyticsData = {}) {
  if (typeof window === "undefined") return;

  console.log("[Before You Land analytics]", eventName, data);
}
