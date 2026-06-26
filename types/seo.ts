export type SeoPageSection = {
  heading: string;
  body: string;
};

export type SeoPageContent = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  heroSubheadline: string;
  sections: SeoPageSection[];
  ctaText: string;
  ctaLink: string;
};
