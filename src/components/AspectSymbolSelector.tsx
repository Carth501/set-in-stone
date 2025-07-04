import React from "react";
import { ALL_ASPECTS, type Aspect, AspectIcons } from "../aspects/aspects";

type Props = {
  aspects?: Aspect[];
  selectedIndex?: number;
  onSelect: (index: number) => void;
  aspectCounts?: Partial<Record<Aspect, number>>;
  vertical?: boolean;
};

const AspectSymbolSelector: React.FC<Props> = ({
  aspects = ALL_ASPECTS,
  selectedIndex,
  onSelect,
  aspectCounts,
  vertical = false,
}) => (
  <div className={`flex ${vertical ? "flex-col" : "flex-row"} gap-4`}>
    {aspects.map((aspect, idx) => {
      const count = aspectCounts?.[aspect];
      if (aspectCounts && (count === undefined || count === 0 || count < 0)) {
        return null;
      }
      return (
        <div key={aspect} className="flex flex-col items-center">
          <button
            type="button"
            className={`rounded-full w-12 h-12 flex items-center justify-center border-2 transition
              ${
                selectedIndex === idx
                  ? "border-blue-500 ring-2 ring-blue-300"
                  : "border-gray-400"
              }
              bg-gray-800 hover:bg-gray-700`}
            onClick={() => onSelect(idx)}
          >
            <img
              src={AspectIcons[aspect]}
              alt={aspect}
              className="w-8 h-8 object-contain"
            />
          </button>
          {aspectCounts && count && count > 0 && (
            <span className="text-xs mt-1 text-center">{count}</span>
          )}
        </div>
      );
    })}
  </div>
);

export default AspectSymbolSelector;
