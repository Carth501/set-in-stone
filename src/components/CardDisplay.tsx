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
        <div className="card-header bg-gray-800/25 rounded px-2">
          <div className="header-left">
            <div className="card-name max-w-330px max-h-72px wrap-break-word">
              {card.name}
            </div>
            <div className="card-type">{card.type}</div>
          </div>
          <span className="card-costs">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5em",
                maxWidth: 120,
                justifyContent: "flex-end",
              }}
            >
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
          </span>
        </div>
        <div style={{ flex: 1, marginBottom: 16 }}>{card.description}</div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            fontWeight: "bold",
            fontSize: "3em",
          }}
        >
          <span>{card.offence}</span>
          <span>{card.defence}</span>
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;
