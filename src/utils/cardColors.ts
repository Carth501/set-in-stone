import type { Aspect } from "../aspects/aspects";
import type { CardCost } from "../types/Card";

const aspectColorMap: Record<Aspect, string> = {
  BLOOM: "bloom",
  CALLOUS: "callous",
  LAW: "law",
  TIDE: "tide",
  ZEAL: "zeal",
};

export function getCardColorClass(aspectList: CardCost): string {
  const aspectsWithCost = Object.entries(aspectList)
    .filter(([, count]) => count > 0)
    .map(([aspect]) => aspect as Aspect);

  if (aspectsWithCost.length === 0) {
    return "bg-fundamental";
  }

  if (aspectsWithCost.length === 1) {
    return getSingleAspectColor(aspectsWithCost[0]);
  }

  if (aspectsWithCost.length === 2) {
    const [first, second] = aspectsWithCost;
    return `bg-gradient-to-br from-${aspectColorMap[first]} to-${aspectColorMap[second]}`;
  }

  const [first, second, third] = aspectsWithCost;
  return `bg-gradient-to-br from-${aspectColorMap[first]} via-${aspectColorMap[second]} to-${aspectColorMap[third]}`;
}

export function getSingleAspectColor(aspect: Aspect): string {
  switch (aspect) {
    case "BLOOM":
      return "bg-bloom";
    case "CALLOUS":
      return "bg-callous";
    case "LAW":
      return "bg-law";
    case "TIDE":
      return "bg-tide";
    case "ZEAL":
      return "bg-zeal";
    default:
      return "bg-fundamental";
  }
}
