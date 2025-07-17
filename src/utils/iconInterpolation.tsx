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
  "{r}": "RELIC",
  "{t}": "TIDE",
  "{w}": "WEIRD",
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
  let fundamentalCount = 0;
  let pendingFundamental = false;

  const flushFundamental = (index: number) => {
    if (pendingFundamental && fundamentalCount > 0) {
      parts.push(
        <span
          key={`fundamental-${index}`}
          className="relative inline-block align-bottom"
        >
          {renderFundamentalAspect("FUNDAMENTAL", fundamentalCount, 5)}
        </span>
      );
      fundamentalCount = 0;
      pendingFundamental = false;
    }
  };

  while ((match = regex.exec(text)) !== null) {
    const iconCode = match[0] as keyof typeof ICON_CODES;
    const aspectName = ICON_CODES[iconCode];

    if (aspectName === "FUNDAMENTAL") {
      if (!pendingFundamental && match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      fundamentalCount++;
      pendingFundamental = true;
    } else {
      flushFundamental(match.index);

      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      parts.push(
        <img
          key={`${match.index}-${iconCode}`}
          src={Icons[aspectName]}
          alt={aspectName}
          className="inline w-5 h-5 vertical-align-top"
        />
      );
    }

    lastIndex = regex.lastIndex;
  }

  flushFundamental(text.length);

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

export const renderFundamentalAspect = (
  aspect: string,
  count: number,
  size: number = 8,
  clickFunction?: () => void
) => (
  <>
    <img
      src={Icons[aspect as keyof typeof Icons]}
      alt={aspect}
      onClick={clickFunction}
      className={
        `w-${size} h-${size}` +
        (clickFunction ? "cursor-pointer hover:opacity-75" : "")
      }
    />
    <div
      className="absolute inset-0 flex items-center justify-center text-black 
		font-bold text-lg pointer-events-none"
    >
      {count}
    </div>
  </>
);
