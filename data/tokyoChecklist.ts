import type { ChecklistCategoryDefinition, ChecklistItem } from "@/types/checklist";

export const tokyoChecklistCategories: ChecklistCategoryDefinition[] = [
  {
    id: "entry-documents",
    title: "Entry & Documents",
    summary: "Passport checks, short-stay research, arrival forms, and address details."
  },
  {
    id: "money-payments",
    title: "Money & Payments",
    summary: "Cards, cash, ATMs, mobile wallets, and practical payment habits."
  },
  {
    id: "phone-internet",
    title: "Phone & Internet",
    summary: "eSIM, roaming, offline access, charging, and backup connectivity."
  },
  {
    id: "transportation",
    title: "Transportation",
    summary: "Airport transfers, transit cards, route planning, taxis, and late-night fallback plans."
  },
  {
    id: "apps-download",
    title: "Apps to Download",
    summary: "Maps, translation, transit, taxis, restaurants, and travel support."
  },
  {
    id: "airport-arrival",
    title: "Airport Arrival",
    summary: "What to expect after landing at Haneda or Narita before heading into Tokyo."
  },
  {
    id: "first-24-hours",
    title: "First 24 Hours",
    summary: "The basics to handle after check-in so your first day stays simple."
  },
  {
    id: "culture-safety",
    title: "Culture & Safety",
    summary: "Etiquette, emergency numbers, solo-travel awareness, and everyday safety."
  },
  {
    id: "packing-essentials",
    title: "Packing Essentials",
    summary: "Small items that make arrival, transit, and daily movement easier."
  },
  {
    id: "helpful-links",
    title: "Helpful Links",
    summary: "A short list of references to verify before booking or flying."
  }
];

