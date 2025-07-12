import { marbleTexture } from "./marbleTexture";
import { paperTexture } from "./paperTexture";
import { subtleNoise } from "./subtleNoise";
import type { TextureFunction, TextureType } from "./types";

export const TEXTURES: Record<TextureType, TextureFunction | null> = {
  none: null,
  "subtle-noise": subtleNoise,
  paper: paperTexture,
  marble: marbleTexture,
};

export const getTexture = (type: TextureType): TextureFunction | null => {
  return TEXTURES[type] || null;
};

export * from "./types";
export { marbleTexture, paperTexture, subtleNoise };
