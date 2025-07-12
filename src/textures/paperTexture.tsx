import React from "react";
import type { TextureConfig } from "./types";

export const paperTexture = (
  config: TextureConfig = {}
): React.ReactElement => {
  const { opacity = 0.2, intensity = 0.6, color = "#f5f5dc" } = config;

  const svgId = `paper-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        mixBlendMode: "overlay",
        transform: "translateZ(0)",
      }}
    >
      <svg width="100%" height="100%" className="w-full h-full">
        <defs>
          <filter id={svgId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              baseFrequency={0.4 * intensity}
              numOctaves="4"
              result="paper"
              seed="2"
            />
            <feColorMatrix in="paper" type="saturate" values="0" />
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>
        <rect
          width="100%"
          height="100%"
          filter={`url(#${svgId})`}
          fill={color}
        />
      </svg>
    </div>
  );
};