export const tokyoChecklistItems: ChecklistItem[] = [
  {
    id: "passport-validity",
    title: "Confirm U.S. passport validity",
    description:
      "Make sure your passport is unexpired, in good condition, and valid for the full trip.",
    priority: "required",
    timing: "before-flight",
    category: "Entry & Documents",
    link: {
      label: "U.S. passport information",
      url: "https://travel.state.gov/content/travel/en/passports.html"
    }
  },
  {
    id: "visa-free-stay-rules",
    title: "Check Japan visa-free stay rules for U.S. citizens",
    description:
      "Review current short-stay guidance for your passport, trip length, and purpose of travel.",
    priority: "required",
    timing: "before-flight",
    category: "Entry & Documents",
    link: {
      label: "Japan visa guidance",
      url: "https://www.mofa.go.jp/j_info/visit/visa/short/novisa.html"
    }
  },
  {
    id: "hotel-address-japanese",
    title: "Save accommodation address in English and Japanese",
    description:
      "Store your first stay's name, address, phone number, and nearest station for forms, taxis, and navigation.",
    priority: "required",
    timing: "before-flight",
    category: "Entry & Documents"
  },
  {
    id: "visit-japan-web",
    title: "Complete Visit Japan Web if applicable",
    description:
      "Check whether pre-arrival immigration or customs registration applies and complete any relevant steps.",
    priority: "recommended",
    timing: "before-flight",
    category: "Entry & Documents",
    link: {
      label: "Visit Japan Web",
      url: "https://www.vjw.digital.go.jp/"
    }
  },
  {
    id: "customs-declaration",
    title: "Check customs and declaration requirements",
    description:
      "Know what must be declared, especially medication, restricted goods, large cash amounts, or duty-free purchases.",
    priority: "required",
    timing: "before-flight",
    category: "Entry & Documents",
    link: {
      label: "Japan Customs",
      url: "https://www.customs.go.jp/english/summary/passenger.htm"
    }
  },
  {
    id: "return-onward-proof",
    title: "Save proof of onward or return travel",
    description:
      "Keep your return flight or onward itinerary accessible offline in case an airline or border officer asks for it.",
    priority: "required",
    timing: "before-flight",
    category: "Entry & Documents"
  },
  {
    id: "travel-documents-offline",
    title: "Save key travel info offline",
    description:
      "Download a passport copy, hotel details, insurance info, emergency contact, and flight confirmations to your phone.",
    priority: "recommended",
    timing: "before-flight",
    category: "Entry & Documents"
  },
  {
    id: "physical-backup-card",
    title: "Bring a physical backup card",
    description:
      "Carry a second physical card separately from your main wallet in case a card is declined, lost, or unsupported.",
    priority: "recommended",
    timing: "before-flight",
    category: "Money & Payments"
  },
  {
    id: "bring-debit-card",
    title: "Bring a debit card for ATM withdrawals",
    description:
      "Pack a debit card with a PIN and confirm international ATM access before relying on convenience store ATMs.",
    priority: "recommended",
    timing: "before-flight",
    category: "Money & Payments"
  },
  {
    id: "cash-useful",
    title: "Understand cash is still useful in Japan",
    description:
      "Cards are common in Tokyo, but small restaurants, temples, transit edge cases, and older shops may still prefer cash.",
    priority: "recommended",
    timing: "before-flight",
    category: "Money & Payments"
  },
  {
    id: "arrival-cash-plan",
    title: "Decide how much yen to get on arrival",
    description:
      "Plan a modest first withdrawal or exchange amount for transit, food, and backup cash before you reach your hotel.",
    priority: "recommended",
    timing: "at-airport",
    category: "Money & Payments"
  },
  {
    id: "phone-unlocked",
    title: "Confirm your phone is unlocked before buying an eSIM",
    description:
      "Check carrier lock status before purchase so your eSIM or travel SIM works as soon as you land.",
    priority: "recommended",
    timing: "before-flight",
    category: "Phone & Internet"
  },
  {
    id: "esim-roaming",
    title: "Set up eSIM or roaming plan",
    description:
      "Choose an eSIM, pocket Wi-Fi, SIM pickup, or carrier roaming plan before departure so you can navigate immediately after landing.",
    priority: "recommended",
    timing: "before-flight",
    category: "Phone & Internet"
  },
  {
    id: "offline-maps",
    title: "Download offline map areas",
    description:
      "Save airport, hotel, and first-day neighborhoods offline in case mobile service is delayed or signal is weak.",
    priority: "recommended",
    timing: "before-flight",
    category: "Phone & Internet"
  },
  {
    id: "airport-train-options",
    title: "Learn airport train options from Haneda or Narita",
    description:
      "Identify whether Tokyo Monorail, Keikyu, Narita Express, Keisei Skyliner, or another route fits your arrival.",
    priority: "recommended",
    timing: "before-flight",
    category: "Transportation"
  },
  {
    id: "first-route-saved",
    title: "Save your airport-to-hotel route",
    description:
      "Save the exact route, transfer station, fare estimate, and final walking directions before boarding your flight.",
    priority: "recommended",
    timing: "before-flight",
    category: "Transportation"
  },
  {
    id: "late-night-fallback",
    title: "Check airport last-train time if landing late",
    description:
      "If you land late, confirm final train times and estimate taxi cost so you are not deciding under pressure.",
    priority: "recommended",
    timing: "before-flight",
    category: "Transportation"
  },
  {
    id: "suica-pasmo-wallet",
    title: "Add Suica or Pasmo to Apple Wallet if supported",
    description:
      "Set up a transit card before departure if your device and card issuer support it. Keep a physical card fallback in mind.",
    priority: "recommended",
    timing: "before-flight",
    category: "Transportation"
  },
  {
    id: "station-exits",
    title: "Note the nearest station exit to your hotel",
    description:
      "Large stations can be confusing. Save the recommended exit number or landmark for your final walk.",
    priority: "optional",
    timing: "before-flight",
    category: "Transportation"
  },
  {
    id: "download-google-maps",
    title: "Download Google Maps",
    description:
      "Use it for walking directions, station routing, and the last few turns from the station to your hotel.",
    priority: "recommended",
    timing: "before-flight",
    category: "Apps to Download",
    link: {
      label: "Google Maps",
      url: "https://www.google.com/maps"
    }
  },
  {
    id: "download-google-translate",
    title: "Download Google Translate",
    description:
      "Download Japanese for offline use and test camera translation before you need it at a menu, sign, or machine.",
    priority: "recommended",
    timing: "before-flight",
    category: "Apps to Download",
    link: {
      label: "Google Translate",
      url: "https://translate.google.com/about/"
    }
  },
  {
    id: "download-navitime",
    title: "Download Japan Travel by NAVITIME",
    description:
      "Use it as a transit backup for routes, train platforms, passes, and tourist-friendly station guidance.",
    priority: "recommended",
    timing: "before-flight",
    category: "Apps to Download",
    link: {
      label: "Japan Travel by NAVITIME",
      url: "https://japantravel.navitime.com/en/"
    }
  },
  {
    id: "download-go-taxi",
    title: "Download GO Taxi",
    description:
      "Set up a taxi app before arrival if you want a backup for late nights, heavy luggage, or confusing transfers.",
    priority: "optional",
    timing: "before-flight",
    category: "Apps to Download",
    link: {
      label: "GO Taxi",
      url: "https://go.goinc.jp/"
    }
  },
  {
    id: "download-tabelog",
    title: "Download Tabelog",
    description:
      "Use it to cross-check restaurant hours, ratings, and local dining options after you know your neighborhood.",
    priority: "optional",
    timing: "before-flight",
    category: "Apps to Download",
    link: {
      label: "Tabelog",
      url: "https://tabelog.com/en/"
    }
  },
  {
    id: "download-klook",
    title: "Download Klook",
    description:
      "Book trains, airport transfers, attractions, and activities across Japan in one place.",
    priority: "recommended",
    timing: "before-flight",
    category: "Apps to Download",
    link: {
      label: "Get Klook",
      url: "https://www.klook.com/"
    }
  },
  {
    id: "confirm-airport-terminal",
    title: "Confirm your arrival airport and terminal",
    description:
      "Tokyo-area trips may land at Haneda or Narita. Save the correct terminal before comparing train or taxi options.",
    priority: "recommended",
    timing: "before-flight",
    category: "Airport Arrival"
  },
  {
    id: "airport-sim-cash-pickup",
    title: "Handle SIM, Wi-Fi, or cash before leaving the airport",
    description:
      "If your phone or cash plan depends on airport pickup, complete it before heading into the city.",
    priority: "recommended",
    timing: "at-airport",
    category: "Airport Arrival"
  },
  {
    id: "use-official-transport",
    title: "Use official airport transport channels",
    description:
      "Use posted train counters, ticket machines, official taxi stands, or your confirmed app to avoid confusion.",
    priority: "recommended",
    timing: "at-airport",
    category: "Airport Arrival"
  },
  {
    id: "passport-hotel-checkin",
    title: "Keep passport accessible for hotel check-in",
    description:
      "Hotels commonly ask to inspect or copy passports for foreign guests, so keep it easy to reach.",
    priority: "required",
    timing: "after-arrival",
    category: "First 24 Hours"
  },
  {
    id: "confirm-checkin-time",
    title: "Confirm hotel check-in time and luggage storage",
    description:
      "If you arrive early, know whether your hotel can store luggage and what you will do until the room is ready.",
    priority: "recommended",
    timing: "before-flight",
    category: "First 24 Hours"
  },
  {
    id: "save-emergency-numbers",
    title: "Save emergency numbers",
    description:
      "Store 110 for police and 119 for fire or ambulance, plus your hotel phone number and nearest embassy contact.",
    priority: "recommended",
    timing: "before-flight",
    category: "Culture & Safety",
    link: {
      label: "U.S. Embassy in Japan",
      url: "https://jp.usembassy.gov/services/"
    }
  },
  {
    id: "train-etiquette",
    title: "Learn basic etiquette around trains, trash, and restaurants",
    description:
      "Keep voices low on trains, carry small trash until you find a bin, and learn common restaurant payment patterns.",
    priority: "recommended",
    timing: "before-flight",
    category: "Culture & Safety"
  },
  {
    id: "medications",
    title: "Check medication rules and pack essentials",
    description:
      "Bring prescriptions in original packaging and verify rules for restricted medication before traveling.",
    priority: "required",
    timing: "before-flight",
    category: "Packing Essentials",
    link: {
      label: "Japan medication guidance",
      url: "https://www.mhlw.go.jp/english/policy/health-medical/pharmaceuticals/01.html"
    }
  },
  {
    id: "plug-adapter",
    title: "Pack plug adapter if needed",
    description:
      "Japan uses Type A and Type B outlets. Check charger voltage and pack adapters for grounded plugs.",
    priority: "recommended",
    timing: "before-flight",
    category: "Packing Essentials"
  },
  {
    id: "official-us-japan-travel",
    title: "Bookmark the U.S. travel advisory page for Japan",
    description:
      "Use it as one reference for safety notices, entry notes, and traveler enrollment options.",
    priority: "recommended",
    timing: "before-flight",
    category: "Helpful Links",
    link: {
      label: "U.S. travel information for Japan",
      url: "https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Japan.html"
    }
  }
];
