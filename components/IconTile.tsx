import type { Icon } from "@phosphor-icons/react/dist/lib/types";

type IconTileTone = "cream" | "green" | "blue" | "orange" | "rose" | "ink" | "mist";

const toneClasses: Record<IconTileTone, string> = {
  cream: "bg-cream text-ink",
  green: "bg-greenSoft text-pine",
  blue: "bg-blueSoft text-blueInk",
  orange: "bg-orangeSoft text-clay",
  rose: "bg-roseSoft text-roseInk",
  ink: "bg-ink text-white",
  mist: "bg-mist text-pine"
};

const sizeClasses = {
  sm: "size-8 rounded-2xl",
  md: "size-11 rounded-2xl",
  lg: "size-14 rounded-[1.25rem]"
};

const iconSizes = {
  sm: 17,
  md: 21,
  lg: 26
};

export function IconTile({
  icon: Icon,
  tone = "cream",
  size = "md",
  className = ""
}: {
  icon: Icon;
  tone?: IconTileTone;
  size?: keyof typeof sizeClasses;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center shadow-tile ${sizeClasses[size]} ${toneClasses[tone]} ${className}`}
    >
      <Icon aria-hidden="true" size={iconSizes[size]} weight="bold" />
    </span>
  );
}
