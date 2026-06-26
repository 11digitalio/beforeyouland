import { ArrowRight, BookOpen, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { IconTile } from "@/components/IconTile";
import { TrackedLink } from "@/components/TrackedLink";
import type { SeoPageContent } from "@/types/seo";

export function SeoLandingPage({ page }: { page: SeoPageContent }) {
  return (
    <article>
      <section className="border-b border-black/5 bg-linen px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-clay">
              Before You Land guide
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-normal text-ink sm:text-6xl">
              {page.heroHeadline}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">{page.heroSubheadline}</p>
            <TrackedLink
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-5 pl-5 pr-3 text-sm font-black text-white shadow-card transition hover:bg-pine"
              eventData={{ source: page.slug }}
              eventName="open_checklist_clicked"
              href={page.ctaLink}
            >
              {page.ctaText}
              <IconTile className="shadow-none" icon={ArrowRight} size="sm" tone="cream" />
            </TrackedLink>
          </div>

          <div className="rounded-[2rem] bg-paper p-5 shadow-soft sm:p-6">
            <div className="flex items-center gap-3">
              <IconTile icon={BookOpen} tone="green" />
              <p className="text-sm font-black text-pine">Quick view</p>
            </div>
            <div className="mt-4 grid gap-3">
              {page.sections.slice(0, 4).map((section) => (
                <a
                  className="flex items-center gap-3 rounded-[1.25rem] bg-linen/75 p-3 transition hover:bg-white hover:shadow-card"
                  href={`#${slugify(section.heading)}`}
                  key={section.heading}
                >
                  <IconTile className="shadow-none" icon={CheckCircle} size="sm" tone="blue" />
                  <p className="font-black text-ink">{section.heading}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
          {page.sections.map((section) => (
            <section
              className="rounded-[1.75rem] bg-paper p-5 shadow-card sm:p-6"
              id={slugify(section.heading)}
              key={section.heading}
            >
              <h2 className="text-2xl font-black tracking-normal text-ink">{section.heading}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mx-auto mt-6 max-w-6xl rounded-[1.5rem] bg-orangeSoft p-5 text-sm font-semibold leading-6 text-clay">
          Travel rules change. Always verify entry requirements with official government sources before
          booking or flying.
        </div>
      </section>
    </article>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
