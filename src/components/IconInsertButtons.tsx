import React from "react";
import { ALL_ASPECTS, AspectIcons } from "../aspects/aspects";
import { REVERSE_ICON_CODES } from "../utils/iconInterpolation";

type Props = {
  onIconInsert: (iconCode: string) => void;
};

const IconInsertButtons: React.FC<Props> = ({ onIconInsert }) => {
  return (
    <div
      className="flex flex-col gap-1 p-2 bg-gray-700 rounded-lg"
      data-html2canvas-ignore="true"
    >
      <div className="text-xs text-gray-300 mb-1">Insert Icons:</div>
      {ALL_ASPECTS.map((aspect) => (
        <button
          key={aspect}
          onClick={() => onIconInsert(REVERSE_ICON_CODES[aspect])}
          className="flex items-center gap-1 p-1 bg-gray-600 hover:bg-gray-500 rounded text-xs"
          title={`Insert ${aspect} icon`}
        >
          <img src={AspectIcons[aspect]} alt={aspect} className="w-4 h-4" />
          <span>{REVERSE_ICON_CODES[aspect]}</span>
        </button>
      ))}
    </div>
  );
};

export default IconInsertButtons;
