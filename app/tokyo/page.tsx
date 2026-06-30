import type { Metadata } from "next";
import { CityRequestForm } from "@/components/CityRequestForm";
import { ChecklistDashboard } from "@/components/ChecklistDashboard";
import { EmailCapture } from "@/components/EmailCapture";
import { Layout } from "@/components/Layout";
import { tokyoChecklistCategories, tokyoChecklistItems } from "@/data/tokyoChecklist";

export const metadata: Metadata = {
  title: "Tokyo Arrival Checklist | Before You Land",
  description:
    "An interactive Tokyo arrival checklist for first-time solo travelers covering documents, apps, money, transit, airport arrival, safety, and first-day setup."
};

export default function TokyoChecklistPage() {
  return (
    <Layout minimalHeader>
      <section className="tokyo-checklist-page min-h-screen bg-[#f5f5f3] px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
              Tokyo · Arrival checklist
            </p>
            <h1 className="mt-2 text-[30px] font-extrabold leading-[1.08] tracking-[-0.035em] text-neutral-950 sm:text-[34px]">
              Your Tokyo pre-landing checklist
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-5 text-neutral-600">
              Built for a U.S. passport holder visiting Tokyo as a first-time solo traveler for under
              90 days.
            </p>
            <p className="mt-2 text-[13px] leading-5 text-neutral-500">
              <span className="font-semibold text-neutral-700">Updated June 2026</span>
              <span aria-hidden="true"> · </span>
              Verify official sources before booking or flying.
            </p>
          </div>

          <ChecklistDashboard categories={tokyoChecklistCategories} items={tokyoChecklistItems} />

          <div className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <EmailCapture source="tokyo_checklist" />
            <CityRequestForm source="tokyo_checklist" />
          </div>
        </div>
      </section>
    </Layout>
  );
}
