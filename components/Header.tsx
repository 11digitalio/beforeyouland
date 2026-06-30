import Link from "next/link";
import { MapPinArea } from "@phosphor-icons/react/dist/ssr";
import { IconTile } from "@/components/IconTile";
import { TrackedLink } from "@/components/TrackedLink";

export function Header({ minimal = false }: { minimal?: boolean }) {
  return (
    <header
      className={[
        "no-print border-b",
        minimal
          ? "tokyo-minimal-header border-black/[0.22] bg-[#edebe6]"
          : "border-black/5 bg-linen/88 backdrop-blur"
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8",
          minimal ? "h-12" : "h-16"
        ].join(" ")}
      >
        <Link
          className={[
            "inline-flex items-center gap-2 text-ink",
            minimal ? "font-bold tracking-tight" : "font-black tracking-normal"
          ].join(" ")}
          href="/"
        >
          {minimal ? null : <IconTile icon={MapPinArea} size="sm" tone="ink" />}
          <span>Before You Land</span>
        </Link>

        <nav className="flex items-center gap-2 text-sm font-semibold text-slate-600">
          <Link
            className={[
              "hidden px-3 py-2 transition hover:text-ink sm:block",
              minimal ? "" : "rounded-full hover:bg-white"
            ].join(" ")}
            href="/"
          >
            Home
          </Link>
          <TrackedLink
            className={[
              "px-3 py-2 font-bold transition",
              minimal
                ? "border-b-2 border-black text-ink"
                : "rounded-full bg-ink px-4 text-white shadow-tile hover:bg-pine"
            ].join(" ")}
            eventData={{ source: "header" }}
            eventName="open_checklist_clicked"
            href="/tokyo"
          >
            Tokyo checklist
          </TrackedLink>
        </nav>
      </div>
    </header>
  );
}
