import { AirplaneTilt, ArrowRight, CreditCard, GlobeHemisphereEast } from "@phosphor-icons/react/dist/ssr";
import { IconTile } from "@/components/IconTile";
import { TrackedLink } from "@/components/TrackedLink";

const heroImage =
  "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1800&q=80";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-linen">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-8 lg:py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-clay">
            Tokyo arrival prep
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[0.98] tracking-normal text-ink sm:text-5xl lg:text-6xl">
            Everything to set up before landing in Tokyo.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            A clean arrival checklist for entry rules, apps, money, SIM cards, transport, safety,
            and your first day.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <TrackedLink
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-5 pl-5 pr-3 text-sm font-black text-white shadow-soft transition hover:bg-pine"
              eventData={{ source: "home_hero" }}
              eventName="open_checklist_clicked"
              href="/tokyo"
            >
              Build my Tokyo checklist
              <IconTile className="shadow-none" icon={ArrowRight} size="sm" tone="cream" />
            </TrackedLink>
            <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 shadow-tile">
                <IconTile className="shadow-none" icon={AirplaneTilt} size="sm" tone="blue" />
                Under 90 days
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 shadow-tile">
                <IconTile className="shadow-none" icon={CreditCard} size="sm" tone="green" />
                U.S. passport
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 shadow-tile">
                <IconTile className="shadow-none" icon={GlobeHemisphereEast} size="sm" tone="orange" />
                Solo-ready
              </span>
            </div>
          </div>
        </div>

        <div className="relative hidden min-h-64 lg:block">
          <div
            className="absolute inset-0 rounded-[2rem] bg-cover bg-center shadow-soft"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(17, 17, 17, 0.08), rgba(17, 17, 17, 0.26)), url(${heroImage})`
            }}
          />
          <div className="absolute -bottom-5 left-6 right-6 rounded-[1.75rem] bg-paper/95 p-4 shadow-soft backdrop-blur">
            <div className="flex items-center gap-3">
              <IconTile icon={GlobeHemisphereEast} tone="green" />
              <div>
                <p className="text-sm font-black text-ink">Tokyo ready list</p>
                <p className="text-xs font-semibold text-slate-500">44 compact tasks</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
