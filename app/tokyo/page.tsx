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
      <section className="min-h-screen bg-[#F5F5F7] px-4 pb-16 pt-5 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text',Inter,sans-serif] text-[#1D1D1F] sm:px-6 sm:pt-7 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <p className="text-[13px] font-semibold text-[#007AFF]">
              Tokyo arrival checklist
            </p>
            <h1 className="mt-1 text-[31px] font-bold leading-[1.12] tracking-[-0.02em] text-[#1D1D1F] sm:text-[36px]">
              Your Tokyo pre-landing checklist
            </h1>
            <p className="mt-2 max-w-2xl text-[14px] leading-5 text-[#6E6E73] sm:text-[15px]">
              Built for a U.S. passport holder visiting Tokyo as a first-time solo traveler for under
              90 days.
            </p>
            <div className="mt-2 max-w-2xl text-[13px] leading-[18px] text-[#86868B]">
              <span className="font-semibold text-[#3A3A3C]">Last updated: June 2026.</span>{" "}
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
