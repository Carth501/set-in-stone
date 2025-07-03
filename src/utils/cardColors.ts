import type { Aspect } from "../aspects/aspects";
import type { CardCost } from "../types/Card";

export function getCardColorClass(aspectList: CardCost): string {
  const aspectsWithCost = Object.entries(aspectList)
    .sort(([aspectA], [aspectB]) => aspectA.localeCompare(aspectB))
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

export function getDoubleAspectColor(aspect1: Aspect, aspect2: Aspect): string {
  let fromClass;
  switch (aspect1) {
    case "BLOOM":
      fromClass = "from-bloom";
      break;
    case "CALLOUS":
      fromClass = "from-callous";
      break;
    case "LAW":
      fromClass = "from-law";
      break;
    case "TIDE":
      fromClass = "from-tide";
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
    case "LAW":
      toClass = "to-law";
      break;
    case "TIDE":
      toClass = "to-tide";
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
