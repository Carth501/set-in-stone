import React, { useEffect, useRef, useState } from "react";
import type { CardType } from "../types/Card";
import { CARD_TYPES } from "../types/Card";

type Props = {
  value: CardType;
  onChange: (cardType: CardType) => void;
  className?: string;
};

const CardTypeSelector: React.FC<Props> = ({ value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (cardType: CardType) => {
    onChange(cardType);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="w-full bg-gray-700 text-white rounded px-2 py-1 text-lg 
		font-bold text-left border border-gray-600 hover:bg-gray-600 
		focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {value}
        <span className="float-right">▼</span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 bg-gray-700 border 
		border-gray-600 rounded mt-1 z-10 overflow-y-auto"
        >
          {CARD_TYPES.map((cardType) => (
            <button
              key={cardType}
              type="button"
              onClick={() => handleSelect(cardType)}
              className={`w-full text-left px-2 py-1 text-lg font-bold 
				hover:bg-gray-600 ${value === cardType ? "bg-blue-600" : ""}`}
            >
              {cardType}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardTypeSelector;
