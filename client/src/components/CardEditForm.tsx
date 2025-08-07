import React from "react";
import { ALL_ASPECTS } from "../aspects/aspects.ts";
import type { Card } from "../types/Card.tsx";
import AspectSymbolSelector from "./AspectSymbolSelector.tsx";

type Props = {
  card: Card;
  onChange: (card: Card) => void;
};

const CardEditForm: React.FC<Props> = ({ card, onChange }) => {
  // Add aspect to aspectList or increment its value
  const handleAddAspect = (idx: number) => {
    const aspect = ALL_ASPECTS[idx];
    const current = card.aspectList?.[aspect] ?? 0;
    onChange({
      ...card,
      aspectList: { ...card.aspectList, [aspect]: current + 1 },
    });
  };

  // Decrement aspect in aspectList, remove if <= 0
  const handleRemoveAspect = (idx: number) => {
    const aspect = ALL_ASPECTS[idx];
    const current = card.aspectList?.[aspect] ?? 0;
    onChange({
      ...card,
      aspectList: { ...card.aspectList, [aspect]: current - 1 },
    });
  };

  return (
    <form className="flex flex-col gap-2">
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
        <label>Cost:</label>
        <AspectSymbolSelector onSelect={handleAddAspect} />
        <div className="mt-2">
          <AspectSymbolSelector
            onSelect={handleRemoveAspect}
            aspectCounts={card.aspectList}
          />
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
      <div>
        <label>Regeneration:</label>
        <input
          className="bg-gray-700 ml-4 rounded p-2"
          type="number"
          value={card.regeneration}
          onChange={(e) =>
            onChange({ ...card, regeneration: parseInt(e.target.value) || 0 })
          }
        />
      </div>
    </form>
  );
};

export default CardEditForm;
