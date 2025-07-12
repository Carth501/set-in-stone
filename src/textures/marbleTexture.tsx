import React from "react";
import type { TextureConfig } from "./types";

export const marbleTexture = (
  config: TextureConfig = {}
): React.ReactElement => {
  const { intensity = 0.6, color = "#f8f8ff" } = config;

  const svgId = `marble-${Math.random().toString(36).substr(2, 9)}`;
  const noiseId = `marble-noise-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        mixBlendMode: "soft-light",
        transform: "translateZ(0)",
      }}
    >
      <svg width="100%" height="100%" className="w-full h-full">
        <defs>
          {/* Create turbulent noise for marble veining */}
          <filter id={noiseId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              baseFrequency={`${0.02 * intensity} ${0.008 * intensity}`}
              numOctaves="4"
              result="turbulence"
              seed="3"
              type="fractalNoise"
            />
            <feColorMatrix in="turbulence" type="saturate" values="0" />
          </filter>

          {/* Main marble effect */}
          <filter id={svgId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              baseFrequency={`${0.015 * intensity} ${0.004 * intensity}`}
              numOctaves="3"
              result="marble-base"
              seed="5"
              type="fractalNoise"
            />
            <feColorMatrix in="marble-base" type="saturate" values="0" />
            <feGaussianBlur
              in="marble-base"
              stdDeviation="1.5"
              result="blurred-marble"
            />
            <feComposite
              in="blurred-marble"
              in2="SourceGraphic"
              operator="multiply"
            />
          </filter>
        </defs>

        {/* Base marble layer with subtle veining */}
        <rect
          width="100%"
          height="100%"
          fill={color}
          filter={`url(#${svgId})`}
        />

        {/* Additional veining layer for more realistic marble effect */}
        <rect
          width="100%"
          height="100%"
          fill={color}
          filter={`url(#${noiseId})`}
        />
      </svg>
    </div>
  );
};
