import React from "react";
import type { TextureConfig } from "./types";

export const fabricTexture = (
  config: TextureConfig = {}
): React.ReactElement => {
  const {
    opacity = 0.25,
    intensity = 0.7,
    scale = 80,
    color = "#ddd",
  } = config;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        mixBlendMode: "multiply",
        backgroundImage: `
          linear-gradient(45deg, transparent 48%, ${color} 49%, ${color} 51%, transparent 52%),
          linear-gradient(-45deg, transparent 48%, ${color} 49%, ${color} 51%, transparent 52%)
        `,
        backgroundSize: `${scale * intensity}px ${scale * intensity}px`,
        transform: "translateZ(0)",
      }}
    />
  );
};
