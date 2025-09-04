export const ASPECTS = [
  "BLOOM",
  "CALLOUS",
  "GRACE",
  "LAW",
  "MYTHIC",
  "RELIC",
  "TIDE",
  "WEIRD",
  "XENO",
  "ZEAL",
  "FUNDAMENTAL",
];

export type AspectType = (typeof ASPECTS)[number];

export const Icons: Record<string, string> = {
  BLOOM: "/icons/bloom_icon.png",
  CALLOUS: "/icons/callous_icon.png",
  GRACE: "/icons/grace_icon.png",
  LAW: "/icons/law_icon.png",
  MYTHIC: "/icons/mythic_icon.png",
  RELIC: "/icons/relic_icon.png",
  TIDE: "/icons/tide_icon.png",
  WEIRD: "/icons/weird_icon.png",
  XENO: "/icons/xeno_icon.png",
  ZEAL: "/icons/zeal_icon.png",
  FUNDAMENTAL: "/icons/fundamental_icon.png",
  EXHAUST: "/icons/exhaust_icon.png",
};

export const sortAspectRecord = (
  aspectRecord: Record<string, number>
): Record<string, number> => {
  const sorted: Record<string, number> = {};

  ASPECTS.forEach((aspect) => {
    if (aspectRecord[aspect] !== undefined) {
      sorted[aspect] = aspectRecord[aspect];
    }
  });

  Object.keys(aspectRecord).forEach((aspect) => {
    if (!ASPECTS.includes(aspect as AspectType)) {
      sorted[aspect] = aspectRecord[aspect];
    }
  });

  return sorted;
};
