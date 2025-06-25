import React from "react";
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
        <h2 className="card-name">{card.name}</h2>
        <span className="card-costs">
          <ul style={{ margin: "8px 0 0 0", padding: "0 0 0 16px" }}>
            {Object.entries(card.cost).map(([key, value]) => (
              <li key={key}>
                {key}: {value}
              </li>
            ))}
          </ul>
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
