import React from "react";
import { ALL_ASPECTS, AspectIcons, type Aspect } from "../aspects/aspects";
import type { Card } from "../types/Card";
import { getCardColorClass } from "../utils/cardColors";
import "./Card.css";

type Props = {
  card: Card;
  style?: React.CSSProperties;
  className?: string;
  onFieldClick?: (field: string) => void;
  removeAspect?: (index: number) => void;
  editableElements?: {
    name?: React.ReactNode;
    type?: React.ReactNode;
    description?: React.ReactNode;
    offence?: React.ReactNode;
    defence?: React.ReactNode;
    regeneration?: React.ReactNode;
  };
};

const CardDisplay: React.FC<Props> = ({
  card,
  className,
  onFieldClick,
  removeAspect,
  editableElements = {},
}) => {
  const cardColorClass = getCardColorClass(card.aspectList);

  const handleFieldClick = (field: string) => {
    if (onFieldClick) {
      onFieldClick(field);
    }
  };

  return (
    <div className="card-container">
      <div className={`card ${cardColorClass} ${className}`}>
        <div className="grid grid-cols-8 grid-rows-8 gap-2 w-full h-full text-gray-100">
          <div className="col-span-7 row-span-7 flex flex-col gap-2">
            <div className="card-header bg-gray-800/50 rounded-xl text-left p-2 shrink-0">
              <div className="text-2xl font-bold overflow-ellipsis">
                {editableElements.name || (
                  <div
                    onClick={() => handleFieldClick("name")}
                    className={
                      "min-h-8" + (onFieldClick ? " cursor-pointer" : "")
                    }
                  >
                    {card.name}
                  </div>
                )}
              </div>
              <div className="text-lg font-bold">
                {editableElements.type || (
                  <div
                    onClick={() => handleFieldClick("type")}
                    className={onFieldClick ? "cursor-pointer" : ""}
                  >
                    {card.type}
                  </div>
                )}
              </div>
            </div>
            <div className="card-description bg-gray-800/50 text-left rounded-xl p-2 grow-1">
              {editableElements.description || (
                <div
                  onClick={() => handleFieldClick("description")}
                  className={
                    "h-full w-full " + (onFieldClick ? "cursor-pointer" : "")
                  }
                >
                  {card.description}
                </div>
              )}
            </div>
          </div>
          <div className="col-start-8 row-start-1 row-end-8 flex flex-col bg-gray-800/50 rounded-xl pt-1">
            <div className="flex flex-col gap-0.75 items-center">
              {Object.entries(card.aspectList ?? {})
                .sort(([aspectA], [aspectB]) => aspectA.localeCompare(aspectB))
                .flatMap(([aspect, count]) =>
                  count > 0
                    ? Array.from({ length: count }).map((_, i) => (
                        <img
                          key={aspect + "-" + i}
                          src={AspectIcons[aspect as keyof typeof AspectIcons]}
                          alt={aspect}
                          style={{ width: 32, height: 32 }}
                          onClick={() =>
                            removeAspect &&
                            removeAspect(ALL_ASPECTS.indexOf(aspect as Aspect))
                          }
                          className={
                            removeAspect
                              ? "cursor-pointer hover:opacity-75"
                              : ""
                          }
                        />
                      ))
                    : []
                )}
            </div>
          </div>
          <div
            className="col-start-1 col-span-2 row-start-8 row-end-8 bg-gray-800/50 font-bold 
		  text-5xl rounded-xl p-2 text-center w-full h-full flex items-center justify-center"
          >
            {editableElements.offence || (
              <div
                onClick={() => handleFieldClick("offence")}
                className={onFieldClick ? "cursor-pointer" : ""}
              >
                {card.offence}
              </div>
            )}
          </div>
          <div
            className="col-start-3 col-span-2 row-start-8 row-end-8 bg-gray-800/50 font-bold 
		  text-5xl rounded-xl p-2 text-center w-full h-full flex items-center justify-center"
          >
            {editableElements.defence || (
              <div
                onClick={() => handleFieldClick("defence")}
                className={onFieldClick ? "cursor-pointer" : ""}
              >
                {card.defence}
              </div>
            )}
          </div>
          <div
            className="col-start-5 col-span-2 row-start-8 row-end-8 bg-gray-800/50 font-bold 
			text-5xl rounded-xl p-2 text-center w-full h-full flex items-center justify-center"
          >
            {editableElements.regeneration || (
              <div
                onClick={() => handleFieldClick("regeneration")}
                className={onFieldClick ? "cursor-pointer" : ""}
              >
                {card.regeneration > 0 && `+`}
                {card.regeneration}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;
