import React from "react";
import { ALL_ASPECTS, type Aspect, AspectIcons } from "../aspects/aspects";

type Props = {
  aspects?: Aspect[];
  selectedIndex?: number;
  onSelect: (index: number) => void;
};

const AspectSymbolSelector: React.FC<Props> = ({
  aspects = ALL_ASPECTS,
  selectedIndex,
  onSelect,
}) => (
  <div className="flex flex-row gap-4">
    {aspects.map((aspect, idx) => (
      <button
        key={aspect}
        type="button"
        className={`rounded-full w-12 h-12 flex items-center justify-center border-2 transition p-px
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
    ))}
  </div>
);

export default AspectSymbolSelector;
