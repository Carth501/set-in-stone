export type Card = {
  type: CardType;
  name: string;
  aspectList: CardCost;
  description: string;
  offence: number;
  defence: number;
  regeneration: number;
};

export type CardCost = {
  [key: string]: number;
};

export const blankCard: Card = {
  type: "CREATURE",
  name: "",
  aspectList: {},
  description: "",
  offence: 0,
  defence: 0,
  regeneration: 0,
};

export const CARD_TYPES = [
  "CREATURE",
  "ENCHANTMENT",
  "DEVICE",
  "REACTION",
  "FAST",
  "SLOW",
] as const;

export type CardType = (typeof CARD_TYPES)[number];
