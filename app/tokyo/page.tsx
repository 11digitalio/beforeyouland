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
      <section className="tokyo-checklist-page min-h-screen bg-[#edebe6] px-4 pb-14 pt-5 sm:px-6 sm:pt-7 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#77736c]">
              Tokyo · Arrival checklist
            </p>
            <h1 className="mt-1.5 text-[25px] font-bold leading-[1.08] tracking-[-0.035em] text-[#2b2b2b] sm:text-[29px]">
              Your Tokyo pre-landing checklist
            </h1>
            <p className="mt-1.5 max-w-2xl text-[13px] leading-[1.45] text-[#77736c]">
              Built for a U.S. passport holder visiting Tokyo as a first-time solo traveler for under
              90 days.
            </p>
            <p className="mt-1 text-[11px] leading-4 text-[#77736c]">
              <span className="font-semibold text-[#2b2b2b]">Updated June 2026</span>
              <span aria-hidden="true"> · </span>
              Verify official sources before booking or flying.
            </p>
          </div>

          <ChecklistDashboard categories={tokyoChecklistCategories} items={tokyoChecklistItems} />

          <div className="tokyo-secondary-content mt-10 grid gap-0 border-b border-black/[0.22] lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
            <EmailCapture source="tokyo_checklist" />
            <CityRequestForm source="tokyo_checklist" />
          </div>
        </div>
      </section>
    </Layout>
  );
}
