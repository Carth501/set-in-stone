export type Aspect = "BLOOM" | "CALLOUS" | "LAW" | "TIDE" | "ZEAL";

export const AspectIcons: Record<Aspect, string> = {
  BLOOM: "/icons/bloom_icon.png",
  CALLOUS: "/icons/callous_icon.png",
  LAW: "/icons/law_icon.png",
  TIDE: "/icons/tide_icon.png",
  ZEAL: "/icons/zeal_icon.png",
};

export const ALL_ASPECTS: Aspect[] = Object.keys(AspectIcons) as Aspect[];
