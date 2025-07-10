import React from "react";
import { Icons, type AspectType } from "../aspects/aspects";

// Icon code mappings - using single letters for brevity
export const ICON_CODES = {
  "{e}": "EXHAUST",
  "{b}": "BLOOM",
  "{c}": "CALLOUS",
  "{g}": "GRACE",
  "{l}": "LAW",
  "{m}": "MYTHIC",
  "{o}": "OCCULT",
  "{r}": "RELIC",
  "{t}": "TIDE",
  "{x}": "XENO",
  "{z}": "ZEAL",
  "{f}": "FUNDAMENTAL",
} as const;

export const REVERSE_ICON_CODES = Object.fromEntries(
  Object.entries(ICON_CODES).map(([code, aspect]) => [aspect, code])
) as Record<AspectType, string>;

export function interpolateIcons(text: string): React.ReactNode[] {
  if (!text) return [text];

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Find all icon codes in the text
  const regex = new RegExp(
    Object.keys(ICON_CODES)
      .map((code) => code.replace(/[{}]/g, "\\$&"))
      .join("|"),
    "g"
  );

  let match;
  while ((match = regex.exec(text)) !== null) {
    // Add text before the icon
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Add the icon
    const iconCode = match[0] as keyof typeof ICON_CODES;
    const aspectName = ICON_CODES[iconCode];
    parts.push(
      <img
        key={`${match.index}-${iconCode}`}
        src={Icons[aspectName]}
        alt={aspectName}
        className="inline w-5 h-5 vertical-align-top"
      />
    );

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export function insertIconCode(
  text: string,
  cursorPosition: number,
  iconCode: string
): {
  newText: string;
  newCursorPosition: number;
} {
  const before = text.slice(0, cursorPosition);
  const after = text.slice(cursorPosition);
  const newText = before + iconCode + after;

  return {
    newText,
    newCursorPosition: cursorPosition + iconCode.length,
  };
}
