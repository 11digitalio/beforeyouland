import {
  ArrowRight,
  Binoculars,
  CheckCircle,
  Circle,
  Compass,
  CreditCard,
  DeviceMobile
} from "@phosphor-icons/react/dist/ssr";
import { Hero } from "@/components/Hero";
import { IconTile } from "@/components/IconTile";
import { Layout } from "@/components/Layout";
import { TrackedLink } from "@/components/TrackedLink";
import { tokyoChecklistCategories, tokyoChecklistItems } from "@/data/tokyoChecklist";

const coverage = [
  {
    title: "Entry setup",
    description: "Passport, entry rules, hotel address, and offline docs.",
    icon: Compass,
    tone: "blue" as const
  },
  {
    title: "Landing logistics",
    description: "Cash, mobile data, airport flow, and first transfer.",
    icon: CreditCard,
    tone: "green" as const
  },
  {
    title: "Local readiness",
    description: "Apps, etiquette, safety, packing, and day-one basics.",
    icon: DeviceMobile,
    tone: "orange" as const
  }
];

const audiences = [
  "First-time travelers",
  "Solo travelers",
  "Digital nomads",
  "People who hate scattered travel research"
];

const previewSections = tokyoChecklistCategories.slice(0, 6);

export default function Home() {
  return (
    <Layout>
      <Hero />

      <section className="px-4 pb-12 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <div className="rounded-[2rem] bg-paper p-4 shadow-soft sm:p-5">
            <div className="flex items-center justify-between gap-4 border-b border-black/5 pb-4">
              <div>
                <p className="text-sm font-black text-pine">Tokyo checklist preview</p>
                <h2 className="mt-1 text-2xl font-black tracking-normal text-ink">
                  Scan it fast. Finish what matters.
                </h2>
              </div>
              <div className="hidden rounded-full bg-greenSoft px-3 py-1 text-sm font-black text-pine sm:block">
                {tokyoChecklistItems.length} tasks
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              {previewSections.map((section, index) => (
                <div
                  className="flex items-center gap-3 rounded-[1.25rem] bg-linen/70 p-3"
                  key={section.id}
                >
                  {index < 2 ? (
                    <IconTile icon={CheckCircle} size="sm" tone="green" />
                  ) : (
                    <IconTile icon={Circle} size="sm" tone="cream" />
                  )}
                  <div>
                    <h3 className="text-sm font-black text-ink">{section.title}</h3>
                    <p className="mt-0.5 text-xs font-semibold leading-5 text-slate-500">{section.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-clay">
                What it covers
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-normal text-ink sm:text-4xl">
                One place for the setup stuff.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Clear tasks for before the flight, at the airport, and your first day in Tokyo.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {coverage.map((item) => (
                <div className="rounded-[1.5rem] bg-paper p-4 shadow-card" key={item.title}>
                  <IconTile icon={item.icon} tone={item.tone} />
                  <h3 className="mt-3 font-black text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm leading-5 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-paper p-4 shadow-card sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <IconTile icon={Binoculars} tone="rose" />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Built for</p>
                <h2 className="text-xl font-black tracking-normal text-ink">
                  Travelers who want fewer tabs.
                </h2>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {audiences.map((audience) => (
              <div className="shrink-0 rounded-full bg-linen px-4 py-2" key={audience}>
                <p className="text-sm font-black text-ink">{audience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-[2rem] bg-ink p-6 text-white shadow-soft sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-white/60">
              Tokyo, Japan
            </p>
            <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-normal">
              Build a checklist you can actually finish before departure.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68">
              Travel rules change. Always verify entry requirements with official government sources before
              booking or flying.
            </p>
          </div>
          <TrackedLink
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 pl-5 pr-3 text-sm font-black text-ink transition hover:bg-mist"
            eventData={{ source: "home_bottom_cta" }}
            eventName="open_checklist_clicked"
            href="/tokyo"
          >
            Build my Tokyo checklist
            <IconTile className="shadow-none" icon={ArrowRight} size="sm" tone="ink" />
          </TrackedLink>
        </div>
      </section>
    </Layout>
  );
}
