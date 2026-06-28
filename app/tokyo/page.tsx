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
    <Layout>
      <section className="px-4 pb-16 pt-5 sm:px-6 sm:pt-7 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-clay">
              Tokyo arrival dashboard
            </p>
            <h1 className="mt-2 text-[2rem] font-black leading-[1.08] tracking-normal text-ink sm:text-4xl">
              Your Tokyo pre-landing checklist
            </h1>
            <p className="mt-2.5 max-w-2xl text-sm font-normal leading-5 text-slate-600 sm:text-base sm:leading-6">
              Built for a U.S. passport holder visiting Tokyo as a first-time solo traveler for under
              90 days.
            </p>
            <div className="mt-2.5 max-w-2xl border-l-2 border-clay/40 pl-3 text-sm leading-5 text-slate-500">
              <span className="font-bold text-ink">Last updated: June 2026.</span>{" "}
              Travel requirements can change. Verify official sources before booking or flying.
            </div>
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
