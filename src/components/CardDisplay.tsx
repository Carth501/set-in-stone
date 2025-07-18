import { capitalizeFirstLetter } from "@/utils/generalUtils";
import React from "react";
import { ASPECTS, Icons, type AspectType } from "../aspects/aspects";
import { MAX_ASPECT_ICONS } from "../constants/cardConstants";
import { getTexture, type TextureConfig, type TextureType } from "../textures";
import type { Card } from "../types/Card";
import { getCardColorClass } from "../utils/cardColors";
import {
  interpolateIcons,
  renderFundamentalAspect,
} from "../utils/iconInterpolation";
import "./Card.css";

type Props = {
  card: Card;
  style?: React.CSSProperties;
  className?: string;
  onFieldClick?: (field: string) => void;
  removeAspect?: (index: number) => void;
  textureType?: TextureType;
  textureConfig?: TextureConfig;
  editableElements?: {
    name?: React.ReactNode;
    type?: React.ReactNode;
    tags?: React.ReactNode;
    art?: React.ReactNode;
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
  textureType = "none",
  textureConfig = {},
  editableElements = {},
}) => {
  const cardColorClass = getCardColorClass(card.aspectList);
  const textureFunction = getTexture(textureType);

  const handleFieldClick = (field: string) => {
    if (onFieldClick) {
      onFieldClick(field);
    }
  };

  const renderRegularAspects = (aspect: string, count: number) =>
    Array.from({ length: count }).map((_, i) => (
      <img
        key={aspect + "-" + i}
        src={Icons[aspect as keyof typeof Icons]}
        alt={aspect}
        onClick={() =>
          removeAspect && removeAspect(ASPECTS.indexOf(aspect as AspectType))
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
          return (
            <div key={aspect} className="relative">
              {renderFundamentalAspect(
                aspect,
                count,
                8,
                () =>
                  removeAspect &&
                  removeAspect(ASPECTS.indexOf(aspect as AspectType))
              )}
            </div>
          );
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

  const cardArt = () => {
    return (
      <div
        className="card-art bg-gray-800/50 rounded-xl overflow-hidden h-48"
        data-html2canvas-ignore={!card.art}
        onClick={() => handleFieldClick("art")}
      >
        {editableElements.art || (
          <>
            {card.art && (
              <img
                src={card.art}
                alt={card.name}
                className="w-full object-cover"
              />
            )}
            {!card.art && (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Click to add art
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const cardDescriptionPanel = () => {
    return (
      <div className="card-description bg-gray-800/50 text-left rounded-xl px-2 py-1 grow-1 overflow-hidden">
        {editableElements.description || (
          <div
            onClick={() => handleFieldClick("description")}
            className={
              "h-full w-full whitespace-pre-wrap overflow-y-hidden " +
              (onFieldClick ? "cursor-pointer" : "")
            }
          >
            {interpolateIcons(card.description)}
          </div>
        )}
      </div>
    );
  };

  const renderStatField = (
    field: string,
    value: number,
    colStart: number,
    showPlus = false
  ) => (
    <div
      className={`col-start-${colStart} col-span-3 row-start-8 row-end-8 bg-gray-800/50 font-bold 
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
      <div
        className={`card ${cardColorClass} ${className}`}
        style={{ position: "relative" }}
      >
        {textureFunction && textureFunction(textureConfig)}
        <div className="grid grid-cols-9 grid-rows-8 gap-2 w-full h-full text-gray-100 relative z-10">
          <div
            className={`col-span-8 flex flex-col gap-2 ${
              card.type === "CREATURE" ? "row-span-7" : "row-span-8"
            }`}
          >
            {cardHeader()}
            {cardArt()}
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
              {renderStatField("offence", card.offence, 1)}
              {renderStatField("defence", card.defence, 4)}
              {renderStatField("regeneration", card.regeneration, 7, true)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;
