import { capitalizeFirstLetter } from "@/utils/generalUtils";
import React from "react";
import { ALL_ASPECTS, AspectIcons, type Aspect } from "../aspects/aspects";
import { MAX_ASPECT_ICONS } from "../constants/cardConstants";
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
    tags?: React.ReactNode;
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

  const renderFundamentalAspect = (aspect: string, count: number) => (
    <div key={aspect} className="relative">
      <img
        src={AspectIcons[aspect as keyof typeof AspectIcons]}
        alt={aspect}
        onClick={() =>
          removeAspect && removeAspect(ALL_ASPECTS.indexOf(aspect as Aspect))
        }
        className={
          "w-8 h-8" + (removeAspect ? "cursor-pointer hover:opacity-75" : "")
        }
      />
      <div
        className="absolute inset-0 flex items-center justify-center text-black 
        font-bold text-lg pointer-events-none"
      >
        {count}
      </div>
    </div>
  );

  const renderRegularAspects = (aspect: string, count: number) =>
    Array.from({ length: count }).map((_, i) => (
      <img
        key={aspect + "-" + i}
        src={AspectIcons[aspect as keyof typeof AspectIcons]}
        alt={aspect}
        onClick={() =>
          removeAspect && removeAspect(ALL_ASPECTS.indexOf(aspect as Aspect))
        }
        className={
          "w-8 h-8" + (removeAspect ? "cursor-pointer hover:opacity-75" : "")
        }
      />
    ));

  const renderAspectIcons = () => {
    const allIcons = Object.entries(card.aspectList ?? {}).flatMap(
      ([aspect, count]) => {
        if (count <= 0) return [];

        if (aspect === "FUNDAMENTAL") {
          return renderFundamentalAspect(aspect, count);
        }

        return renderRegularAspects(aspect, count);
      }
    );

    return allIcons.slice(0, MAX_ASPECT_ICONS);
  };

  const cardHeader = () => {
    return (
      <div className="card-header bg-gray-800/50 rounded-xl text-left p-2 shrink-0">
        <div className="text-2xl font-bold overflow-ellipsis">
          {editableElements.name || (
            <div
              onClick={() => handleFieldClick("name")}
              className={"min-h-8" + (onFieldClick ? " cursor-pointer" : "")}
            >
              {card.name}
            </div>
          )}
        </div>
        <div className="text-lg font-bold flex flex-wrap gap-1 items-center">
          {editableElements.type || (
            <div
              onClick={() => handleFieldClick("type")}
              className={onFieldClick ? "cursor-pointer" : ""}
            >
              {card.type}
            </div>
          )}
          {editableElements.tags || (
            <>
              {card.tags.map((tag, index) => (
                <div
                  key={index}
                  onClick={() => handleFieldClick("tags")}
                  className={
                    "bg-gray-600 px-2 py-1 rounded text-sm " +
                    (onFieldClick ? "cursor-pointer" : "")
                  }
                >
                  {capitalizeFirstLetter(tag)}
                </div>
              ))}
              {card.tags.length === 0 && onFieldClick && (
                <div
                  onClick={() => handleFieldClick("tags")}
                  className="text-gray-400 cursor-pointer text-sm"
                  data-html2canvas-ignore="true"
                >
                  +Add tags
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const cardDescriptionPanel = () => {
    return (
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
    );
  };

  const renderStatField = (
    field: string,
    value: number,
    colStart: number,
    colSpan: number,
    showPlus = false
  ) => (
    <div
      className={`col-start-${colStart} col-span-${colSpan} row-start-8 row-end-8 bg-gray-800/50 font-bold 
      text-5xl rounded-xl p-2 text-center w-full h-full flex items-center justify-center`}
    >
      {editableElements[field as keyof typeof editableElements] || (
        <div
          onClick={() => handleFieldClick(field)}
          className={"w-full h-full " + (onFieldClick ? "cursor-pointer" : "")}
        >
          {showPlus && value > 0 && "+"}
          {value}
        </div>
      )}
    </div>
  );

  return (
    <div className="card-container" id="card-preview">
      <div className={`card ${cardColorClass} ${className}`}>
        <div className="grid grid-cols-9 grid-rows-8 gap-2 w-full h-full text-gray-100">
          <div
            className={`col-span-8 flex flex-col gap-2 ${
              card.type === "CREATURE" ? "row-span-7" : "row-span-8"
            }`}
          >
            {cardHeader()}
            {cardDescriptionPanel()}
          </div>
          <div
            className={`col-start-9 flex flex-col bg-gray-800/50 rounded-xl pt-1 ${
              card.type === "CREATURE" ? "row-span-7" : "row-span-8"
            }`}
          >
            <div className="flex flex-col gap-0.75 items-center">
              {renderAspectIcons()}
            </div>
          </div>

          {card.type === "CREATURE" && (
            <>
              {renderStatField("offence", card.offence, 1, 3)}
              {renderStatField("defence", card.defence, 4, 3)}
              {renderStatField("regeneration", card.regeneration, 7, 3, true)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;
