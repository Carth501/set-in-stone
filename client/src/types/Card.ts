export type Card = {
  uuid: string;
  accessory: AccessoryType | null;
  type: CardType;
  name: string;
  aspectList: CardCost;
  aspectMask?: number;
  art: string;
  description: string;
  objectiveDescription: string;
  offence: number;
  defence: number;
  regeneration: number;
  tags: string[];
};

export type CardCost = {
  [key: string]: number;
};

export const blankCard: Card = {
  uuid: "",
  accessory: null,
  type: "CREATURE",
  name: "",
  aspectList: {},
  art: "",
  description: "",
  objectiveDescription: "",
  offence: 0,
  defence: 0,
  regeneration: 0,
  tags: [],
};

export const CARD_TYPES = [
  "CREATURE",
  "ENCHANTMENT",
  "DEVICE",
  "REACTION",
  "FAST",
  "SLOW",
  "GEM",
] as const;

export type CardType = (typeof CARD_TYPES)[number];

export const ACCESSORIES = ["UNIQUE", "OBJECTIVE"];

export type AccessoryType = (typeof ACCESSORIES)[number];
