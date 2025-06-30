export type Card = {
  type: CardType;
  name: string;
  aspectList: CardCost;
  description: string;
  offence: number;
  defence: number;
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
};

export type CardType =
  | "CREATURE"
  | "ENCHANTMENT"
  | "DEVICE"
  | "REACTION"
  | "FAST"
  | "SLOW";
