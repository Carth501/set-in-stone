import React from "react";
import { AspectIcons } from "../aspects/aspects";
import type { Card } from "../types/Card";
import "./Card.css";

type Props = {
  card: Card;
  style?: React.CSSProperties;
  className?: string;
};

const CardDisplay: React.FC<Props> = ({ card, className }) => (
  <div className="card-container">
    <div className={`card ${className}`}>
      <div className="card-header">
        <div className="header-left">
          <div className="card-type">{card.type}</div>
          <div className="card-name">{card.name}</div>
        </div>
        <span className="card-costs">
          <div style={{ display: "flex", gap: "0.5em" }}>
            {Object.entries(card.aspectList ?? {}).flatMap(([aspect, count]) =>
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

export default CardDisplay;
