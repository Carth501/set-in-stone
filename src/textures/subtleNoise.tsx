import React from "react";
import type { TextureConfig } from "./types";

export const subtleNoise = (config: TextureConfig = {}): React.ReactElement => {
  const { opacity = 0.5, intensity = 0.8, color = "#ffffff" } = config;

  const svgId = `noise-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        mixBlendMode: "multiply",
        // Ensure html2canvas can capture this
        transform: "translateZ(0)",
      }}
    >
      <svg width="100%" height="100%" className="w-full h-full">
        <defs>
          <filter id={svgId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              baseFrequency={0.9 * intensity}
              numOctaves="3"
              result="noise"
              seed="1"
            />
            <feColorMatrix in="noise" type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues={`0 ${opacity}`} />
            </feComponentTransfer>
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
