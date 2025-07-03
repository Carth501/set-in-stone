import React from "react";
import { AspectIcons } from "../aspects/aspects";
import type { Card } from "../types/Card";
import { getCardColorClass } from "../utils/cardColors";
import "./Card.css";

type Props = {
  card: Card;
  style?: React.CSSProperties;
  className?: string;
};

const CardDisplay: React.FC<Props> = ({ card, className }) => {
  const cardColorClass = getCardColorClass(card.aspectList);

  return (
    <div className="card-container">
      <div className={`card ${cardColorClass} ${className}`}>
        <div className="grid grid-cols-8 grid-rows-8 gap-2 w-full h-full">
          <div className="col-span-7 row-span-7 flex flex-col gap-2">
            <div className="card-header bg-gray-800/50 rounded-xl text-left p-2 shrink-0">
              <div className="text-2xl font-bold overflow-ellipsis min-h-8">
                {card.name}
              </div>
              <div className="text-lg font-bold">{card.type}</div>
            </div>
            <div className="card-description bg-gray-800/50 text-left rounded-xl p-2 grow-1">
              {card.description}
            </div>
          </div>
          <div className="col-start-8 row-start-1 row-end-8 flex flex-col bg-gray-800/50 rounded-xl pt-1">
            <div className="flex flex-col gap-0.75 items-center">
              {Object.entries(card.aspectList ?? {}).flatMap(
                ([aspect, count]) =>
                  count > 0
                    ? Array.from({ length: count }).map((_, i) => (
                        <img
                          key={aspect + "-" + i}
                          src={AspectIcons[aspect as keyof typeof AspectIcons]}
                          alt={aspect}
                          style={{ width: 32, height: 32 }}
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
            {card.offence}
          </div>
          <div
            className="col-start-3 col-span-2 row-start-8 row-end-8 bg-gray-800/50 font-bold 
		  text-5xl rounded-xl p-2 text-center w-full h-full flex items-center justify-center"
          >
            {card.defence}
          </div>
          {card.regeneration > 0 && (
            <div
              className="col-start-5 col-span-2 row-start-8 row-end-8 bg-gray-800/50 font-bold 
			text-5xl rounded-xl p-2 text-center w-full h-full flex items-center justify-center"
            >
              +{card.regeneration}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;
