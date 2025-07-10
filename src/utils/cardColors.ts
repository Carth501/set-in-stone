import type { Aspect } from "../aspects/aspects";
import type { CardCost } from "../types/Card";

export function getCardColorClass(aspectList: CardCost): string {
  const aspectsWithCost = Object.entries(aspectList)
    .filter(([, count]) => count > 0)
    .filter(([aspect]) => aspect !== "FUNDAMENTAL")
    .map(([aspect]) => aspect as Aspect);

  if (aspectsWithCost.length === 0) {
    return "bg-fundamental";
  }

  if (aspectsWithCost.length === 1) {
    return getSingleAspectColor(aspectsWithCost[0]);
  }

  if (aspectsWithCost.length === 2) {
    const [first, second] = aspectsWithCost;
    return getDoubleAspectColor(first, second);
  }

  return "bg-poly";
}

export function getSingleAspectColor(aspect: Aspect): string {
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
    case "OCCULT":
      return "bg-occult";
    case "RELIC":
      return "bg-relic";
    case "TIDE":
      return "bg-tide";
    case "XENO":
      return "bg-xeno";
    case "ZEAL":
      return "bg-zeal";
    default:
      return "bg-fundamental";
  }
}

export function getDoubleAspectColor(aspect1: Aspect, aspect2: Aspect): string {
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
    case "OCCULT":
      fromClass = "from-occult";
      break;
    case "RELIC":
      fromClass = "from-relic";
      break;
    case "TIDE":
      fromClass = "from-tide";
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
  let toClass;
  switch (aspect2) {
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
    case "OCCULT":
      toClass = "to-occult";
      break;
    case "RELIC":
      toClass = "to-relic";
      break;
    case "TIDE":
      toClass = "to-tide";
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
  return `bg-linear-110/oklab ${fromClass} from-40% ${toClass} to-60%`;
}
