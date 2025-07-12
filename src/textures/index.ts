import { fabricTexture } from "./fabricTexture";
import { paperTexture } from "./paperTexture";
import { subtleNoise } from "./subtleNoise";
import type { TextureFunction, TextureType } from "./types";

export const TEXTURES: Record<TextureType, TextureFunction | null> = {
  none: null,
  "subtle-noise": subtleNoise,
  paper: paperTexture,
  fabric: fabricTexture,
  metal: subtleNoise, // Placeholder - can implement later
  stone: subtleNoise, // Placeholder - can implement later
  wood: subtleNoise, // Placeholder - can implement later
  parchment: paperTexture, // Similar to paper for now
};

export const getTexture = (type: TextureType): TextureFunction | null => {
  return TEXTURES[type] || null;
};

export * from "./types";
export { fabricTexture, paperTexture, subtleNoise };
