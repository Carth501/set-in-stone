import { ASPECTS, sortAspectRecord } from "@/aspects/aspects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalizeFirstLetter } from "@/utils/generalUtils";
import React, { useState } from "react";
import { MAX_ASPECT_ICONS } from "../constants/cardConstants";
import { type TextureType, TEXTURE_OPTIONS } from "../textures";
import type { Card, CardType } from "../types/Card";
import { insertIconCode } from "../utils/iconInterpolation";
import AspectSymbolSelector from "./AspectSymbolSelector";
import CardDisplay from "./CardDisplay";
import CardTypeSelector from "./CardTypeSelector";
import IconInsertButtons from "./IconInsertButtons";

type Props = {
  card: Card;
  onCardChange: (updatedCard: Card) => void;
  className?: string;
};

const CardEditor: React.FC<Props> = ({ card, onCardChange, className }) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>("");
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(
    null
  );
  const [selectedTexture, setSelectedTexture] = useState<TextureType>("none");

  const startEditing = (field: string) => {
    setEditingField(field);
    if (field === "tags") {
      setTempValue(
        card.tags.map((tag) => capitalizeFirstLetter(tag)).join(", ")
      );
    } else if (field === "description") {
      setTempValue(card.description || "");
    } else {
      const currentValue = card[field as keyof Card];
      setTempValue(currentValue?.toString() || "");
    }
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
    } else if (editingField === "tags") {
      updatedCard.tags = tempValue
        .split(",")
        .map((tag) => tag.trim())
        .map((tag) => tag.toLowerCase())
        .filter((tag) => tag.length > 0);
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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.shiftKey) {
      return;
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const handleIconInsert = (iconCode: string) => {
    if (editingField === "description" && textareaRef) {
      const cursorPosition = textareaRef.selectionStart;
      const { newText, newCursorPosition } = insertIconCode(
        tempValue,
        cursorPosition,
        iconCode
      );

      setTempValue(newText);

      // Set cursor position after React updates
      setTimeout(() => {
        textareaRef.setSelectionRange(newCursorPosition, newCursorPosition);
        textareaRef.focus();
      }, 0);
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
        <div className="flex flex-col gap-2 h-full">
          <textarea
            ref={setTextareaRef}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleDescriptionKeyDown}
            className="w-full flex-1 bg-gray-700 text-white rounded px-2 py-1 resize-none"
            placeholder="Enter description... (Shift+Enter for new line, Enter to save)"
            autoFocus
          />
          <div className="flex gap-2" data-html2canvas-ignore="true">
            <button
              onClick={saveEdit}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={cancelEdit}
              className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
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

    if (editingField === "tags") {
      elements.tags = (
        <input
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
          placeholder="Enter tags separated by commas"
          className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
          autoFocus
        />
      );
    }

    return elements;
  };

  function handleAspectIncrement(index: number): void {
    onCardChange(incrementAspectByIndex(index));
  }

  const incrementAspectByIndex = (aspectIndex: number): Card => {
    if (aspectIndex < 0 || aspectIndex >= ASPECTS.length) {
      return card;
    }

    const aspectCode = ASPECTS[aspectIndex];
    const updatedAspectList = { ...card.aspectList };

    if (aspectCode !== "FUNDAMENTAL") {
      const currentTotal = Object.entries(updatedAspectList).reduce(
        (sum, [aspect, count]) => {
          if (aspect === "FUNDAMENTAL") {
            return sum + (count > 0 ? 1 : 0);
          }
          return sum + count;
        },
        0
      );

      if (currentTotal >= MAX_ASPECT_ICONS) {
        return card;
      }
    }

    updatedAspectList[aspectCode] = (updatedAspectList[aspectCode] || 0) + 1;

    return {
      ...card,
      aspectList: sortAspectRecord(updatedAspectList),
    };
  };

  function handleAspectDecrement(index: number): void {
    onCardChange(decrementAspectByIndex(index));
  }

  const decrementAspectByIndex = (aspectIndex: number): Card => {
    if (aspectIndex < 0 || aspectIndex >= ASPECTS.length) {
      return card;
    }

    const aspectCode = ASPECTS[aspectIndex];
    const updatedAspectList = { ...card.aspectList };

    if (updatedAspectList[aspectCode] > 1) {
      updatedAspectList[aspectCode] -= 1;
    } else {
      delete updatedAspectList[aspectCode];
    }

    return {
      ...card,
      aspectList: sortAspectRecord(updatedAspectList),
    };
  };

  return (
    <div className="flex flex-row gap-1 relative">
      {editingField === "description" && (
        <div className="absolute -left-20 top-0 z-10">
          <IconInsertButtons onIconInsert={handleIconInsert} />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="w-48" data-html2canvas-ignore="true">
          <Select
            value={selectedTexture}
            onValueChange={(value) => setSelectedTexture(value as TextureType)}
            defaultValue="none"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select texture" />
            </SelectTrigger>
            <SelectContent>
              {TEXTURE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <CardDisplay
          card={card}
          className={className}
          onFieldClick={startEditing}
          editableElements={getEditableElements()}
          removeAspect={handleAspectDecrement}
          textureType={selectedTexture}
        />
      </div>

      <AspectSymbolSelector vertical={true} onSelect={handleAspectIncrement} />
    </div>
  );
};

export default CardEditor;
