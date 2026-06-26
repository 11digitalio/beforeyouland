import {
  AirplaneLanding,
  Bank,
  CarProfile,
  ChatCircleText,
  DeviceMobile,
  ForkKnife,
  IdentificationCard,
  LinkSimple,
  MapPinArea,
  SuitcaseRolling
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react/dist/lib/types";

type CategoryVisual = {
  icon: Icon;
  tone: "cream" | "green" | "blue" | "orange" | "rose" | "ink" | "mist";
};

const categoryVisuals: Record<string, CategoryVisual> = {
  "Entry & Documents": { icon: IdentificationCard, tone: "blue" },
  "Money & Payments": { icon: Bank, tone: "green" },
  "Phone & Internet": { icon: DeviceMobile, tone: "orange" },
  Transportation: { icon: CarProfile, tone: "rose" },
  "Apps to Download": { icon: ForkKnife, tone: "cream" },
  "Airport Arrival": { icon: AirplaneLanding, tone: "blue" },
  "First 24 Hours": { icon: MapPinArea, tone: "green" },
  "Culture & Safety": { icon: ChatCircleText, tone: "orange" },
  "Packing Essentials": { icon: SuitcaseRolling, tone: "rose" },
  "Helpful Links": { icon: LinkSimple, tone: "cream" }
};

export function getCategoryVisual(category: string): CategoryVisual {
  return categoryVisuals[category] ?? { icon: MapPinArea, tone: "cream" };
}
