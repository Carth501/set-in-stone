import React from "react";

export interface TextureConfig {
  opacity?: number;
  intensity?: number;
  scale?: number;
  color?: string;
  [key: string]: string | number | boolean | undefined; // Allow for texture-specific properties
}

export interface TextureFunction {
  (config?: TextureConfig): React.ReactElement;
}

export type TextureType = "none" | "subtle-noise" | "paper";
