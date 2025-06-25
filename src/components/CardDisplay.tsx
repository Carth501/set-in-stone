import React from "react";
import type { Card } from "../types/Card";

type Props = {
  card: Card;
  style?: React.CSSProperties;
  className?: string;
};

const CardDisplay: React.FC<Props> = ({ card, style, className }) => (
  <div
    className={className}
    style={{
      width: 400,
      height: 600,
      background: "#000",
      border: "2px solid #333",
      borderRadius: 16,
      padding: 24,
      boxSizing: "border-box",
      fontFamily: "sans-serif",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      ...style,
    }}
  >
    <h2 style={{ margin: "0 0 16px 0" }}>{card.name}</h2>
    <div style={{ marginBottom: 16 }}>
      <strong>Cost:</strong>
      <ul style={{ margin: "8px 0 0 0", padding: "0 0 0 16px" }}>
        {Object.entries(card.cost).map(([key, value]) => (
          <li key={key}>
            {key}: {value}
          </li>
        ))}
      </ul>
    </div>
    <div style={{ flex: 1, marginBottom: 16 }}>{card.description}</div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontWeight: "bold",
      }}
    >
      <span>Offence: {card.offence}</span>
      <span>Defence: {card.defence}</span>
    </div>
  </div>
);

export default CardDisplay;
