import React from "react";
import { ASPECTS, Icons, type AspectType } from "../aspects/aspects";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  aspectMask: number;
  onAspectMaskChange: (newMask: number) => void;
  className?: string;
  filterOutFundamental?: boolean;
  vertical?: boolean;
};

const AspectToggle: React.FC<Props> = ({
  aspectMask,
  onAspectMaskChange,
  className = "",
  filterOutFundamental,
  vertical,
}) => {
  const isAspectEnabled = (aspect: AspectType): boolean => {
    return (aspectMask & (1 << ASPECTS.indexOf(aspect))) !== 0;
  };

  const toggleAspect = (aspect: AspectType): void => {
    const newMask = aspectMask ^ (1 << ASPECTS.indexOf(aspect));
    onAspectMaskChange(newMask);
  };

  return (
    <div
      className={`flex flex-wrap gap-2 ${className} ${
        vertical ? "flex-col" : "flex-row"
      }`}
    >
      {ASPECTS.map((aspect) => {
        if (filterOutFundamental && aspect === "FUNDAMENTAL") {
          return null;
        }
        const isEnabled = isAspectEnabled(aspect);

        return (
          <div key={aspect}>
            <Tooltip>
              <TooltipTrigger
                onClick={() => toggleAspect(aspect)}
                className={`rounded-full w-11 h-11 flex items-center justify-center border-2 transition
              ${
                isEnabled
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
              <TooltipContent sideOffset={4} side="bottom">
                {aspect}
              </TooltipContent>
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
};

export default AspectToggle;
