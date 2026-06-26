"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackEvent, type AnalyticsData } from "@/lib/analytics";

type TrackedLinkProps = ComponentProps<typeof Link> & {
  eventName: string;
  eventData?: AnalyticsData;
};

export function TrackedLink({ eventName, eventData, onClick, ...props }: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        trackEvent(eventName, eventData);
        onClick?.(event);
      }}
    />
  );
}
