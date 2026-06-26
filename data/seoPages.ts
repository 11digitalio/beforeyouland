import type { SeoPageContent } from "@/types/seo";

export const seoPages: SeoPageContent[] = [
  {
    slug: "tokyo-travel-checklist",
    title: "Tokyo Travel Checklist for First-Time Visitors",
    metaTitle: "Tokyo Travel Checklist for First-Time Visitors | Before You Land",
    metaDescription:
      "A concise Tokyo travel checklist covering entry rules, apps, eSIM, Suica, cash, airport arrival, packing, etiquette, and first-day setup.",
    heroHeadline: "Tokyo Travel Checklist for First-Time Visitors",
    heroSubheadline:
      "A practical arrival checklist covering entry rules, apps, eSIM, Suica, cash and card setup, airport arrival, packing, etiquette, and your first day in Tokyo.",
    ctaText: "Open the interactive checklist",
    ctaLink: "/tokyo",
    sections: [
      {
        heading: "Before your flight",
        body:
          "Check your passport, review current short-stay entry guidance, save your hotel address, prepare offline documents, and set up your first route from the airport."
      },
      {
        heading: "At the airport",
        body:
          "Know your arrival terminal, complete immigration and customs, pick up any SIM or Wi-Fi reservation, withdraw a small amount of yen, and use official train or taxi channels."
      },
      {
        heading: "After you land",
        body:
          "Keep your first transfer simple, confirm your hotel check-in plan, keep your passport accessible, and buy first-day basics near your accommodation."
      },
      {
        heading: "Essential apps",
        body:
          "Install Google Maps, Google Translate, Japan Travel by NAVITIME, a taxi app such as GO, and a restaurant lookup tool before you need them."
      },
      {
        heading: "Money and payments",
        body:
          "Bring a debit card for ATM withdrawals, check foreign transaction fees, understand that cash is still useful, and set up Suica or Pasmo on your phone if supported."
      },
      {
        heading: "First 24 hours",
        body:
          "Prioritize a smooth route to your hotel, a nearby meal, phone charging, emergency numbers, and light orientation instead of overloading your arrival day."
      }
    ]
  },
  {
    slug: "japan-travel-apps",
    title: "Japan Travel Apps",
    metaTitle: "Japan Travel Apps for First-Time Visitors | Before You Land",
    metaDescription:
      "A starter guide to useful Japan travel apps for maps, translation, trains, taxis, restaurants, and arrival-day planning.",
    heroHeadline: "Japan Travel Apps for First-Time Visitors",
    heroSubheadline:
      "A draft-ready guide to the apps that make navigation, translation, transit, taxis, restaurants, and first-day setup easier in Japan.",
    ctaText: "Open the interactive checklist",
    ctaLink: "/tokyo",
    sections: [
      {
        heading: "Maps and navigation",
        body:
          "Start with a reliable map app and save airport, hotel, and first-day neighborhoods offline before departure."
      },
      {
        heading: "Translation",
        body:
          "Download Japanese for offline translation and test camera translation for menus, signs, and ticket machines."
      },
      {
        heading: "Transit planning",
        body:
          "Use a Japan-specific transit app as a backup for train routes, station exits, platforms, and fare estimates."
      },
      {
        heading: "Taxis and late-night fallback",
        body:
          "Install a taxi app before landing if you want a backup for late arrivals, heavy luggage, or confusing transfers."
      },
      {
        heading: "Food and local discovery",
        body:
          "Keep a restaurant lookup tool handy for hours, ratings, neighborhood options, and quick meal decisions after check-in."
      }
    ]
  },
  {
    slug: "japan-esim-guide",
    title: "Japan eSIM Guide",
    metaTitle: "Japan eSIM Guide for Travelers | Before You Land",
    metaDescription:
      "A simple placeholder guide for choosing a Japan eSIM, roaming plan, pocket Wi-Fi, or airport SIM pickup before arrival.",
    heroHeadline: "Japan eSIM Guide for Travelers",
    heroSubheadline:
      "A simple pre-arrival guide to choosing mobile data for Japan, with notes on eSIMs, roaming, pocket Wi-Fi, airport pickup, and backup access.",
    ctaText: "Open the interactive checklist",
    ctaLink: "/tokyo",
    sections: [
      {
        heading: "Choose your data option",
        body:
          "Compare eSIM, carrier roaming, pocket Wi-Fi, and airport SIM pickup based on device support, trip length, and arrival timing."
      },
      {
        heading: "Set it up before departure",
        body:
          "Install or reserve your connection before flying so you can navigate, translate, and contact your hotel right after landing."
      },
      {
        heading: "Keep a backup",
        body:
          "Save hotel details offline and keep a paper address in case activation fails or airport pickup takes longer than expected."
      }
    ]
  },
  {
    slug: "narita-airport-arrival-guide",
    title: "Narita Airport Arrival Guide",
    metaTitle: "Narita Airport Arrival Guide for First-Time Visitors | Before You Land",
    metaDescription:
      "A concise placeholder Narita arrival guide covering terminals, immigration, cash, SIM pickup, train options, and transfers into Tokyo.",
    heroHeadline: "Narita Airport Arrival Guide",
    heroSubheadline:
      "A draft-ready arrival guide for first-time visitors landing at Narita, covering terminal basics, airport errands, transport into Tokyo, and first-transfer planning.",
    ctaText: "Open the interactive checklist",
    ctaLink: "/tokyo",
    sections: [
      {
        heading: "Before your flight",
        body:
          "Confirm your Narita terminal, save your hotel route, and decide whether you need SIM, Wi-Fi, cash, or ticket counter time before leaving the airport."
      },
      {
        heading: "At Narita",
        body:
          "Move through immigration, baggage claim, and customs before handling any pickup reservations or first cash withdrawal."
      },
      {
        heading: "Getting into Tokyo",
        body:
          "Compare Narita Express, Keisei Skyliner, local trains, buses, and taxis based on your hotel location, arrival time, and luggage."
      }
    ]
  }
];

export function getSeoPageBySlug(slug: string) {
  return seoPages.find((page) => page.slug === slug);
}
