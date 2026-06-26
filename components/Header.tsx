import Link from "next/link";
import { MapPinArea } from "@phosphor-icons/react/dist/ssr";
import { IconTile } from "@/components/IconTile";
import { TrackedLink } from "@/components/TrackedLink";

export function Header() {
  return (
    <header className="no-print border-b border-black/5 bg-linen/88 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link className="inline-flex items-center gap-2 font-black tracking-normal text-ink" href="/">
          <IconTile icon={MapPinArea} size="sm" tone="ink" />
          <span>Before You Land</span>
        </Link>

        <nav className="flex items-center gap-2 text-sm font-semibold text-slate-600">
          <Link className="hidden rounded-full px-3 py-2 transition hover:bg-white hover:text-ink sm:block" href="/">
            Home
          </Link>
          <TrackedLink
            className="rounded-full bg-ink px-4 py-2 font-bold text-white shadow-tile transition hover:bg-pine"
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
