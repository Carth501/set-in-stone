export type Aspect =
  | "BLOOM"
  | "CALLOUS"
  | "LAW"
  | "TIDE"
  | "ZEAL"
  | "FUNDAMENTAL";

export const AspectIcons: Record<Aspect, string> = {
  BLOOM: "/icons/bloom_icon.png",
  CALLOUS: "/icons/callous_icon.png",
  LAW: "/icons/law_icon.png",
  TIDE: "/icons/tide_icon.png",
  ZEAL: "/icons/zeal_icon.png",
  FUNDAMENTAL: "/icons/fundamental_icon.png",
};

export const ALL_ASPECTS: Aspect[] = Object.keys(AspectIcons) as Aspect[];

export const sortAspectRecord = (
  aspectRecord: Record<string, number>
): Record<string, number> => {
  const sorted: Record<string, number> = {};

  // Sort according to ALL_ASPECTS order
  ALL_ASPECTS.forEach((aspect) => {
    if (aspectRecord[aspect] !== undefined) {
      sorted[aspect] = aspectRecord[aspect];
    }
  });

  // Add any aspects not in ALL_ASPECTS at the end (fallback)
  Object.keys(aspectRecord).forEach((aspect) => {
    if (!ALL_ASPECTS.includes(aspect as Aspect)) {
      sorted[aspect] = aspectRecord[aspect];
    }
  });

  return sorted;
};
