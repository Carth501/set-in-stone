import React, { useState } from "react";
import type { Card } from "../types/Card.tsx";

type Props = {
  card: Card;
  onChange: (card: Card) => void;
};

const CardEditForm: React.FC<Props> = ({ card, onChange }) => {
  // For adding a new cost entry
  const [newCostKey, setNewCostKey] = useState("");
  const [newCostValue, setNewCostValue] = useState("");

  const handleCostKeyChange = () => {};

  const handleCostValueChange = (key: string, value: string) => {
    onChange({ ...card, cost: { ...card.cost, [key]: Number(value) || 0 } });
  };

  const handleRemoveCost = () => {};

  const handleAddCost = () => {
    if (!newCostKey || newCostKey in card.cost) return;
    onChange({
      ...card,
      cost: { ...card.cost, [newCostKey]: Number(newCostValue) || 0 },
    });
    setNewCostKey("");
    setNewCostValue("");
  };

  return (
    <form className="flex flex-col gap-2">
      <div>
        <label>Type:</label>
        <select
          className="bg-gray-700 ml-4 rounded p-2"
          value={card.type}
          onChange={(e) =>
            onChange({ ...card, type: e.target.value as Card["type"] })
          }
        >
          <option value="CREATURE">Creature</option>
          <option value="ENCHANTMENT">Enchantment</option>
          <option value="DEVICE">Device</option>
          <option value="REACTION">Reaction</option>
          <option value="FAST">Fast</option>
          <option value="SLOW">Slow</option>
        </select>
      </div>
      <div>
        <label>Name:</label>
        <input
          className="bg-gray-700 ml-4 rounded p-2"
          type="text"
          value={card.name}
          onChange={(e) => onChange({ ...card, name: e.target.value })}
        />
      </div>
      <div>
        <label>Cost:</label>
        {Object.entries(card.cost).map(([key, value]) => (
          <div key={key} style={{ display: "flex", gap: 4, marginBottom: 4 }}>
            <input
              type="text"
              value={key}
              onChange={() => handleCostKeyChange()}
              className="bg-gray-700 ml-4 rounded p-2 w-80"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => handleCostValueChange(key, e.target.value)}
              className="bg-gray-700 ml-4 rounded p-2 w-80"
            />
            <button type="button" onClick={() => handleRemoveCost()}>
              Remove
            </button>
          </div>
        ))}
        <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
          <input
            type="text"
            placeholder="New Key"
            value={newCostKey}
            onChange={(e) => setNewCostKey(e.target.value)}
            className="bg-gray-700 ml-4 rounded p-2 w-80"
          />
          <input
            type="text"
            placeholder="New Value"
            value={newCostValue}
            onChange={(e) => setNewCostValue(e.target.value)}
            className="bg-gray-700 ml-4 rounded p-2 w-80"
          />
          <button type="button" onClick={handleAddCost}>
            Add Cost
          </button>
        </div>
      </div>
      <div>
        <label>Description:</label>
        <textarea
          className="bg-gray-700 ml-4 rounded p-2 w-200"
          value={card.description}
          onChange={(e) => onChange({ ...card, description: e.target.value })}
        />
      </div>
      <div>
        <label>Offence:</label>
        <input
          className="bg-gray-700 ml-4 rounded p-2"
          type="number"
          value={card.offence}
          onChange={(e) =>
            onChange({ ...card, offence: parseInt(e.target.value) || 0 })
          }
        />
      </div>
      <div>
        <label>Defence:</label>
        <input
          className="bg-gray-700 ml-4 rounded p-2"
          type="number"
          value={card.defence}
          onChange={(e) =>
            onChange({ ...card, defence: parseInt(e.target.value) || 0 })
          }
        />
      </div>
    </form>
  );
};

export default CardEditForm;
