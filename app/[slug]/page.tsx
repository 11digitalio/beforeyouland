import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityRequestForm } from "@/components/CityRequestForm";
import { EmailCapture } from "@/components/EmailCapture";
import { Layout } from "@/components/Layout";
import { SeoLandingPage } from "@/components/SeoLandingPage";
import { getSeoPageBySlug, seoPages } from "@/data/seoPages";

type SeoRouteParams = {
  slug: string;
};

export function generateStaticParams(): SeoRouteParams[] {
  return seoPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<SeoRouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPageBySlug(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.metaTitle,
    description: page.metaDescription
  };
}

export default async function SeoPage({ params }: { params: Promise<SeoRouteParams> }) {
  const { slug } = await params;
  const page = getSeoPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <Layout>
      <SeoLandingPage page={page} />
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <EmailCapture source={page.slug} />
          <CityRequestForm source={page.slug} />
        </div>
      </section>
    </Layout>
  );
}
