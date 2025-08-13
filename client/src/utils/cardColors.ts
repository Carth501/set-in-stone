import { ASPECTS, type AspectType } from "../aspects/aspects";
import type { CardCost } from "../types/Card";

export function getCardColorClass(
  aspectList: CardCost,
  aspectMask: number
): string {
  let aspectsWithCost;
  if (aspectMask > 0) {
    aspectsWithCost = ASPECTS.filter((aspect, index) => {
      return (aspectMask & (1 << index)) !== 0;
    });
  } else {
    aspectsWithCost = Object.entries(aspectList)
      .filter(([, count]) => count > 0)
      .filter(([aspect]) => aspect !== "FUNDAMENTAL")
      .map(([aspect]) => aspect as AspectType);
  }

  if (aspectsWithCost.length === 0) {
    return "bg-fundamental";
  }

  if (aspectsWithCost.length === 1) {
    return getSingleAspectColor(aspectsWithCost[0]);
  }

  if (aspectsWithCost.length === 2) {
    const [first, second] = aspectsWithCost;
    return getMultiAspectColor(first, second);
  }

  if (aspectsWithCost.length === 3) {
    const [first, second, third] = aspectsWithCost;
    return getMultiAspectColor(first, second, third);
  }

  return "bg-poly";
}

export function getSingleAspectColor(aspect: AspectType): string {
  switch (aspect) {
    case "BLOOM":
      return "bg-bloom";
    case "CALLOUS":
      return "bg-callous";
    case "GRACE":
      return "bg-grace";
    case "LAW":
      return "bg-law";
    case "MYTHIC":
      return "bg-mythic";
    case "RELIC":
      return "bg-relic";
    case "TIDE":
      return "bg-tide";
    case "WEIRD":
      return "bg-weird";
    case "XENO":
      return "bg-xeno";
    case "ZEAL":
      return "bg-zeal";
    default:
      return "bg-fundamental";
  }
}

export function getMultiAspectColor(
  aspect1: AspectType,
  aspect2: AspectType,
  aspect3?: AspectType
): string {
  let fromClass;
  switch (aspect1) {
    case "BLOOM":
      fromClass = "from-bloom";
      break;
    case "CALLOUS":
      fromClass = "from-callous";
      break;
    case "GRACE":
      fromClass = "from-grace";
      break;
    case "LAW":
      fromClass = "from-law";
      break;
    case "MYTHIC":
      fromClass = "from-mythic";
      break;
    case "RELIC":
      fromClass = "from-relic";
      break;
    case "TIDE":
      fromClass = "from-tide";
      break;
    case "WEIRD":
      fromClass = "from-weird";
      break;
    case "XENO":
      fromClass = "from-xeno";
      break;
    case "ZEAL":
      fromClass = "from-zeal";
      break;
    default:
      fromClass = "from-fundamental";
      break;
  }
  let viaClass;
  if (aspect3) {
    switch (aspect2) {
      case "BLOOM":
        viaClass = " via-bloom ";
        break;
      case "CALLOUS":
        viaClass = " via-callous ";
        break;
      case "GRACE":
        viaClass = " via-grace ";
        break;
      case "LAW":
        viaClass = " via-law ";
        break;
      case "MYTHIC":
        viaClass = " via-mythic ";
        break;
      case "RELIC":
        viaClass = " via-relic ";
        break;
      case "TIDE":
        viaClass = " via-tide ";
        break;
      case "WEIRD":
        viaClass = " via-weird ";
        break;
      case "XENO":
        viaClass = " via-xeno ";
        break;
      case "ZEAL":
        viaClass = " via-zeal ";
        break;
      default:
        break;
    }
  }
  let toClass;
  const toAspect = aspect3 || aspect2;
  switch (toAspect) {
    case "BLOOM":
      toClass = "to-bloom";
      break;
    case "CALLOUS":
      toClass = "to-callous";
      break;
    case "GRACE":
      toClass = "to-grace";
      break;
    case "LAW":
      toClass = "to-law";
      break;
    case "MYTHIC":
      toClass = "to-mythic";
      break;
    case "RELIC":
      toClass = "to-relic";
      break;
    case "TIDE":
      toClass = "to-tide";
      break;
    case "WEIRD":
      toClass = "to-weird";
      break;
    case "XENO":
      toClass = "to-xeno";
      break;
    case "ZEAL":
      toClass = "to-zeal";
      break;
    default:
      toClass = "to-fundamental";
      break;
  }
  if (aspect3) {
    return `bg-linear-110/oklab ${fromClass} ${viaClass} ${toClass} from-30% via-50% to-70%`;
  }
  return `bg-linear-110/oklab ${fromClass} ${toClass} from-40% to-60%`;
}
