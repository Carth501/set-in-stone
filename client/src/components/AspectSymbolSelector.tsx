import React from "react";
import { ASPECTS, type AspectType, Icons } from "../aspects/aspects";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  aspects?: AspectType[];
  selectedIndex?: number;
  onSelect: (index: number) => void;
  aspectCounts?: Partial<Record<AspectType, number>>;
  vertical?: boolean;
};

const AspectSymbolSelector: React.FC<Props> = ({
  aspects = ASPECTS,
  selectedIndex,
  onSelect,
  aspectCounts,
  vertical = false,
}) => (
  <div
    className={`flex ${vertical ? "flex-col" : "flex-row"} gap-4`}
    id="aspect-symbol-selector"
  >
    {aspects.map((aspect, idx) => {
      const count = aspectCounts?.[aspect];
      if (aspectCounts && (count === undefined || count === 0 || count < 0)) {
        return null;
      }
      return (
        <div key={aspect} className="flex flex-col items-center">
          <Tooltip>
            <TooltipTrigger
              onClick={() => onSelect(idx)}
              className={`rounded-full w-11 h-11 flex items-center justify-center border-2 transition
              ${
                selectedIndex === idx
                  ? "border-blue-500 ring-2 ring-blue-300"
                  : "border-gray-400"
              }
              bg-gray-800 hover:bg-gray-700`}
            >
              <img
                src={Icons[aspect]}
                alt={aspect}
                className="w-8 h-8 object-contain"
              />
            </TooltipTrigger>
            <TooltipContent sideOffset={4} side="right">
              {aspect}
            </TooltipContent>
          </Tooltip>
          {aspectCounts && count && count > 0 && (
            <span className="text-xs mt-1 text-center">{count}</span>
          )}
        </div>
      );
    })}
  </div>
);

export default AspectSymbolSelector;
