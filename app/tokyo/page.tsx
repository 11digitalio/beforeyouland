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
      <section className="px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-clay">
              Tokyo arrival dashboard
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-normal text-ink sm:text-5xl">
              Your Tokyo pre-landing checklist
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Built for a U.S. passport holder visiting Tokyo as a first-time solo traveler for under
              90 days. Travel rules change. Always verify entry requirements with official government
              sources before booking or flying.
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
