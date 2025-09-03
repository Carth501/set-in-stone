import React from "react";
import { interpolateIcons } from "./iconInterpolation";

export interface ParsedDescription {
  gameText: React.ReactNode[];
  loreText: string | null;
}

export function parseDescriptionWithLore(
  description: string
): ParsedDescription {
  const loreMarker = "{lore}";
  const loreIndex = description.indexOf(loreMarker);

  if (loreIndex === -1) {
    return {
      gameText: interpolateIcons(description),
      loreText: null,
    };
  }

  const gameTextPart = description.slice(0, loreIndex);
  const loreTextPart = description.slice(loreIndex + loreMarker.length);

  return {
    gameText: interpolateIcons(gameTextPart),
    loreText: loreTextPart,
  };
}
