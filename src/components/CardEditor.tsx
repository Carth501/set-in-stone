import { ALL_ASPECTS } from "@/aspects/aspects";
import React, { useState } from "react";
import type { Card, CardType } from "../types/Card";
import AspectSymbolSelector from "./AspectSymbolSelector";
import CardDisplay from "./CardDisplay";
import CardTypeSelector from "./CardTypeSelector";

type Props = {
  card: Card;
  onCardChange: (updatedCard: Card) => void;
  className?: string;
};

const CardEditor: React.FC<Props> = ({ card, onCardChange, className }) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>("");

  const startEditing = (field: string) => {
    setEditingField(field);
    const currentValue = card[field as keyof Card];
    setTempValue(currentValue?.toString() || "");
  };

  const saveEdit = () => {
    if (!editingField) return;

    const updatedCard = { ...card };

    if (
      editingField === "offence" ||
      editingField === "defence" ||
      editingField === "regeneration"
    ) {
      (updatedCard as Card)[editingField] = parseInt(tempValue) || 0;
    } else if (editingField === "name" || editingField === "description") {
      (updatedCard as Card)[editingField] = tempValue;
    }

    onCardChange(updatedCard);
    setEditingField(null);
    setTempValue("");
  };

  const handleCardTypeChange = (cardType: CardType) => {
    const updatedCard = { ...card, type: cardType };
    onCardChange(updatedCard);
    setEditingField(null);
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const getEditableElements = () => {
    const elements: { [key: string]: React.ReactNode } = {};

    if (editingField === "name") {
      elements.name = (
        <input
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
          className="w-full bg-gray-700 text-white rounded px-2 py-1 text-2xl font-bold"
          autoFocus
        />
      );
    }

    if (editingField === "type") {
      elements.type = (
        <CardTypeSelector value={card.type} onChange={handleCardTypeChange} />
      );
    }

    if (editingField === "description") {
      elements.description = (
        <textarea
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
          className="w-full h-full bg-gray-700 text-white rounded px-2 py-1 resize-none"
          autoFocus
        />
      );
    }

    if (editingField === "offence") {
      elements.offence = (
        <input
          type="number"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
          className="w-full bg-gray-700 text-white rounded px-2 py-1 text-5xl font-bold text-center"
          autoFocus
        />
      );
    }

    if (editingField === "defence") {
      elements.defence = (
        <input
          type="number"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
          className="w-full bg-gray-700 text-white rounded px-2 py-1 text-5xl font-bold text-center"
          autoFocus
        />
      );
    }

    if (editingField === "regeneration") {
      elements.regeneration = (
        <input
          type="number"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
          className="w-full bg-gray-700 text-white rounded px-2 py-1 text-5xl font-bold text-center"
          autoFocus
        />
      );
    }

    return elements;
  };

  function handleAspectChange(index: number): void {
    onCardChange(incrementAspectByIndex(index));
  }

  const incrementAspectByIndex = (aspectIndex: number): Card => {
    if (aspectIndex < 0 || aspectIndex >= ALL_ASPECTS.length) {
      return card;
    }

    const aspectCode = ALL_ASPECTS[aspectIndex];
    const updatedAspectList = { ...card.aspectList };

    updatedAspectList[aspectCode] = (updatedAspectList[aspectCode] || 0) + 1;

    return {
      ...card,
      aspectList: updatedAspectList,
    };
  };

  return (
    <div className="flex flex-row">
      <CardDisplay
        card={card}
        className={className}
        onFieldClick={startEditing}
        editableElements={getEditableElements()}
      />
      <AspectSymbolSelector vertical={true} onSelect={handleAspectChange} />
    </div>
  );
};

export default CardEditor;
